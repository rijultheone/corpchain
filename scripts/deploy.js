const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Share = await hre.ethers.getContractFactory("ShareToken");
  const share = await Share.deploy(deployer.address);
  await share.waitForDeployment();

  const Cash = await hre.ethers.getContractFactory("MockDividendToken");
  const cash = await Cash.deploy(deployer.address);
  await cash.waitForDeployment();

  const Manager = await hre.ethers.getContractFactory("DividendManager");
  const manager = await Manager.deploy(deployer.address, await share.getAddress(), await cash.getAddress());
  await manager.waitForDeployment();

  const deployment = {
    network: hre.network.name,
    chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    ShareToken: await share.getAddress(),
    MockDividendToken: await cash.getAddress(),
    DividendManager: await manager.getAddress(),
    deployedAt: new Date().toISOString()
  };
  fs.mkdirSync(path.join(__dirname, "../frontend/src"), { recursive: true });
  fs.writeFileSync(path.join(__dirname, "../frontend/src/deployment.json"), JSON.stringify(deployment, null, 2));
  fs.writeFileSync(path.join(__dirname, "../docs/deployment.json"), JSON.stringify(deployment, null, 2));
  console.log(deployment);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
