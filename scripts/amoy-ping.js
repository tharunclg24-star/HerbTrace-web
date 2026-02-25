import { ethers } from "ethers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const RPC_URL = process.env.AMOY_RPC_URL || "https://rpc.ankr.com/polygon_amoy";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

async function main() {
    console.log(`\n🔍 Verifying Amoy Deployment...`);
    console.log(`📡 RPC URL: ${RPC_URL}`);
    console.log(`📜 Contract: ${CONTRACT_ADDRESS}`);

    if (!CONTRACT_ADDRESS) {
        console.error("❌ NEXT_PUBLIC_CONTRACT_ADDRESS is not defined in .env.local");
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);

    try {
        const code = await provider.getCode(CONTRACT_ADDRESS);

        if (code === "0x") {
            console.error("❌ NO CONTRACT found at this address on Amoy.");
        } else {
            console.log(`✅ SUCCESS: Contract exists! (Length: ${code.length} bytes)`);

            // Try a simple call
            const abi = ["function getBatchCount() public view returns (uint256)"];
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
            const count = await contract.getBatchCount();
            console.log(`📊 Current Batch Count: ${count.toString()}`);
        }
    } catch (error) {
        console.error("❌ Error connecting to Amoy RPC:", error.message);
        if (error.message.includes("429") || error.message.includes("too many errors")) {
            console.error("⚠️  This looks like a rate-limit error. A private RPC is highly recommended.");
        }
    }
}

main();
