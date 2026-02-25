import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;

console.log("URI: " + uri);

if (!uri) {
    console.log("NO URI FOUND");
    process.exit(1);
}

mongoose.connect(uri)
    .then(() => {
        console.log("CONNECTED OK");
        process.exit(0);
    })
    .catch((err) => {
        console.log("CONNECTION ERROR DETAILS:");
        console.log(err.name);
        console.log(err.message);
        console.log(err.codeName);
        console.log("FULL ERROR END");
        process.exit(1);
    });
