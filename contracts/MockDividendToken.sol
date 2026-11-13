// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Test-only payment token representing a stable-value dividend currency.
contract MockDividendToken is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("CorpChain Demo Dollar", "cUSD")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
