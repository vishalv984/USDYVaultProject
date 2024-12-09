require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            },
            debug: {
                revertStrings: "debug", // Strips out revert strings in production
            },
        },
    },
    

    networks: {
        hardhat: {
            initialBaseFeePerGas: 0,
            gasPrice: 0,
            chainId: 1337,
            accounts: {
                count: 20,
            },
        },
        sepolia: {
            url: process.env.INFURA_SEPOLIA_ENDPOINT,
            accounts: [process.env.PRIVATE_KEY]
        }
    }
};
