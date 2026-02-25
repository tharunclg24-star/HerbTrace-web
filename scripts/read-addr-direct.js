import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');

try {
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split(/\r?\n/);
        const addrLine = lines.find(l => l.trim().startsWith('NEXT_PUBLIC_CONTRACT_ADDRESS='));
        if (addrLine) {
            console.log("FOUND IN FILE:");
            console.log(addrLine);
        } else {
            console.log("Key NEXT_PUBLIC_CONTRACT_ADDRESS not found in file.");
        }
    } else {
        console.log(".env.local file not found.");
    }
} catch (err) {
    console.error(err);
}
