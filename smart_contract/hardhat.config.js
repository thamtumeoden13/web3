// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.18",
// };


// https://eth-sepolia.g.alchemy.com/v2/oXj4seXXKRcvo967b4oGFeOSZpZeCMKr

require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/oXj4seXXKRcvo967b4oGFeOSZpZeCMKr',
      accounts: ['855c80bc588d50dd63b59246d2c1bc6956f555c55795852c094b8fb1d7db80de'],
      chainId: 11155111,
    }
  }
}