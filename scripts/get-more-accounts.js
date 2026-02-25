import hre from "hardhat";

async function main() {
    const accounts = await hre.ethers.getSigners();
    for (let i = 1; i <= 3; i++) {
        console.log(`Account #${i}:`, accounts[i].address);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
