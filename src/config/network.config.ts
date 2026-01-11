/**
 * Network Configuration for HerbTrace
 * 
 * This file centralizes all network settings for easy switching between
 * development (Hardhat) and production networks (Sepolia, Polygon, etc.)
 */

export interface NetworkConfig {
    name: string;
    rpcUrl: string;
    chainId: number;
    chainIdHex: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    blockExplorer: string | null;
    isTestnet: boolean;
    description: string;
}

export const NETWORKS: Record<string, NetworkConfig> = {
    // Local Development Network
    hardhat: {
        name: "Hardhat Local",
        rpcUrl: "http://127.0.0.1:8545",
        chainId: 31337,
        chainIdHex: "0x7A69",
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorer: null,
        isTestnet: true,
        description: "Local Hardhat development network"
    },

    // Ethereum Sepolia Testnet
    sepolia: {
        name: "Sepolia Testnet",
        rpcUrl: "https://rpc.ankr.com/eth_sepolia",
        chainId: 11155111,
        chainIdHex: "0xaa36a7",
        nativeCurrency: {
            name: "Sepolia Ethereum",
            symbol: "SepoliaETH",
            decimals: 18
        },
        blockExplorer: "https://sepolia.etherscan.io",
        isTestnet: true,
        description: "Ethereum Sepolia test network"
    },

    // Polygon Mumbai Testnet
    mumbai: {
        name: "Polygon Mumbai",
        rpcUrl: "https://rpc-mumbai.maticvigil.com",
        chainId: 80001,
        chainIdHex: "0x13881",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        blockExplorer: "https://mumbai.polygonscan.com",
        isTestnet: true,
        description: "Polygon Mumbai test network"
    },

    // Polygon Mainnet
    polygon: {
        name: "Polygon Mainnet",
        rpcUrl: "https://polygon-rpc.com",
        chainId: 137,
        chainIdHex: "0x89",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        blockExplorer: "https://polygonscan.com",
        isTestnet: false,
        description: "Polygon mainnet - production ready"
    },

    // Polygon Amoy Testnet
    amoy: {
        name: "Polygon Amoy",
        rpcUrl: "https://rpc-amoy.polygon.technology",
        chainId: 80002,
        chainIdHex: "0x13882",
        nativeCurrency: {
            name: "POL",
            symbol: "POL",
            decimals: 18
        },
        blockExplorer: "https://amoy.polygonscan.com",
        isTestnet: true,
        description: "Polygon Amoy test network"
    },

    // Ethereum Mainnet
    mainnet: {
        name: "Ethereum Mainnet",
        rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
        chainId: 1,
        chainIdHex: "0x1",
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorer: "https://etherscan.io",
        isTestnet: false,
        description: "Ethereum mainnet - production ready"
    }
};

/**
 * Active Network Configuration
 * 
 * Change this value to switch networks:
 * - 'hardhat' for local development
 * - 'sepolia' for Ethereum testnet
 * - 'mumbai' for Polygon testnet
 * - 'polygon' for Polygon mainnet
 * - 'mainnet' for Ethereum mainnet
 */
/**
 * Active Network Configuration
 * 
 * Change this value to switch networks:
 * - 'hardhat' for local development
 * - 'sepolia' for Ethereum testnet
 * - 'mumbai' for Polygon testnet
 * - 'polygon' for Polygon mainnet
 * - 'mainnet' for Ethereum mainnet
 */
export const ACTIVE_NETWORK = 'hardhat'; // process.env.NEXT_PUBLIC_NETWORK || 'hardhat';

/**
 * Get the current active network configuration
 */
export function getActiveNetwork(): NetworkConfig {
    const network = NETWORKS[ACTIVE_NETWORK];
    if (!network) {
        console.warn(`Network '${ACTIVE_NETWORK}' not found, defaulting to hardhat`);
        return NETWORKS.hardhat;
    }
    return network;
}

/**
 * Get contract address - uses single CONTRACT_ADDRESS from .env.local
 * Works for all networks - just change the address when you deploy to a new network
 */
export function getContractAddress(): string {
    // Allows user to override address in .env.local for ANY network including hardhat
    if (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
        return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    }

    if (ACTIVE_NETWORK === 'hardhat') {
        return "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    }

    return "0x5FbDB2315678afecb367f032d93F642f64180aa3";
}

/**
 * MetaMask network parameters for easy network switching
 */
export function getMetaMaskNetworkParams(networkKey: string) {
    const network = NETWORKS[networkKey];
    if (!network) return null;

    return {
        chainId: network.chainIdHex,
        chainName: network.name,
        nativeCurrency: network.nativeCurrency,
        rpcUrls: [network.rpcUrl],
        blockExplorerUrls: network.blockExplorer ? [network.blockExplorer] : []
    };
}

export default {
    NETWORKS,
    ACTIVE_NETWORK,
    getActiveNetwork,
    getContractAddress,
    getMetaMaskNetworkParams
};
