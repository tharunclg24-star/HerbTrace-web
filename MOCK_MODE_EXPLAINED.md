# 🚨 IMPORTANT: Understanding Mock Mode vs Blockchain Registration

## ❌ The Problem You're Experiencing

You're seeing this error:
```
could not decode result data (value="0x", code=BAD_DATA)
```

### What This Means:
The batches you're trying to verify (`BCH-15`, `BCD-14`, `bch5`) **do not exist on the blockchain**.

---

## 🔍 Why This Happens

### Mock Mode Registration (Before Fix)
When you registered batches BEFORE the contract was properly deployed:
1. ✅ Files uploaded to IPFS successfully
2. ✅ Data saved to MongoDB (mock mode)
3. ❌ **NO blockchain transaction occurred**
4. ❌ **Batches NOT written to smart contract**

### Result:
- Batches exist in MongoDB only
- QR codes were generated
- But verification fails because blockchain has no data

---

## ✅ The Solution

### Option 1: Register NEW Batches (RECOMMENDED)
1. Go to Dashboard
2. Click "New Product Batch"
3. Use a **UNIQUE Batch ID** (e.g., `BCH-2026-001`, `BATCH-${Date.now()}`)
4. Fill in all details
5. Upload documents
6. Click "Register & Upload to IPFS"
7. **IMPORTANT**: Approve the MetaMask transaction popup!
8. Wait for confirmation
9. Scan the new QR code - it will work!

### Option 2: Clear Old Data & Start Fresh
If you want to start completely fresh:

```powershell
# 1. Redeploy contract (clears all blockchain data)
npx hardhat run scripts/fix-deployment.js --network localhost

# 2. Restart dev server
npm run dev
```

---

## 🎯 How to Verify Registration Worked

### ✅ Successful Blockchain Registration:
1. **MetaMask popup appears** asking you to confirm
2. You click "Confirm" and pay gas fee
3. Console shows: `Transaction sent: 0x...`
4. Console shows: `Transaction confirmed`
5. QR code is generated
6. Verification page shows all data

### ❌ Mock Mode Registration (Doesn't Work):
1. No MetaMask popup
2. Console shows: `Mock Mode: Returning success`
3. QR code generated but verification fails
4. Error: `BAD_DATA` when scanning

---

## 📋 Step-by-Step: Register Your First REAL Batch

### 1. Make Sure Contract is Deployed
```powershell
# Check contract address is set
Select-String -Path ".env.local" -Pattern "NEXT_PUBLIC_CONTRACT_ADDRESS"

# Should show something like: 0x5FbDB...
# If empty, run:
npx hardhat run scripts/fix-deployment.js --network localhost
```

### 2. Open Dashboard
- Go to `http://localhost:3000/dashboard`
- Click "Connect Wallet"
- Approve MetaMask connection

### 3. Register Batch
- Click "New Product Batch"
- **Batch ID**: `BCH-REAL-001` (or any unique ID)
- **Herb Name**: `Organic Ashwagandha`
- **Dates**: Use format `2026-01-11`
- **Origin**: `Rajasthan, India`
- Upload a PDF (optional)
- Click "Register & Upload to IPFS"

### 4. APPROVE METAMASK! ⚠️
- **MetaMask popup MUST appear**
- Click "Confirm"
- Wait for transaction to complete

### 5. Verify It Worked
- Scan QR code or click "View Verification Page"
- You should see all data displayed
- No errors!

---

## 🔧 What I Fixed

### 1. Better Error Messages
Now when verification fails, you'll see:
```
❌ Batch "BCH-15" not found on blockchain.

This usually means:
• The batch was registered in Mock Mode
• The batch ID doesn't exist
• Contract was redeployed

Solution: Register a NEW batch with a unique ID
```

### 2. MongoDB Fallback
The system now checks MongoDB if blockchain fails, and tells you:
```
⚠️ This batch was registered in Mock Mode (not on blockchain).

To register on blockchain:
1. Go to Dashboard
2. Register a new batch with a unique ID
3. Approve the MetaMask transaction
```

### 3. Autocomplete Disabled
- No more dropdown suggestions when typing
- Fresh, clean form every time

---

## 📊 Summary

| Batch ID | Status | Can Verify? | Why? |
|----------|--------|-------------|------|
| `BCH-15` | Mock Mode | ❌ No | Registered before contract deployment |
| `BCD-14` | Mock Mode | ❌ No | Registered before contract deployment |
| `bch5` | Mock Mode | ❌ No | Registered before contract deployment |
| `BCH-REAL-001` | Blockchain | ✅ Yes | Properly registered with MetaMask |

---

## 🎉 Next Steps

1. **Ignore old batches** (`BCH-15`, `BCD-14`, `bch5`) - they're in mock mode
2. **Register a NEW batch** with a unique ID
3. **Approve MetaMask** when prompted
4. **Verify it works** by scanning the QR code

Your system is now properly configured. Just register new batches and they'll work perfectly!

---

## ❓ Still Having Issues?

Check:
- ✅ Hardhat node is running (`npx hardhat node`)
- ✅ Contract address is set in `.env.local`
- ✅ MetaMask is connected
- ✅ You're using a UNIQUE batch ID
- ✅ You APPROVE the MetaMask transaction

**The key is: You MUST see and approve the MetaMask popup for blockchain registration!**
