import hre from "hardhat";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const HerbTrace = await hre.ethers.getContractAt("HerbTrace", contractAddress);

    const count = await HerbTrace.getBatchCount();
    console.log(`\n📊 Total Batches on Chain: ${count}`);

    if (count > 0) {
        const lastBatchId = await HerbTrace.batchIds(count - 1n);
        const details = await HerbTrace.getBatch(lastBatchId);

        console.log("\n📦 Latest Batch Details:");
        console.log("----------------------------");
        console.log("ID:", lastBatchId);
        console.log("Name:", details.herbName);
        console.log("Manufacturer:", details.manufacturerName);
        console.log("Timestamp:", new Date(Number(details.timestamp) * 1000).toLocaleString());
        console.log("----------------------------\n");
    }
}

main().catch(console.error);
