import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  // Get the deployer's address
  const [deployer] = await ethers.getSigners();

  // Replace this with your deployed USDYToken address
  const TOKEN_ADDRESS = "0x8844Cb785ae6A2d6Fc87A99259e68298B71743aC";

  if (!TOKEN_ADDRESS) {
    throw new Error("Please deploy the USDYToken first and provide its address!");
  }

  // Set the Fund Administrator to the deployer's address (or another address)
  const FUND_ADMIN_ADDRESS = deployer.address; // Replace if needed

  console.log("Deploying USDYVault with the following parameters:");
  console.log("USDYToken Address:", TOKEN_ADDRESS);
  console.log("Fund Administrator Address:", FUND_ADMIN_ADDRESS);

  // Deploy the USDYVault
  const USDYVault = await ethers.getContractFactory("USDYVault");
  const usdyVault = await USDYVault.deploy(TOKEN_ADDRESS, FUND_ADMIN_ADDRESS);
  await usdyVault.waitForDeployment();

  console.log("USDYVault deployed at:", usdyVault.target);
  console.log("Fund Administrator Address:", FUND_ADMIN_ADDRESS);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
