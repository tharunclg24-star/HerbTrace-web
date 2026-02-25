import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("❌ MONGODB_URI not found");
    process.exit(1);
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        console.log("🔗 Attempting to connect with MongoClient...");
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("❌ Connection failed error details:");
        console.error(error.name);
        console.error(error.message);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
