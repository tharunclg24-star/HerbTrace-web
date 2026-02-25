import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
    console.log("🔍 Checking MongoDB URI...");

    if (!MONGODB_URI) {
        console.error("❌ Error: MONGODB_URI is not defined in .env.local");
        process.exit(1);
    }

    console.log(`🔗 Connecting to: ${MONGODB_URI.split('@')[1] || 'Hidden URI'}`);

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB connected successfully!");

        // Check connection state
        if (mongoose.connection.readyState === 1) {
            console.log("📊 Connection State: Connected");
        }

        // List collections as a test
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📂 Found ${collections.length} collections`);

        await mongoose.disconnect();
        console.log("🔌 Disconnected successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
}

testConnection();
