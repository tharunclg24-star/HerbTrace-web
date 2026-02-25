import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(process.cwd(), '.env.local');

console.log(`Checking ${envPath} for deployment credentials...`);

if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    const missingKeys = [];

    if (!envConfig.PRIVATE_KEY) missingKeys.push('PRIVATE_KEY');
    if (!envConfig.AMOY_RPC_URL) missingKeys.push('AMOY_RPC_URL');
    if (!envConfig.MONGODB_URI) missingKeys.push('MONGODB_URI');

    if (missingKeys.length > 0) {
        console.error("❌ Missing required environment variables:");
        missingKeys.forEach(key => console.error(`   - ${key}`));
        process.exit(1);
    } else {
        console.log("✅ All required environment variables found.");
        // Check formatting roughly
        if (!envConfig.AMOY_RPC_URL.startsWith('http')) console.warn("⚠️ AMOY_RPC_URL does not start with http/https");
        if (envConfig.PRIVATE_KEY.length < 64) console.warn("⚠️ PRIVATE_KEY seems too short (should be 64 chars hex)");
    }
} else {
    console.error("❌ .env.local file not found.");
    process.exit(1);
}
