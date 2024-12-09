import { expect } from "chai";
import hardhat from 'hardhat';
const { ethers } = hardhat;


describe("USDYVault NAV-Based Share Issuance", function () {
  let USDYToken, usdyToken, USDYVault, usdyVault, owner, investor1, investor2;

  beforeEach(async function () {
    [owner, investor1, investor2] = await ethers.getSigners();

    // Deploy USDYToken with an initial supply of 1000 tokens
    USDYToken = await ethers.getContractFactory("USDYToken");
    usdyToken = await USDYToken.deploy(ethers.parseUnits("1000", 18));
    await usdyToken.waitForDeployment();

    console.log("USDYToken Address:", usdyToken.target);

    // Deploy USDYVault with USDYToken as the underlying asset
    USDYVault = await ethers.getContractFactory("USDYVault");
    usdyVault = await USDYVault.deploy(usdyToken.target);
    await usdyVault.waitForDeployment();

    console.log("USDYVault Address:", usdyVault.target);

    // Distribute some tokens to investors
    await usdyToken.transfer(investor1.address, ethers.parseUnits("100", 18));
    await usdyToken.transfer(investor2.address, ethers.parseUnits("200", 18));
  });

  it("Should calculate NAV correctly and issue shares based on NAV", async function () {
    const investor1Deposit = ethers.parseUnits("100", 18);
    await usdyToken.connect(investor1).approve(usdyVault.target, investor1Deposit);
    await usdyVault.connect(investor1).deposit(investor1Deposit, investor1.address);

    const investor1Shares = await usdyVault.balanceOf(investor1.address);
    expect(investor1Shares).to.equal(investor1Deposit);
  });
});
