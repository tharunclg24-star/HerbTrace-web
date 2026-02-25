# Proxy Deployment Guide

To deploy successively to the **same address** and **keep your history (batches)**, we have implemented the **Proxy Pattern**.

## 1. First Time Deployment
Run this ONLY once (or when you want to wipe everything and start fresh). This deploys the **Proxy**.

```bash
npx hardhat run scripts/deploy_proxy.js --network localhost
# OR
npx hardhat run scripts/deploy_proxy.js --network amoy
```

- This will create a NEW address.
- It will update your `.env.local` automatically.
- **Batches & History start at 0.**

## 2. Successive Updates (The Magic Part) 🪄
When you change your Solidity code (`HerbTrace.sol`) and want to update the logic **without losing data** or changing the address:

```bash
npx hardhat run scripts/upgrade_proxy.js --network localhost
# OR
npx hardhat run scripts/upgrade_proxy.js --network amoy
```

- **Address stays the SAME.**
- **History (Total Batches, Verified Records) is PRESERVED.**
- The contract logic is updated.

## ⚠️ Important Note for Localhost
If you are running on `localhost` (`npx hardhat node`):
- **Stopping the node wipes the blockchain.**
- Even with a Proxy, if you restart the node, the Proxy is deleted.
- To use the Proxy Pattern effectively on local, **keep your `npx hardhat node` terminal running**! Don't close it.
- If you close it, you must run `deploy_proxy.js` again (starting from 0 history).

## Summary
- **Reset/Start Over**: `deploy_proxy.js`
- **Update Code/Keep History**: `upgrade_proxy.js`
