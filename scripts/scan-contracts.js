import hre from "hardhat";

async function main() {
    const addresses = [
        "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Remix default / first deploy
        "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", // Second deploy from clear-all-data.js
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"  // Third potential address
    ];

    const batchId = "bch11"; // The one from user's screenshot

    console.log(`🔍 Checking batch: "${batchId}" across potential contract addresses...\n`);

    for (const addr of addresses) {
        try {
            const code = await hre.ethers.provider.getCode(addr);
            if (code === "0x") {
                console.log(`❌ ${addr}: No contract here.`);
                continue;
            }

            const contract = await hre.ethers.getContractAt("HerbTrace", addr);
            const count = await contract.getBatchCount();
            console.log(`✅ ${addr}: Contract found! (Total batches: ${count})`);

            try {
                const batch = await contract.getBatch(batchId);
                console.log(`   ✨ FOUND BATCH "${batchId}" here!`);
                console.log(`   Name: ${batch.herbName}`);
            } catch (e) {
                console.log(`   🔸 Batch "${batchId}" NOT found in this contract.`);
            }
        } catch (err) {
            console.log(`❌ ${addr}: Error connecting (${err.message.slice(0, 50)}...)`);
        }
        console.log("-".repeat(40));
    }
}

main().catch(console.error);
