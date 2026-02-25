import { ethers } from "ethers";
import { getActiveNetwork, getContractAddress } from "../config/network.config";

const ABI = [
    "function registerBatch(string memory _batchId, string memory _herbName, string memory _manufacturerName, string memory _harvestDate, string memory _manufactureDate, string memory _expiryDate, string memory _origin, string memory _details, string[] memory _ipfsCIDs) public",
    "function updateBatch(string memory _batchId, string[] memory _newIpfsCIDs) public",
    "function getBatch(string memory _batchId) public view returns (string memory herbName, string memory manufacturerName, string memory harvestDate, string memory manufactureDate, string memory expiryDate, string memory origin, string memory details, string[] memory ipfsCIDs, uint256 timestamp, address manufacturer)",
    "function getBatchCount() public view returns (uint256)"
];

export const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const network = await provider.getNetwork();
            const config = getActiveNetwork();
            console.log("Connected to network:", network.name, "Chain ID:", network.chainId);

            // Check if connected to the correct network
            const expectedChainId = BigInt(config.chainId);
            if (network.chainId !== expectedChainId) {
                console.warn(`⚠️  Wrong network! Please switch MetaMask to ${config.name}. Expected Chain ID: ${config.chainId}`);
            }

            const accounts = await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            return { provider, signer, account: accounts[0], chainId: network.chainId };
        } catch (error) {
            console.error("User denied account access", error);
            return null;
        }
    } else {
        alert("MetaMask not found! Please install the MetaMask extension.");
        return null;
    }
};

export const registerBatchOnChain = async (batchData: any) => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("No crypto wallet found");
    }

    try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const network = await provider.getNetwork();
        const config = getActiveNetwork();
        const expectedChainId = BigInt(config.chainId);

        if (network.chainId !== expectedChainId) {
            throw new Error(`Wrong network! Please switch MetaMask to ${config.name} (Chain ID: ${config.chainId})`);
        }

        const signer = await provider.getSigner();
        const contractAddress = getContractAddress();

        // Create contract instance
        const contract = new ethers.Contract(contractAddress, ABI, signer);

        console.log("Requesting MetaMask confirmation for registration...");

        // Call the smart contract function
        // This will trigger the MetaMask popup
        const tx = await contract.registerBatch(
            batchData.batchId,
            batchData.herbName,
            batchData.manufacturerName || "HerbTrace Manufacturer",
            batchData.harvestDate || "",
            batchData.manufactureDate || "",
            batchData.expiryDate || "",
            batchData.origin || "",
            batchData.details || "",
            batchData.ipfsCIDs || []
        );


        console.log("Transaction sent:", tx.hash);

        // Wait for 1 block confirmation
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        return {
            success: true,
            txHash: tx.hash
        };
    } catch (error: any) {
        console.error("Blockchain Registration Error:", error);

        // Fallback for demo if contract is not actually deployed
        if (error.code === 'BAD_DATA' || error.message.includes('contract not found') || error.message.includes('call revert')) {
            console.warn("Contract not found at address. Using fallback for demonstration.");
            // We can still simulate the success for the UI if it's a demo
            // but the user asked to "confirm all changes as transaction"
            // If it fails because of wrong address, it still technically prompted MetaMask
            throw new Error(`Blockchain error: ${error.reason || error.message}. Ensure your contract is deployed to the current network.`);
        }

        throw error;
    }
};

export const updateBatchOnChain = async (batchId: string, ipfsCIDs: string[]) => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
        throw new Error("No crypto wallet found");
    }

    try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const network = await provider.getNetwork();
        const config = getActiveNetwork();
        const expectedChainId = BigInt(config.chainId);

        if (network.chainId !== expectedChainId) {
            throw new Error(`Wrong network! Please switch MetaMask to ${config.name} (Chain ID: ${config.chainId})`);
        }

        const signer = await provider.getSigner();
        const contractAddress = getContractAddress();

        const contract = new ethers.Contract(contractAddress, ABI, signer);

        console.log("Requesting MetaMask confirmation for update...");

        const tx = await contract.updateBatch(batchId, ipfsCIDs);
        console.log("Update transaction sent:", tx.hash);

        const receipt = await tx.wait();
        console.log("Update transaction confirmed:", receipt);

        return {
            success: true,
            txHash: tx.hash
        };
    } catch (error: any) {
        console.error("Blockchain Update Error:", error);
        throw error;
    }
};

export const getBatchFromChain = async (batchId: string) => {
    try {
        const config = getActiveNetwork();
        const contractAddress = getContractAddress();

        console.log(`🔍 Querying contract ${contractAddress} for batch: ${batchId}`);

        // 🚀 CRITICAL FIX: Always use JsonRpcProvider for reading data.
        // Do NOT use MetaMask's provider here because the user's MetaMask 
        // might be on the wrong network (like Mainnet), causing verification to fail.
        const provider = new ethers.JsonRpcProvider(config.rpcUrl);

        // 🛡️ Safety check: Verify address has code to prevent BAD_DATA error
        const code = await provider.getCode(contractAddress);
        if (code === "0x" || code === "0x0") {
            console.warn("⚠️ Contract not found at address. Ensure you are on the correct network.");
            return null;
        }

        const contract = new ethers.Contract(contractAddress, ABI, provider);
        const data = await contract.getBatch(batchId);

        // Map the struct array/result to a clean object
        return {
            batchId: batchId || "Unknown",
            name: data.herbName || "Unnamed Herb",
            manufacturer: data.manufacturerName || "Unknown Manufacturer",
            harvestDate: data.harvestDate || "N/A",
            manufactureDate: data.manufactureDate || "N/A",
            expiryDate: data.expiryDate || "N/A",
            origin: data.origin || "Unknown Origin",
            details: data.details || "No details provided.",
            ipfsHashes: data.ipfsCIDs ? Array.from(data.ipfsCIDs) : [],
            ipfsHash: data.ipfsCIDs && data.ipfsCIDs.length > 0 ? data.ipfsCIDs[0] : "",
            timestamp: data.timestamp ? data.timestamp.toString() : Date.now().toString(),
            manufacturerAddress: data.manufacturer || "0x0000000000000000000000000000000000000000",
            txHash: "On-Chain Record"
        };
    } catch (error: any) {
        console.error("Error fetching batch from chain:", error.message || error);
        return null;
    }
};

export const verifyNetwork = async () => {
    try {
        const config = getActiveNetwork();
        const provider = new ethers.JsonRpcProvider(config.rpcUrl);
        const network = await provider.getNetwork();
        return { success: true, chainId: network.chainId.toString() };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

