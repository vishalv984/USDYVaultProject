import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const VAULT_ADDRESS = "0x82df19d4b39a9B2A49dd916F24470711DE3889C9"; // Replace with deployed vault address

  const fundAdminSigner = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider);

  const usdyVault = await ethers.getContractAt("USDYVault", VAULT_ADDRESS, fundAdminSigner);

  const newAdminAddress = "0xEa4260955289C71Ac0188c0f7f5E8E4131bbdD48"; // Replace with new fund administrator address

  const updateTx = await usdyVault.updateFundAdministrator(newAdminAddress);
  await updateTx.wait();

  console.log("Updated Fund Administrator to:", newAdminAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
