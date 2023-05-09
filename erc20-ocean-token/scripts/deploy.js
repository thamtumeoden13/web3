
const hre = require("hardhat");

async function main() {
  const OceanToken = await hre.ethers.getContractFactory("OceanToken");
  const oceanToken = await OceanToken.deploy(100000000, 50);

  await oceanToken.deployed();

  console.log(`OceanToken deployed to: ${oceanToken.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
