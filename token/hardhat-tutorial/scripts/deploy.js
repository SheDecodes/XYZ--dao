const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const XYZTokenContract = await hre.ethers.getContractFactory("XYZtoken");
  const deployedXYZTokenContract = await XYZTokenContract.deploy();
  await deployedXYZTokenContract.deployed();
  console.log(
    "XYZ Token Contract Address:",
    deployedXYZTokenContract.address
    
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });