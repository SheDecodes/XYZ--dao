const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { XYZtoken_CONTRACT_ADDRESS } = require("../constants");

async function main() {
  const XYZdao = await ethers.getContractFactory("XYZdao");
  const XYZdaoDeploy = await XYZdao.deploy(
    XYZtoken_CONTRACT_ADDRESS,
    {
      value: ethers.utils.parseEther("0.001"),
    }
  );
  await XYZdaoDeploy.deployed();

  console.log("XYZ DAO deployed to: ", XYZdaoDeploy.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });