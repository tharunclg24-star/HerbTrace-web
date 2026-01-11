import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const envPath = path.resolve(process.cwd(), '.env.local');

console.log(`Analyzing .env.local at ${envPath}...`);

try {
    if (!fs.existsSync(envPath)) {
        console.error("❌ File .env.local DOES NOT EXIST.");
        process.exit(1);
    }

    const rawBuffer = fs.readFileSync(envPath);
    console.log(`File size: ${rawBuffer.length} bytes`);

    // Check for weird characters/encoding issues
    const rawContent = rawBuffer.toString('utf8');
    if (rawContent.includes('\uFFFD')) {
        console.warn("⚠️ Warning: File contains replacement characters. Potential encoding issue (NOT UTF-8?).");
    }

    const config = dotenv.parse(rawContent);

    if ('PINATA_JWT' in config) {
        const val = config.PINATA_JWT;
        console.log("✅ PINATA_JWT key FOUND.");
        console.log(`   Value Type: ${typeof val}`);
        console.log(`   Value Length: ${val.length}`);

        if (val.length === 0) {
            console.error("❌ PINATA_JWT is EMPTY.");
        } else if (val.length < 50) {
            console.warn("⚠️ PINATA_JWT seems suspiciously short for a JWT (usually long).");
        } else {
            console.log("✅ Length looks plausible for a JWT.");
        }

        // Check for leading/trailing whitespace
        if (val !== val.trim()) {
            console.warn("⚠️ Value has leading/trailing whitespace. Code should handle this, but better to remove it.");
        }

        // Check for quotes included in value
        if (val.startsWith('"') || val.startsWith("'")) {
            console.warn("⚠️ Value starts with quotes. dotenv usually handles this, but verify.");
        }

    } else {
        console.error("❌ PINATA_JWT key NOT FOUND in parsed config.");
        console.log("Keys found:", Object.keys(config));
    }

} catch (e) {
    console.error("❌ Error reading/parsing file:", e);
}
