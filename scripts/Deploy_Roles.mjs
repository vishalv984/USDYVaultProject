import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  console.log("Deploying FundAdministrator contract...");
  const FundAdministrator = await ethers.getContractFactory("FundAdministrator");
  const fundAdministrator = await FundAdministrator.deploy();
  await fundAdministrator.waitForDeployment();
  console.log("FundAdministrator deployed to:", fundAdministrator.address);

  console.log("Deploying FeeRecipient contract...");
  const FeeRecipient = await ethers.getContractFactory("FeeRecipient");
  const feeRecipient = await FeeRecipient.deploy();
  await feeRecipient.waitForDeployment();
  console.log("FeeRecipient deployed to:", feeRecipient.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
