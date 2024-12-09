import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const TOKEN_ADDRESS = "0x8844Cb785ae6A2d6Fc87A99259e68298B71743aC"; // Replace with deployed token address
  const usdyToken = await ethers.getContractAt("USDYToken", TOKEN_ADDRESS);

  const investorAddresses = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    // Add more investor addresses
  ];

  for (const address of investorAddresses) {
    const tx = await usdyToken.transfer(address, ethers.parseUnits("1000", 18)); // Each gets 1000 USDY
    await tx.wait();
    console.log(`Transferred 1000 USDY to ${address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
