require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-goerli.alchemyapi.io/v2/qjKRBJfIDOwbrbQ6dH3vOoE2QjLHKHLj",
      accounts: [PRIVATE_KEY],
    },
  },
}
