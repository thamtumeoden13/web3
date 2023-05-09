// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.18",
// };


// https://eth-sepolia.g.alchemy.com/v2/oXj4seXXKRcvo967b4oGFeOSZpZeCMKr

require('@nomiclabs/hardhat-waffle')
require("dotenv").config()

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPORIA_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
      chainId: process.env.CHAIN_ID,
    }
  }
}