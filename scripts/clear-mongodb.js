import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

async function clearDatabase() {
    console.log("\n🗄️  Clearing MongoDB Database...\n");

    if (!process.env.MONGODB_URI) {
        console.log("ℹ️  MongoDB not configured - nothing to clear");
        console.log("   (Running in mock mode)\n");
        return;
    }

    try {
        console.log("📡 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected");

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const hasProducts = collections.some(col => col.name === 'products');

        if (hasProducts) {
            console.log("🗑️  Dropping products collection...");
            await db.collection('products').drop();
            console.log("✅ Products collection cleared!");
        } else {
            console.log("ℹ️  No products collection found (already empty)");
        }

        await mongoose.disconnect();
        console.log("✅ Database cleared successfully!\n");

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

clearDatabase();
