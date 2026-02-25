const ethers = require('ethers');

async function check() {
    // Connect to the node running on 0.0.0.0 (accessed via IP)
    const provider = new ethers.JsonRpcProvider("http://100.100.7.131:8545");

    // The address user wants to use
    const address = "0x59b670e9fA9D0A427751Af201D676719a970857b";

    // The default Hardhat address (my proposed fix)
    const defaultAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    console.log("Checking for contract code...");

    const codeUser = await provider.getCode(address);
    if (codeUser === '0x') {
        console.log(`❌ User Address ${address}: NO CONTRACT FOUND (Code is empty).`);
    } else {
        console.log(`✅ User Address ${address}: Contract Found! (${codeUser.length} bytes)`);
    }

    const codeDefault = await provider.getCode(defaultAddr);
    if (codeDefault === '0x') {
        console.log(`❌ Default Address ${defaultAddr}: NO CONTRACT FOUND.`);
    } else {
        console.log(`✅ Default Address ${defaultAddr}: Contract Found! (${codeDefault.length} bytes)`);
    }
}

check().catch(console.error);
