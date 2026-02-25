import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
// The Default Hardhat Address (Always the first deployment on a fresh node)
const validAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const key = 'NEXT_PUBLIC_CONTRACT_ADDRESS';

try {
    let content = '';
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
    }

    const lines = content.split(/\r?\n/);
    let found = false;
    const newLines = lines.map(line => {
        if (line.trim().startsWith(`${key}=`)) {
            found = true;
            return `${key}=${validAddress}`;
        }
        return line;
    });

    if (!found) {
        newLines.push(`${key}=${validAddress}`);
    }

    fs.writeFileSync(envPath, newLines.join('\n'));
    console.log(`Force updated ${key} to ACTIVE address: ${validAddress}`);

} catch (err) {
    console.error('Error updating .env.local:', err);
}
