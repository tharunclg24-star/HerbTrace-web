import { JsonRpcProvider } from "ethers";

// Connect to the LAN IP where the node is running
const provider = new JsonRpcProvider("http://100.100.7.131:8545");

async function checkCode() {
    const address = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F";
    console.log(`Checking code at ${address} on node 100.100.7.131...`);

    try {
        const code = await provider.getCode(address);
        if (code === "0x") {
            console.log("RESULT: NO_CODE_FOUND");
            console.log("❌ This address is EMPTY on the current blockchain.");
        } else {
            console.log("RESULT: CODE_FOUND");
            console.log(`✅ Contract exists! Code length: ${code.length} bytes.`);
        }
    } catch (error) {
        console.error("Error connecting to node:", error.message);
    }
}

checkCode();
