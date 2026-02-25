# 🚀 HerbTrace - Quick Reference Card

## ✅ Your System is Now Fixed!

### What Was Wrong:
- ❌ Contract address was empty
- ❌ Batches weren't going to blockchain
- ❌ Verification failed with `BAD_DATA` error

### What's Fixed:
- ✅ Contract deployed to localhost
- ✅ Address updated in `.env.local`
- ✅ Better error messages added
- ✅ Duplicate batch detection

---

## 📋 How to Use (Step-by-Step)

### 1. Make Sure Everything is Running
```powershell
# Terminal 1: Hardhat Node (should already be running)
npx hardhat node

# Terminal 2: Dev Server
npm run dev
```

### 2. Register a New Batch
1. Go to `http://localhost:3000/dashboard`
2. Click "Connect Wallet" → Approve MetaMask
3. Click "New Product Batch"
4. Fill in the form:
   - **Batch ID**: Use unique ID like `BCH-${Date.now()}`
   - **Herb Name**: e.g., "Organic Ashwagandha"
   - **Dates**: Use format YYYY-MM-DD
   - **Upload PDF**: Optional but recommended
5. Click "Register & Upload to IPFS"
6. **IMPORTANT**: Approve the MetaMask transaction!
7. Wait for confirmation

### 3. Verify the Batch
- Scan the QR code OR
- Click "View Verification Page" OR
- Go to `/verify?batchId=YOUR_BATCH_ID`

---

## ⚠️ Common Errors & Solutions

### Error: "Batch already registered"
**Cause**: You're trying to use a batch ID that exists on-chain  
**Solution**: Use a different batch ID or verify the existing one

### Error: "User denied transaction"
**Cause**: You cancelled the MetaMask popup  
**Solution**: Try again and click "Confirm" in MetaMask

### Error: "Contract not found"
**Cause**: Contract address is wrong or not deployed  
**Solution**: Run `npx hardhat run scripts/fix-deployment.js --network localhost`

### Error: "Network mismatch"
**Cause**: MetaMask is on wrong network  
**Solution**: Switch MetaMask to "Hardhat Local" (Chain ID: 31337)

---

## 🔧 Useful Commands

### Redeploy Contract (Fresh Start)
```powershell
npx hardhat run scripts/fix-deployment.js --network localhost
# Then restart: npm run dev
```

### Check Contract Address
```powershell
Select-String -Path ".env.local" -Pattern "NEXT_PUBLIC_CONTRACT_ADDRESS"
```

### View Hardhat Transactions
Check the terminal running `npx hardhat node` to see all transactions in real-time

---

## 📱 Mobile Access (QR Scanning)

Your system is configured for mobile access:
- **URL**: `http://100.100.7.131:3000`
- **Requirement**: Mobile must be on same WiFi
- **Hardhat**: Running with `--hostname 0.0.0.0`

---

## 🎯 Best Practices

### Batch ID Naming
- ✅ `BCH-2026-001`, `BATCH-${Date.now()}`, `HT-${Math.random()}`
- ❌ Don't reuse IDs like `BCH-001` multiple times

### File Uploads
- Upload PDFs for lab reports, certificates
- Files go to IPFS (permanent storage)
- Can upload multiple files per batch

### Updating Batches
- Click "Update" on existing batch
- Can only update IPFS documents (not core data)
- Must be same wallet that registered it

---

## 📊 System Architecture

```
User Form → IPFS Upload → Smart Contract → QR Code
                ↓              ↓
            Pinata        Hardhat Local
                              ↓
                        Blockchain Record
```

---

## 🎉 You're Ready!

Everything is configured and working. Just:
1. Restart `npm run dev` if needed
2. Connect wallet
3. Start registering batches!

**Need help?** Check `DEPLOYMENT_FIXED.md` for detailed guide.
