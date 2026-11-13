const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CorpChain dividend distribution", function () {
  let owner, alice, bob, carol, share, cash, manager;
  const e = ethers.parseEther;

  beforeEach(async function () {
    [owner, alice, bob, carol] = await ethers.getSigners();
    share = await (await ethers.getContractFactory("ShareToken")).deploy(owner.address);
    cash = await (await ethers.getContractFactory("MockDividendToken")).deploy(owner.address);
    manager = await (await ethers.getContractFactory("DividendManager")).deploy(owner.address, await share.getAddress(), await cash.getAddress());
    await share.mint(alice.address, e("100"));
    await share.mint(bob.address, e("250"));
    await share.mint(carol.address, e("150"));
    await cash.mint(owner.address, e("5000"));
    await cash.approve(await manager.getAddress(), e("5000"));
    await cash.transfer(await manager.getAddress(), e("5000"));
    // ERC20Votes requires a holder to delegate to activate voting checkpoints.
    await share.connect(alice).delegate(alice.address);
    await share.connect(bob).delegate(bob.address);
    await share.connect(carol).delegate(carol.address);
    await ethers.provider.send("evm_mine", []);
  });

  async function declare() {
    const tx = await manager.declareDividend(e("5000"), "FY2026 interim dividend");
    await tx.wait();
  }

  it("declares a dividend against the prior-block ownership snapshot", async function () {
    await declare();
    const d = await manager.getDividend(1);
    expect(d.totalShares).to.equal(e("500"));
    expect(d.fundedAmount).to.equal(e("5000"));
  });

  it("calculates pro-rata entitlements", async function () {
    await declare();
    expect((await manager.calculateEntitlement(1, alice.address)).amount).to.equal(e("1000"));
    expect((await manager.calculateEntitlement(1, bob.address)).amount).to.equal(e("2500"));
    expect((await manager.calculateEntitlement(1, carol.address)).amount).to.equal(e("1500"));
  });

  it("pays an eligible shareholder", async function () {
    await declare();
    const before = await cash.balanceOf(alice.address);
    await manager.connect(alice).claimDividend(1);
    expect((await cash.balanceOf(alice.address)) - before).to.equal(e("1000"));
  });

  it("prevents a second claim", async function () {
    await declare();
    await manager.connect(alice).claimDividend(1);
    await expect(manager.connect(alice).claimDividend(1)).to.be.revertedWith("already claimed");
  });

  it("prevents a non-shareholder from claiming", async function () {
    await declare();
    await expect(manager.connect((await ethers.getSigners())[4]).claimDividend(1)).to.be.revertedWith("not eligible");
  });

  it("prevents non-owner dividend declarations", async function () {
    await expect(manager.connect(alice).declareDividend(e("100"), "unauthorised"))
      .to.be.revertedWithCustomError(manager, "OwnableUnauthorizedAccount");
  });

  it("uses snapshot ownership even if shares are transferred after the snapshot", async function () {
    await declare();
    await share.connect(alice).transfer(bob.address, e("100"));
    expect((await manager.calculateEntitlement(1, alice.address)).amount).to.equal(e("1000"));
    expect((await manager.calculateEntitlement(1, bob.address)).amount).to.equal(e("2500"));
  });
});
