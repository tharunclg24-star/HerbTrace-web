# 🌿 HerbTrace - Polygon Amoy Deployment Guide

This guide describes how to deploy HerbTrace to the **Sepolia Testnet** using Remix IDE.

---

## 🚀 Deployment to Polygon Amoy

1.  **Fund your wallet**: Go to [Amoy Faucet](https://faucet.polygon.technology/) and get some test POL for `0x3Af...0B7e`.
2.  **Clean Config**: I have reset your `.env.local`. Open it and:
    *   Paste your **PRIVATE_KEY** (from MetaMask -> Account Details).
3.  **Run Deploy Command**:
    ```bash
    npx hardhat run scripts/deploy.js --network amoy
    ```
4.  **Important**: Copy the "HerbTrace contract deployed to: 0x..." address.
5.  **Update `.env.local`**:
    *   Set `NEXT_PUBLIC_CONTRACT_ADDRESS=0x_YOUR_NEW_ADDRESS_HERE`
6.  **Restart**: Run `npm run dev` and refresh your browser.

---

## ☁️ How to Connect Pinata (IPFS)

To store your herb documents (PDFs/Images) on the real decentralized web:

1.  **Sign Up**: Go to [Pinata.cloud](https://pinata.cloud) and create a free account.
2.  **Create API Key**:
    - Go to **API Keys** in the sidebar.
    - Click **"New Key"**.
    - **Important**: Toggle the **"Admin"** switch to ON (or ensure `pinFileToIPFS` is enabled).
    - Give it a name (e.g., "HerbTrace-Key").
3.  **Copy the JWT**:
    - After clicking "Create", a popup will show three values.
    - **Do NOT copy the API Key or Secret.**
    - **DO copy the "JWT"** (the very long string at the bottom).
4.  **Update `.env.local`**: Paste that long string into the `PINATA_JWT=` field.

---

## 🏃 Step 3: Run the App

1.  **Restart the server**:
    ```bash
    npm run dev
    ```
2.  **Open**: [http://localhost:3000](http://localhost:3000).
3.  **Connect**: Click "Connect Wallet" and ensure MetaMask is on Polygon Amoy.
4.  **Verify**: You can now register batches on the real Amoy testnet!

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 15
- **Blockchain**: Polygon Amoy Testnet
- **Smart Contract**: Solidity 0.8.20
- **Interaction**: Ethers.js v6
