require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_HTTP_URL = process.env.QUICKNODE_HTTP_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const POLYGONSCAN_API_KEY=process.env.POLYGONSCAN_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    matic: {
      url: "https://rpc-mumbai.maticvigil.com/v1/8b5ac893d2e43e06cbfc9f676273e63c0079b7ec",
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
        apiKey: process.env.POLYGONSCAN_API_KEY
      },
  solidity: "0.8.9",
};
//npx hardhat run scripts/deploy.js --network matic