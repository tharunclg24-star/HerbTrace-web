import { ethers } from "ethers";

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const address = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

    console.log(`Checking code at ${address} on Localhost...`);

    try {
        const code = await provider.getCode(address);
        console.log("Code length:", code.length);

        if (code === "0x") {
            console.log("❌ NO CODE CODE FOUND at this address. The contract is NOT deployed here.");
        } else {
            console.log("✅ Code found! Contract exists.");

            // Try calling a view function
            const ABI = ["function getBatchCount() public view returns (uint256)"];
            const contract = new ethers.Contract(address, ABI, provider);
            try {
                const count = await contract.getBatchCount();
                console.log("getBatchCount() returned:", count.toString());
            } catch (e) {
                console.log("Error calling getBatchCount:", e.message);
            }
        }
    } catch (error) {
        console.error("Error connecting to node:", error.message);
    }
}

main();
