import { JsonRpcProvider } from "ethers";

// Connect to the currently running local node
const provider = new JsonRpcProvider("http://100.100.7.131:8545");

async function checkCode() {
    const address = "0x59b670e9fA9D0A427751Af201D676719a970857b";
    console.log(`Checking code at ${address}...`);

    try {
        const code = await provider.getCode(address);
        if (code === "0x") {
            console.log("RESULT: NO_CODE_FOUND");
            console.log("This means the contract does NOT exist on the current running blockchain.");
            console.log("Reason: The Hardhat Node was restarted, which wiped all previous data.");
        } else {
            console.log("RESULT: CODE_FOUND");
            console.log(`Contract exists! Code length: ${code.length} bytes.`);
        }
    } catch (error) {
        console.error("Error connecting to node:", error.message);
    }
}

checkCode();
