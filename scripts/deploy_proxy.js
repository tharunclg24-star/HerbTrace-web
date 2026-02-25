import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    console.log("Deploying Proxy...");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const HerbTrace = await hre.ethers.getContractFactory("HerbTrace");

    // Deploy proxy with 'initialize' function
    const herbTrace = await hre.upgrades.deployProxy(HerbTrace, [], { initializer: 'initialize' });

    await herbTrace.waitForDeployment();

    // In ethers v6, target is the address
    const address = herbTrace.target;

    console.log(`HerbTrace (Proxy) deployed to ${address}`);

    // Update .env.local
    const envPath = path.resolve(process.cwd(), ".env.local");
    const addressKey = "NEXT_PUBLIC_CONTRACT_ADDRESS";
    const networkKey = "NEXT_PUBLIC_NETWORK";
    const networkName = hre.network.name;

    let content = "";
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, "utf8");
    }

    const lines = content.split(/\r?\n/);
    const updates = {
        [addressKey]: address,
        [networkKey]: networkName
    };

    let newLines = lines.map(line => {
        const trimmed = line.trim();
        for (const [key, value] of Object.entries(updates)) {
            if (trimmed.startsWith(`${key}=`)) {
                delete updates[key];
                return `${key}=${value}`;
            }
        }
        return line;
    });

    for (const [key, value] of Object.entries(updates)) {
        newLines.push(`${key}=${value}`);
    }

    if (newLines.length > 0 && newLines[newLines.length - 1] === "") {
        newLines.pop();
    }

    fs.writeFileSync(envPath, newLines.join("\n"));
    console.log(`✅ Updated .env.local with Proxy Address`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
