# Vercel Deployment & Persistence Guide

To deploy to Vercel and **keep your data (Batches, History)** forever, you cannot use "Localhost". You must move to cloud services.

## 1. Why Data Disappears on Vercel?
- **Blockchain**: Vercel cannot talk to your laptop's `npx hardhat node`. It needs a public blockchain like **Polygon Amoy**.
- **Database**: Vercel cannot talk to your local MongoDB. It needs a cloud database like **MongoDB Atlas**.

## 2. Step-by-Step Solution

### Step A: Database Persistence (MongoDB Atlas)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account.
2.  Create a Cluster (Free Tier).
3.  Click **Connect** -> **Drivers** -> Copy the connection string.
    - Replace `<password>` with your database user password.
4.  Update your `.env.local` file:
    ```bash
    MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.Sx34.mongodb.net/herbtrace?retryWrites=true&w=majority"
    ```

### Step B: Blockchain Persistence (Polygon Amoy)
1.  Ensure you have **MATIC** on Amoy Testnet (use a Faucet).
2.  Deploy your Proxy Contract to Amoy:
    ```bash
    npx hardhat run scripts/deploy_proxy.js --network amoy
    ```
3.  This will update your `.env.local` with the new Amoy address.

### Step C: Deploying to Vercel
1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  **Crucial Step:** In Vercel Project Settings > **Environment Variables**, add:
    - `MONGODB_URI`: (Your Atlas Connection String from Step A)
    - `NEXT_PUBLIC_CONTRACT_ADDRESS`: (The address from Step B)
    - `NEXT_PUBLIC_NETWORK`: `amoy`
    - `NEXT_PUBLIC_RPC_URL`: `https://rpc-amoy.polygon.technology`

## 3. How to Update in Future?
To update your contract logic **without losing data**:
1.  Edit `HerbTrace.sol` locally.
2.  Run the upgrade script:
    ```bash
    npx hardhat run scripts/upgrade_proxy.js --network amoy
    ```
3.  **Done!** Your Vercel website will automatically use the new logic, and all old batches remain safe.
