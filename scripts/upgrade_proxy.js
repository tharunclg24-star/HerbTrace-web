import hre from "hardhat";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
    const proxyAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!proxyAddress) {
        console.error("Error: NEXT_PUBLIC_CONTRACT_ADDRESS not found in .env.local");
        process.exit(1);
    }

    console.log(`Upgrading Proxy at: ${proxyAddress}...`);

    const HerbTrace = await hre.ethers.getContractFactory("HerbTrace");
    // Upgrade the proxy to the new implementation
    const herbTrace = await hre.upgrades.upgradeProxy(proxyAddress, HerbTrace);
    await herbTrace.waitForDeployment();

    console.log("✅ HerbTrace upgraded successfully");
    console.log("Address remains:", herbTrace.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
