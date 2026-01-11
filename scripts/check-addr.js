import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const pathResolved = path.resolve(process.cwd(), '.env.local');

console.log(`Reading ${pathResolved}...`);

if (fs.existsSync(pathResolved)) {
    const envConfig = dotenv.parse(fs.readFileSync(pathResolved));
    console.log("NEXT_PUBLIC_CONTRACT_ADDRESS:", envConfig.NEXT_PUBLIC_CONTRACT_ADDRESS || "(Not Set)");
} else {
    console.log(".env.local file not found.");
}
