import hre from "hardhat";

async function main() {
    const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log(`Checking address: ${address} on network: ${hre.network.name}`);

    const code = await hre.ethers.provider.getCode(address);
    if (code === "0x") {
        console.log("❌ NO CONTRACT FOUND at this address. Code is empty.");
        console.log("This usually means the contract wasn't deployed to this node instance, or the node was restarted.");
    } else {
        console.log(`✅ CONTRACT FOUND! Code length: ${code.length}`);
    }
}

main().catch(console.error);
