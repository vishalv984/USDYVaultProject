import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const VAULT_ADDRESS = "0x54C1f289f10BADd69aEDD662f518B0FEc983dd75";

  const usdyVault = await ethers.getContractAt("USDYVault", VAULT_ADDRESS);

  const totalAssets = await usdyVault.totalAssets();
  const totalShares = await usdyVault.totalSupply();

  const nav = ethers.formatUnits(totalAssets, 18) / ethers.formatUnits(totalShares, 18);

  console.log("Total Assets in Vault:", ethers.formatUnits(totalAssets, 18));
  console.log("Total Shares in Vault:", ethers.formatUnits(totalShares, 18));
  console.log("Net Asset Value (NAV):", nav.toFixed(18));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
