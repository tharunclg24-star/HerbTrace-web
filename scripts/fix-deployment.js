import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    console.log("\n🔧 HerbTrace Deployment Fix\n");
    console.log("=".repeat(50));

    // Get deployer info
    const [deployer] = await hre.ethers.getSigners();
    console.log("📍 Deploying from:", deployer.address);

    // Get balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", hre.ethers.formatEther(balance), "ETH");

    // Deploy contract
    console.log("\n📦 Deploying HerbTrace contract...");
    const HerbTrace = await hre.ethers.getContractFactory("HerbTrace");
    const contract = await HerbTrace.deploy();
    await contract.waitForDeployment();

    const address = contract.target;
    console.log("✅ Contract deployed to:", address);

    // Update .env.local
    const envPath = path.resolve(process.cwd(), ".env.local");
    let envContent = "";

    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf8");
    }

    // Parse and update
    const lines = envContent.split(/\r?\n/);
    let updated = false;

    const newLines = lines.map(line => {
        if (line.trim().startsWith("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
            updated = true;
            return `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`;
        }
        return line;
    });

    if (!updated) {
        newLines.push(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
    }

    fs.writeFileSync(envPath, newLines.join("\n"));

    console.log("\n✅ Updated .env.local with contract address");
    console.log("\n" + "=".repeat(50));
    console.log("🎉 DEPLOYMENT COMPLETE!");
    console.log("=".repeat(50));
    console.log("\n📝 Next Steps:");
    console.log("1. Restart your dev server: npm run dev");
    console.log("2. Refresh your browser");
    console.log("3. Connect your wallet");
    console.log("4. Try registering a new batch\n");
}

main().catch((error) => {
    console.error("\n❌ Deployment failed:", error.message);
    process.exitCode = 1;
});
