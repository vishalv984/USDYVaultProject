import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const usdyTokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Replace with the deployed USDY token address
  const fundAdministratorAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"; // Replace with actual admin address
  const feeRecipientAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"; // Replace with actual fee recipient address
  const managementFee = 500; // Example: 5% management fee

  // Get contract factory and deploy the USDYVault contract
  const USDYVault = await ethers.getContractFactory("USDYVault");
  const usdyVault = await USDYVault.deploy(
    usdyTokenAddress,
    fundAdministratorAddress,
    feeRecipientAddress,
    managementFee
  );

  await usdyVault.waitForDeployment();

  console.log("USDYVault deployed to:", usdyVault.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// vault address:0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9
