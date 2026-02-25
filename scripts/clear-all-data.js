import hre from "hardhat";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
    console.log("\n🧹 CLEARING ALL BATCH HISTORY\n");
    console.log("=".repeat(60));

    // Step 1: Deploy fresh contract (clears blockchain)
    console.log("\n📦 Step 1: Deploying fresh smart contract...");
    const [deployer] = await hre.ethers.getSigners();
    console.log("   Deployer:", deployer.address);

    const HerbTrace = await hre.ethers.getContractFactory("HerbTrace");
    const contract = await HerbTrace.deploy();
    await contract.waitForDeployment();

    const address = contract.target;
    console.log("   ✅ New contract deployed to:", address);

    // Step 2: Update .env.local
    console.log("\n📝 Step 2: Updating .env.local...");
    const envPath = path.resolve(process.cwd(), ".env.local");
    let envContent = "";

    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf8");
    }

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
    console.log("   ✅ Contract address updated");

    // Step 3: Clear MongoDB (if configured)
    console.log("\n🗄️  Step 3: Clearing MongoDB database...");
    if (process.env.MONGODB_URI) {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            const db = mongoose.connection.db;

            // Drop the products collection
            const collections = await db.listCollections().toArray();
            const hasProducts = collections.some(col => col.name === 'products');

            if (hasProducts) {
                await db.collection('products').drop();
                console.log("   ✅ MongoDB products collection cleared");
            } else {
                console.log("   ℹ️  No products collection found (already empty)");
            }

            await mongoose.disconnect();
        } catch (error) {
            console.log("   ⚠️  MongoDB error:", error.message);
            console.log("   ℹ️  Continuing anyway...");
        }
    } else {
        console.log("   ℹ️  MongoDB not configured (mock mode) - skipping");
    }

    // Step 4: Summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL BATCH HISTORY CLEARED!");
    console.log("=".repeat(60));
    console.log("\n📋 What was cleared:");
    console.log("   • Blockchain: All batches removed (fresh contract)");
    console.log("   • MongoDB: All products deleted");
    console.log("   • Contract Address: Updated to new deployment");
    console.log("\n🎯 Next Steps:");
    console.log("   1. Restart your dev server:");
    console.log("      npm run dev");
    console.log("   2. Refresh your browser");
    console.log("   3. Start registering fresh batches!");
    console.log("\n✨ You now have a completely clean slate!\n");
}

main().catch((error) => {
    console.error("\n❌ Error:", error.message);
    process.exitCode = 1;
});
