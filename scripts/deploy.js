import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    console.log("Compiling & Deploying...");

    // This triggers compilation automatically
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const HerbTrace = await hre.ethers.getContractFactory("HerbTrace");
    const herbTrace = await HerbTrace.deploy();

    await herbTrace.waitForDeployment();
    const address = herbTrace.target;

    console.log(`HerbTrace contract deployed to ${address}`);

    // Update .env.local
    const envPath = path.resolve(process.cwd(), ".env.local");
    const key = "NEXT_PUBLIC_CONTRACT_ADDRESS";

    let content = "";
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, "utf8");
    }

    const lines = content.split(/\r?\n/);
    let found = false;
    const newLines = lines.map(line => {
        if (line.trim().startsWith(`${key}=`)) {
            found = true;
            return `${key}=${address}`;
        }
        return line;
    });

    if (!found) {
        newLines.push(`${key}=${address}`);
    }

    fs.writeFileSync(envPath, newLines.join("\n"));
    console.log(`Updated .env.local with new contract address: ${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
