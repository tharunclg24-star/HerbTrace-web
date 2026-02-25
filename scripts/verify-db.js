import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;

console.log("----------------------------------------");
console.log("🔍 Checking MongoDB Connection...");
console.log(`📡 URI found: ${uri ? "YES (Hidden for security)" : "NO ❌"}`);

if (!uri) {
    console.error("❌ MONGODB_URI is missing in .env.local");
    process.exit(1);
}

async function checkConnection() {
    try {
        await mongoose.connect(uri);
        console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
        console.log(`🗄️  Database Name: ${mongoose.connection.name}`);
        console.log("----------------------------------------");

        // Clean up
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ CONNECTION FAILED:");
        console.error(error.message);
        console.log("----------------------------------------");
        process.exit(1);
    }
}

checkConnection();
