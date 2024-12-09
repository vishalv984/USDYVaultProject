import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const VAULT_ADDRESS = "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707";//vault address
  const TOKEN_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; //token address

  // Load wallets for Investor 1 and Investor 2
  const investor1 = new ethers.Wallet(process.env.PRIVATE_KEY_INVESTOR1, ethers.provider);
  const investor2 = new ethers.Wallet(process.env.PRIVATE_KEY_INVESTOR2, ethers.provider);

  // Connect to contracts
  const usdyVault = await ethers.getContractAt("USDYVault", VAULT_ADDRESS);
  const usdyToken = await ethers.getContractAt("USDYToken", TOKEN_ADDRESS);

  // Investor 1 deposit
  const depositAmount1 = ethers.parseUnits("100", 18); // Investor 1 deposits 100 USDY
  console.log(`Investor 1 is depositing ${ethers.formatUnits(depositAmount1, 18)} USDY...`);

  await usdyToken.connect(investor1).approve(VAULT_ADDRESS, depositAmount1);
  const depositTx1 = await usdyVault.connect(investor1).deposit(depositAmount1, investor1.address);
  await depositTx1.wait();

  console.log("Investor 1 deposit successful!");
  logVaultState(usdyVault, "After Investor 1 Deposit");

  // Simulate vault value increase (profits added by the fund administrator)
  const profitAmount = ethers.parseUnits("10", 18); // 10 USDY added to the vault
  console.log(`Adding ${ethers.formatUnits(profitAmount, 18)} USDY profit to the vault...`);
  await usdyToken.connect(investor1).transfer(VAULT_ADDRESS, profitAmount); // Simulating profit addition
  console.log("Profit added successfully!");
  logVaultState(usdyVault, "After Adding Profit");

  // Investor 2 deposit
  const depositAmount2 = ethers.parseUnits("200", 18); // Investor 2 deposits 200 USDY
  console.log(`Investor 2 is depositing ${ethers.formatUnits(depositAmount2, 18)} USDY...`);

  await usdyToken.connect(investor2).approve(VAULT_ADDRESS, depositAmount2);
  const depositTx2 = await usdyVault.connect(investor2).deposit(depositAmount2, investor2.address);
  await depositTx2.wait();

  console.log("Investor 2 deposit successful!");
  logVaultState(usdyVault, "After Investor 2 Deposit");
}

async function logVaultState(vault, message) {
  const totalAssets = await vault.totalAssets(); // Total assets in the vault
  const totalShares = await vault.totalSupply(); // Total shares issued

  // Calculate NAV
  const nav = totalShares > 0n
    ? (totalAssets * 10n ** 18n) / totalShares
    : 10n ** 18n; // 

  console.log(`\n${message}:`);
  console.log(`Total Assets in Vault: ${ethers.formatUnits(totalAssets, 18)} USDY`);
  console.log(`Total Shares in Vault: ${ethers.formatUnits(totalShares, 18)}`);
  console.log(`Net Asset Value (NAV): ${ethers.formatUnits(nav, 18)}\n`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
