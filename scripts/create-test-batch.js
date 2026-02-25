import hre from "hardhat";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error("Contract address not found in .env.local");
    }

    console.log("🚀 Creating New Batch on Blockchain...");
    console.log("📍 Contract Address:", contractAddress);

    const [signer] = await hre.ethers.getSigners();
    console.log("✍️  Signing with:", signer.address);

    const HerbTrace = await hre.ethers.getContractAt("HerbTrace", contractAddress);

    const batchId = "batch-" + Date.now();
    const herbName = "Organic Holy Basil (Tulsi)";
    const manufacturerName = "HerbTrace Global Labs";
    const harvestDate = "2026-01-10";
    const manufactureDate = "2026-01-11";
    const expiryDate = "2028-01-11";
    const origin = "Uttarakhand, India";
    const details = "Premium grade organic tulsi leaves, dried at low temperature to preserve essential oils.";
    const ipfsCIDs = ["QmRealDocumentHashExample123"];

    console.log(`📦 Registering batch: ${batchId}...`);

    const tx = await HerbTrace.registerBatch(
        batchId,
        herbName,
        manufacturerName,
        harvestDate,
        manufactureDate,
        expiryDate,
        origin,
        details,
        ipfsCIDs
    );

    console.log("⌛ Waiting for confirmation...");
    const receipt = await tx.wait();

    console.log("\n✅ BATCH CREATED SUCCESSFULLY!");
    console.log("====================================");
    console.log("🆔 Batch ID:", batchId);
    console.log("🔗 Transaction Hash:", tx.hash);
    console.log("📍 Verify at: http://localhost:3000/verify?batchId=" + batchId);
    console.log("====================================\n");
}

main().catch((error) => {
    console.error("\n❌ Error creating batch:", error.message);
    process.exitCode = 1;
});
