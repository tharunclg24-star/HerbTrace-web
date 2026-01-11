import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function POST(req: Request) {
    try {
        const isConnected = await connectDB();
        const data = await req.json();

        if (!process.env.MONGODB_URI) {
            console.log("Mock Mode: Returning success for registration without DB");
            return NextResponse.json({
                success: true,
                message: "Registered on Chain (Demo: DB skipped)",
                product: data
            }, { status: 201 });
        }

        // Add initial history entry
        const productData = {
            ...data,
            history: [
                {
                    event: "Harvested",
                    date: data.harvestDate || new Date(),
                    location: data.origin
                },
                {
                    event: "Product Registered",
                    date: new Date(),
                    location: "HerbTrace System"
                }
            ]
        };

        const product = await Product.create(productData);

        return NextResponse.json({
            success: true,
            message: "Product created and tracked successfully",
            product
        }, { status: 201 });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Internal Server Error"
        }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const data = await req.json();
        const { batchId, ...updateData } = data;

        if (!batchId) {
            return NextResponse.json({ success: false, error: "Batch ID is required" }, { status: 400 });
        }

        if (!process.env.MONGODB_URI) {
            return NextResponse.json({
                success: true,
                message: "Updated on Chain (Demo: DB skipped)",
                product: data
            });
        }

        const product = await Product.findOne({ batchId });
        if (!product) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        // Add history entry for update
        const historyEntry = {
            event: "Information Updated",
            date: new Date(),
            location: updateData.origin || product.origin || "System Update",
            details: "Blockchain record updated with new data/documents."
        };

        const updatedProduct = await Product.findOneAndUpdate(
            { batchId },
            {
                ...updateData,
                $push: { history: historyEntry }
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error: any) {
        console.error("PUT API Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Internal Server Error"
        }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();

        if (!process.env.MONGODB_URI) {
            return NextResponse.json({ success: true, products: [], message: "Demo Mode: No DB connected" });
        }

        const { searchParams } = new URL(req.url);
        const batchId = searchParams.get('batchId');

        if (batchId) {
            const product = await Product.findOne({ batchId });
            if (!product) {
                return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
            }
            return NextResponse.json({ success: true, product });
        }

        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, products });
    } catch (error: any) {
        console.error("GET API Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Database error",
            products: []
        }, { status: 500 });
    }
}