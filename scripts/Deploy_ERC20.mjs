import hardhat from 'hardhat';
const { ethers } = hardhat;

async function main() {
  // Define the initial supply of tokens (e.g., 1000 tokens with 18 decimals)
  const initialSupply = ethers.parseUnits("1000000", 18);

  // Get the contract factory for USDYToken
  const USDYToken = await ethers.getContractFactory("USDYToken");

  // Deploy the USDYToken with the specified initial supply
  const usdyToken = await USDYToken.deploy(initialSupply);

  // Wait for the deployment to finish
  await usdyToken.waitForDeployment();

  // Log the address of the deployed token contract
  console.log("USDYToken deployed to:", usdyToken.target);
}

// Execute the script and handle any errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
