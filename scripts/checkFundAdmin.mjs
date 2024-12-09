import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const VAULT_ADDRESS = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"; // Replace with deployed vault address
  const usdyVault = await ethers.getContractAt("USDYVault", VAULT_ADDRESS);

  const fundAdmin = await usdyVault.fundAdministrator();
  console.log("Current Fund Administrator Address:", fundAdmin);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
