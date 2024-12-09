// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Pausable.sol";

contract USDYVault is ERC4626, Pausable {
    address public fundAdministrator;
    address public feeRecipient;
    uint256 public managementFee; // Fee in basis points (e.g., 50 = 0.5%)
    uint256 public constant MIN_DEPOSIT = 1e18; // Minimum deposit amount (1 token with 18 decimals)

    event FundsRaised(uint256 amount, address raisedBy);
    event FundsDeposited(uint256 amount, address depositor);
    event EmergencyWithdrawal(uint256 amount, address recipient);
    event FundAdministratorUpdated(address oldAdmin, address newAdmin);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);
    event ManagementFeeUpdated(uint256 oldFee, uint256 newFee);

    constructor(IERC20 asset, address _fundAdministrator, address _feeRecipient, uint256 _managementFee)
        ERC20("USDY Vault Token", "vUSDY")
        ERC4626(asset)
    {
        require(_fundAdministrator != address(0), "Invalid administrator address");
        require(_feeRecipient != address(0), "Invalid fee recipient address");
        require(_managementFee <= 1000, "Fee exceeds maximum limit"); // Max 10%
        fundAdministrator = _fundAdministrator;
        feeRecipient = _feeRecipient;
        managementFee = _managementFee;
    }

    modifier onlyFundAdministrator() {
        require(msg.sender == fundAdministrator, "Caller is not the fund administrator");
        _;
    }

    // Function to raise funds (by Fund Administrator)
    function raiseFunds(uint256 amount) external onlyFundAdministrator whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(ERC20(asset()).transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        emit FundsRaised(amount, msg.sender);
    }

    // Override deposit function to emit event and update state
    function deposit(uint256 assets, address receiver)
        public
        override
        whenNotPaused
        returns (uint256)
    {
        require(assets >= MIN_DEPOSIT, "Deposit amount is below the minimum threshold");
        
        uint256 shares = super.deposit(assets, receiver);
        emit FundsDeposited(assets, receiver);
        return shares;
    }

    // Calculates NAV dynamically
    function calculateNAV() public view returns (uint256) {
        uint256 totalAssets = totalAssets();
        uint256 totalShares = totalSupply();
        return totalShares == 0 ? 1e18 : (totalAssets * 1e18) / totalShares;
    }

    // Emergency withdrawal (only for fund administrator)
    function emergencyWithdraw(address to) external onlyFundAdministrator whenPaused {
        uint256 totalAssets = totalAssets();
        require(totalAssets > 0, "No assets to withdraw");
        require(to != address(0), "Invalid recipient address");

        require(ERC20(asset()).transfer(to, totalAssets), "Emergency withdrawal failed");
        emit EmergencyWithdrawal(totalAssets, to);
    }

    // Update fund administrator
    function updateFundAdministrator(address newAdmin) external onlyFundAdministrator {
        require(newAdmin != address(0), "Invalid new administrator address");
        emit FundAdministratorUpdated(fundAdministrator, newAdmin);
        fundAdministrator = newAdmin;
    }

    // Update fee recipient
    function updateFeeRecipient(address newFeeRecipient) external onlyFundAdministrator {
        require(newFeeRecipient != address(0), "Invalid fee recipient address");
        emit FeeRecipientUpdated(feeRecipient, newFeeRecipient);
        feeRecipient = newFeeRecipient;
    }

    // Update management fee
    function updateManagementFee(uint256 newFee) external onlyFundAdministrator {
        require(newFee <= 1000, "Fee exceeds maximum limit"); // Max 10%
        emit ManagementFeeUpdated(managementFee, newFee);
        managementFee = newFee;
    }

    // Pause and unpause functionality
    function pause() external onlyFundAdministrator {
        _pause();
    }

    function unpause() external onlyFundAdministrator {
        _unpause();
    }

    // User-friendly getter for vault details
    function getFundDetails()
        external
        view
        returns (
            uint256 currentNAV,
            uint256 totalAssetsInVault,
            uint256 totalSharesInVault,
            address currentAdministrator,
            address currentFeeRecipient,
            uint256 currentManagementFee
        )
    {
        return (
            calculateNAV(),
            totalAssets(),
            totalSupply(),
            fundAdministrator,
            feeRecipient,
            managementFee
        );
    }
}
