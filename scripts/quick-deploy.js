import hre from "hardhat";

async function main() {
    console.log("🚀 Quick Deploy to Localhost...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const HerbTrace = await hre.ethers.getContractFactory("HerbTrace");
    const contract = await HerbTrace.deploy();
    await contract.waitForDeployment();

    const address = contract.target;
    console.log("\n✅ HerbTrace deployed to:", address);
    console.log("\n📋 Copy this address to your .env.local:");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main().catch(console.error);
