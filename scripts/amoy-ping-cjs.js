const { ethers } = require("ethers");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env.local") });

const RPC_URL = process.env.AMOY_RPC_URL || "https://rpc.ankr.com/polygon_amoy";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

async function main() {
    console.log(`\n🔍 Checking Amoy Deployment...`);
    console.log(`📡 RPC: ${RPC_URL}`);
    console.log(`📜 Contract: ${CONTRACT_ADDRESS}`);

    if (!CONTRACT_ADDRESS) {
        console.error("❌ NEXT_PUBLIC_CONTRACT_ADDRESS is missing!");
        process.exit(1);
    }

    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const code = await provider.getCode(CONTRACT_ADDRESS);

        if (code === "0x") {
            console.error("❌ NO CONTRACT found at this address.");
        } else {
            console.log(`✅ SUCCESS: Contract exists! (${code.length} bytes)`);

            const abi = ["function getBatchCount() public view returns (uint256)"];
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
            const count = await contract.getBatchCount();
            console.log(`📊 Batch Count: ${count.toString()}`);
        }
    } catch (error) {
        console.error("❌ Connection failed:", error.message);
    }
}

main();
