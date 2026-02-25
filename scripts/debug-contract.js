import hre from "hardhat";
const { ethers } = hre;

async function main() {
    const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log(`Checking contract at: ${address}`);

    try {
        const code = await ethers.provider.getCode(address);
        if (code === "0x") {
            console.log("❌ ERROR: No contract code found at this address.");
            console.log("Action Required: You likely need to deploy the contract.");
            console.log("Run: npx hardhat run scripts/deploy.js --network localhost");
        } else {
            console.log("✅ SUCCESS: Contract code found!");

            // Try to call a read function
            try {
                // Try simpler interface lookup first
                const count = await ethers.provider.call({
                    to: address,
                    data: "0xd8ca7693" // getBatchCount() signature
                });

                console.log(`✅ Connection working. Raw count output: ${count}`);

                // Decode if possible
                const countInt = parseInt(count, 16);
                console.log(`✅ Total Batches (Decoded): ${countInt}`);
            } catch (e) {
                console.log("⚠️ Contract found but could not call getBatchCount.", e.message);
            }
        }
    } catch (error) {
        console.error("❌ Failed to connect to node:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
