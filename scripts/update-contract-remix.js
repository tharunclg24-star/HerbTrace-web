import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
// The user provided contract address from Remix
const newAddress = '0x59b670e9fA9D0A427751Af201D676719a970857b';
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
            return `${key}=${newAddress}`;
        }
        return line;
    });

    if (!found) {
        newLines.push(`${key}=${newAddress}`);
    }

    fs.writeFileSync(envPath, newLines.join('\n'));
    console.log(`Updated ${key} to ${newAddress}`);

} catch (err) {
    console.error('Error updating .env.local:', err);
}
