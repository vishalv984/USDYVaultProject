import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const VAULT_ADDRESS = "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707";
  const TOKEN_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

  const investorSigner = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);

  const usdyVault = await ethers.getContractAt("USDYVault", VAULT_ADDRESS, investorSigner);
  const usdyToken = await ethers.getContractAt("USDYToken", TOKEN_ADDRESS, investorSigner);

  const depositAmount = ethers.parseUnits("500", 18);

  const approveTx = await usdyToken.approve(VAULT_ADDRESS, depositAmount);
  await approveTx.wait();

  const depositTx = await usdyVault.deposit(depositAmount, investorSigner.address);
  await depositTx.wait();

  console.log(`Deposited ${ethers.formatUnits(depositAmount, 18)} USDY to the vault.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
