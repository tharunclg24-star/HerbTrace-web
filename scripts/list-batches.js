import hre from "hardhat";

async function main() {
    const address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const contract = await hre.ethers.getContractAt("HerbTrace", address);

    try {
        const count = await contract.getBatchCount();
        console.log(`Total Batches in Contract: ${count}`);

        if (count > 0) {
            console.log("Batch IDs:");
            // Since we don't have a public array getter for IDs in the contract (just the mapping)
            // wait, the contract HAS string[] public batchIds;
            for (let i = 0; i < count; i++) {
                const id = await contract.batchIds(i);
                console.log(`- ${id}`);
            }
        } else {
            console.log("No batches found. The contract is empty.");
        }
    } catch (e) {
        console.error("Error connecting to contract:", e.message);
    }
}

main().catch(console.error);
