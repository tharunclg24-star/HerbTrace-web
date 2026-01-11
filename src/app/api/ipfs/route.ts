import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        console.log("Starting IPFS/Pinata Upload...");

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.error("No file found in request formData");
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        console.log(`File received: ${file.name}, Size: ${file.size} bytes`);

        let pinataJwt = process.env.PINATA_JWT;

        if (!pinataJwt || pinataJwt.trim() === "") {
            console.warn("⚠️ PINATA_JWT is missing or empty in .env.local. Switching to MOCK IPFS MODE.");
            // Return a mock success response so the user can verify the smart contract flow
            return NextResponse.json({
                success: true,
                IpfsHash: "QmMockHashForTesting_" + Date.now().toString(),
                mock: true
            });
        }

        // Ensure no whitespace
        pinataJwt = pinataJwt.trim();

        console.log(`Using Pinata JWT (Starts with: ${pinataJwt.substring(0, 10)}...)`);

        const pinataFormData = new FormData();
        pinataFormData.append('file', file);
        // Remove pinataOptions to reduce complexity and potential permission issues with cidVersion: 1
        pinataFormData.append('pinataMetadata', JSON.stringify({
            name: file.name
        }));

        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${pinataJwt}`
            },
            body: pinataFormData
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Pinata API Failure:", errorText);
            return NextResponse.json({
                success: false,
                error: `Pinata Upload Failed: ${res.statusText}`,
                details: errorText
            }, { status: res.status });
        }

        const resData = await res.json();
        console.log("Pinata Upload Success:", resData);

        return NextResponse.json({
            success: true,
            IpfsHash: resData.IpfsHash
        });

    } catch (error: any) {
        console.error("Internal Server IPFS Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

