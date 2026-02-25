# 🌿 HerbTrace - Polygon Amoy Deployment Guide

This guide describes how to deploy HerbTrace to the **Sepolia Testnet** using Remix IDE.

---

## 🚀 Deployment Guide (CLI Method)

Since browser connections can be flaky, the most reliable way to deploy is using the command line.

### 1. Prerequisites
Ensure your `.env.local` has your **PRIVATE_KEY** set.

### 2. Deploy
Run **ONE** of the following commands in your terminal:

**For Polygon Amoy (Recommended):**
```bash
npx hardhat run scripts/deploy.js --network amoy
```

**For Sepolia:**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**For Local Hardhat:**
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Done!
The script will **automatically**:
1.  Deploy your contract.
2.  Update `.env.local` with the new address and network name.
3.  You just need to **restart your app**:
    ```bash
    npm run dev
    ```

> **✅ Verification**: Check your terminal output. It should say:  
> `✅ Updated .env.local` with the new address.

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

## 🗄️ Database Setup (MongoDB)

HerbTrace uses MongoDB for persistent storage of product records and history.

1.  **Set Up Atlas**: Follow the [MongoDB Setup Guide](file:///C:/Users/tharun%20prakash/.gemini/antigravity/brain/baf0e218-a2a6-41f7-a109-fb051924fa03/MONGODB_SETUP.md) to create a free cluster.
2.  **Add URI**: Open `.env.local` and add your connection string to `MONGODB_URI`.
3.  **Test Connection**:
    ```bash
    node scripts/test-mongodb.js
    ```

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
