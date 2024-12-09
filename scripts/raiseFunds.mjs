import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const VAULT_ADDRESS = "0x54C1f289f10BADd69aEDD662f518B0FEc983dd75";
  
  const TOKEN_ADDRESS = "0x8844Cb785ae6A2d6Fc87A99259e68298B71743aC";

  const fundAdminSigner = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);

  const usdyVault = await ethers.getContractAt("USDYVault", VAULT_ADDRESS, fundAdminSigner);
  const usdyToken = await ethers.getContractAt("USDYToken", TOKEN_ADDRESS, fundAdminSigner);

  const fundRaiseAmount = ethers.parseUnits("10", 18);

  const approveTx = await usdyToken.approve(VAULT_ADDRESS, fundRaiseAmount);
  await approveTx.wait();

  const raiseFundsTx = await usdyVault.raiseFunds(fundRaiseAmount);
  await raiseFundsTx.wait();

  console.log(`Raised ${ethers.formatUnits(fundRaiseAmount, 18)} USDY to the vault.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
