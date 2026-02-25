import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
    if (!MONGODB_URI) {
        console.warn('⚠️  MONGODB_URI not configured - using mock mode');
        return false;
    }

    if (mongoose.connection.readyState >= 1) return true;

    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
        });
        console.log("✅ MongoDB connected successfully");
        return true;
    } catch (error) {
        console.error("❌ MongoDB connection error:", error instanceof Error ? error.message : error);
        return false;
    }
};
