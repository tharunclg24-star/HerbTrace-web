import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(process.cwd(), '.env.local');

console.log(`Checking ${envPath}...`);

if (fs.existsSync(envPath)) {
    console.log("File exists.");
    try {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        if (envConfig.PINATA_JWT) {
            console.log("PINATA_JWT is present in .env.local");
            console.log(`Value length: ${envConfig.PINATA_JWT.length}`);
            if (envConfig.PINATA_JWT.length > 20) {
                console.log(`Starts with: ${envConfig.PINATA_JWT.substring(0, 10)}...`);
            } else {
                console.log("Warning: Token seems very short.");
            }
        } else {
            console.error("PINATA_JWT is NOT present in .env.local");
            console.log("Keys found:", Object.keys(envConfig));
        }
    } catch (e) {
        console.error("Error parsing .env.local:", e);
    }
} else {
    console.error("File .env.local does NOT exist at expected path.");
}
