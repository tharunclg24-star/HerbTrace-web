import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const newAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';
const key = 'NEXT_PUBLIC_CONTRACT_ADDRESS';

try {
    let content = '';
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
    }

    const lines = content.split('\n');
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

    const newContent = newLines.join('\n');
    fs.writeFileSync(envPath, newContent, 'utf8');
    console.log(`Updated ${key} to ${newAddress}`);

} catch (err) {
    console.error('Error updating .env.local:', err);
}
