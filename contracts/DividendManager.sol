// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IHistoricalShareToken {
    function getPastVotes(address account, uint256 timepoint) external view returns (uint256);
    function getPastTotalSupply(uint256 timepoint) external view returns (uint256);
}

/// @title CorpChain Dividend Manager
/// @notice Creates funded dividend rounds against a past-block ownership snapshot.
/// @dev Both share and payment token are assumed to use 18 decimals in this prototype.
contract DividendManager is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 private constant SCALE = 1e18;
    IHistoricalShareToken public immutable shareToken;
    IERC20 public immutable paymentToken;
    uint256 public nextDividendId = 1;

    struct Dividend {
        uint256 snapshotBlock;
        uint256 totalShares;
        uint256 amountPerShare; // payment-token base units per share, scaled by 1e18
        uint256 fundedAmount;
        uint256 totalClaimed;
        string description;
        bool exists;
    }

    mapping(uint256 => Dividend) public dividends;
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    event DividendDeclared(uint256 indexed dividendId, uint256 indexed snapshotBlock, uint256 totalShares, uint256 fundedAmount, uint256 amountPerShare, string description);
    event DividendClaimed(uint256 indexed dividendId, address indexed shareholder, uint256 sharesAtSnapshot, uint256 amount);

    constructor(address initialOwner, address shareTokenAddress, address paymentTokenAddress)
        Ownable(initialOwner)
    {
        require(shareTokenAddress != address(0) && paymentTokenAddress != address(0), "zero address");
        shareToken = IHistoricalShareToken(shareTokenAddress);
        paymentToken = IERC20(paymentTokenAddress);
    }

    /// @notice Owner must approve and fund this contract before declaring a dividend.
    /// @param amount Total payment token amount in base units (18 decimals).
    function declareDividend(uint256 amount, string calldata description) external onlyOwner returns (uint256 dividendId) {
        require(amount > 0, "amount is zero");
        require(bytes(description).length > 0, "description required");
        require(block.number > 1, "insufficient block history");

        uint256 snapshot = block.number - 1;
        uint256 totalShares = shareToken.getPastTotalSupply(snapshot);
        require(totalShares > 0, "no shares at snapshot");
        require(paymentToken.balanceOf(address(this)) >= amount, "dividend not funded");

        uint256 perShare = (amount * SCALE) / totalShares;
        require(perShare > 0, "amount too small");

        dividendId = nextDividendId++;
        dividends[dividendId] = Dividend({
            snapshotBlock: snapshot,
            totalShares: totalShares,
            amountPerShare: perShare,
            fundedAmount: amount,
            totalClaimed: 0,
            description: description,
            exists: true
        });
        emit DividendDeclared(dividendId, snapshot, totalShares, amount, perShare, description);
    }

    function calculateEntitlement(uint256 dividendId, address shareholder) public view returns (uint256 shares, uint256 amount) {
        Dividend storage d = dividends[dividendId];
        require(d.exists, "unknown dividend");
        shares = shareToken.getPastVotes(shareholder, d.snapshotBlock);
        amount = (shares * d.amountPerShare) / SCALE;
    }

    function claimDividend(uint256 dividendId) external nonReentrant {
        Dividend storage d = dividends[dividendId];
        require(d.exists, "unknown dividend");
        require(!hasClaimed[dividendId][msg.sender], "already claimed");
        (uint256 shares, uint256 amount) = calculateEntitlement(dividendId, msg.sender);
        require(shares > 0 && amount > 0, "not eligible");
        require(d.totalClaimed + amount <= d.fundedAmount, "funding exhausted");

        hasClaimed[dividendId][msg.sender] = true;
        d.totalClaimed += amount;
        paymentToken.safeTransfer(msg.sender, amount);
        emit DividendClaimed(dividendId, msg.sender, shares, amount);
    }

    function getDividend(uint256 dividendId) external view returns (Dividend memory) {
        require(dividends[dividendId].exists, "unknown dividend");
        return dividends[dividendId];
    }
}
