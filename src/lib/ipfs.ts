/**
 * Utility for IPFS storage using local API proxy
 * This keeps the Pinata JWT secret on the server.
 */

export const uploadToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch("/api/ipfs", {
            method: 'POST',
            body: formData
        });

        const resData = await res.json();

        if (!res.ok || !resData.success) {
            throw new Error(resData.error || `Upload failed with status: ${res.status}`);
        }

        return {
            success: true,
            cid: resData.IpfsHash,
            url: `${process.env.NEXT_PUBLIC_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/'}${resData.IpfsHash}`
        };
    } catch (error: any) {
        console.error("IPFS Upload Error:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const uploadMultipleToIPFS = async (files: FileList | File[]) => {
    const uploadPromises = Array.from(files).map(file => uploadToIPFS(file));
    return Promise.all(uploadPromises);
};