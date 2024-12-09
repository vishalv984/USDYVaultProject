import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
    // Get the first signer (deployer) from the Hardhat environment
    const [deployer] = await ethers.getSigners();

    // Fetch the deployer's balance from the provider
    const balance = await deployer.provider.getBalance(deployer.address);

    // Display the address and balance
    console.log(`Deployer Address: ${deployer.address}`);
    console.log(`Deployer Balance: ${ethers.formatEther(balance)} ETH`);
}

main().catch((error) => {
    console.error("Error:", error.message || error);
    process.exitCode = 1;
});