import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    batchId: string;
    name: string;
    manufacturer: string;
    manufactureDate: Date;
    harvestDate?: Date;
    expiryDate: Date;
    origin: string;
    ipfsHash: string; // First report CID
    ipfsHashes?: string[]; // Multiple reports
    details: string;
    status: 'Pending' | 'Verified' | 'Rejected';
    txHash?: string; // Blockchain transaction hash
    history: {
        event: string;
        date: Date;
        location: string;
    }[];
    createdAt: Date;
}

const ProductSchema: Schema = new Schema({
    batchId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    harvestDate: { type: Date },
    manufactureDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    origin: { type: String, required: true },
    ipfsHash: { type: String, required: true },
    ipfsHashes: [{ type: String }],
    details: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Verified'
    },
    txHash: { type: String },
    history: [{
        event: { type: String, required: true },
        date: { type: Date, default: Date.now },
        location: { type: String, required: true }
    }],
    createdAt: { type: Date, default: Date.now }
});

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
