"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, LayoutDashboard, FileText, Settings, LogOut, Package, ClipboardList, TrendingUp, Upload, CheckCircle2, QrCode as QrIcon, Download, Loader2, Mail, Link2, Link2Off, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { uploadToIPFS } from "@/lib/ipfs";
import { registerBatchOnChain, updateBatchOnChain, connectWallet, verifyNetwork } from "@/lib/web3";
import { getActiveNetwork } from "@/config/network.config";

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [nodeStatus, setNodeStatus] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    // Check node status on mount
    verifyNetwork().then(setNodeStatus);
    const interval = setInterval(() => {
      verifyNetwork().then(setNodeStatus);
    }, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };


  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginEmail) setLoginEmail("demo@herbtrace.com");
    setIsLoggedIn(true);
  };

  const handleConnect = async () => {
    const res = await connectWallet();
    if (res) setWallet(res);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet) {
      alert("Please connect your MetaMask wallet first!");
      handleConnect();
      return;
    }

    if (selectedFiles.length === 0) {
      // Allow demo file if not selected for simplicity in testing
      console.log("No files selected, using demo mode");
    }

    setIsRegistering(true);

    try {
      // 1. Upload to IPFS (If files selected, otherwise use mock)
      let ipfsCIDs: string[] = [];
      if (selectedFiles.length > 0) {
        // Upload each file and get CIDs
        const uploadResults = await Promise.all(selectedFiles.map(file => uploadToIPFS(file)));

        const failed = uploadResults.filter(r => !r.success);
        if (failed.length > 0) throw new Error("Some files failed to upload: " + failed[0].error);

        ipfsCIDs = uploadResults.map(r => r.cid!);
      } else {
        // Fallback for demo
        ipfsCIDs = ["QmSampleHashMockData123"];
      }

      // 2. Prepare Data
      const formData = new FormData(e.target as HTMLFormElement);
      const batchId = formData.get("batchId") as string || `BCH-${Date.now()}`;
      const herbName = formData.get("herbName") as string || "Generic Herb";
      const manufacturerName = "Organic Herbals Ltd.";

      const productData = {
        batchId,
        name: herbName,
        manufacturer: manufacturerName,
        harvestDate: formData.get("harvestDate") || new Date().toISOString().split('T')[0],
        manufactureDate: formData.get("manufactureDate") || new Date().toISOString().split('T')[0],
        expiryDate: formData.get("expiryDate") || "2030-01-01",
        origin: formData.get("origin") || "Experimental Farm",
        ipfsHashes: ipfsCIDs,
        ipfsHash: ipfsCIDs[0], // Keep for backward compatibility
        details: formData.get("details") || "Automated batch registration for testing.",
      };

      let txHash = "";

      if (editingProduct) {
        // Update on Blockchain
        const blockchainResult = await updateBatchOnChain(batchId, ipfsCIDs);
        txHash = blockchainResult.txHash;

        // Update in MongoDB
        const response = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...productData,
            txHash
          })
        });
        const dbResult = await response.json();
        if (!dbResult.success) throw new Error(dbResult.error);
      } else {
        // Register on Blockchain
        // Register on Blockchain
        const blockchainResult = await registerBatchOnChain({
          batchId,
          herbName,
          manufacturerName,
          harvestDate: productData.harvestDate,
          manufactureDate: productData.manufactureDate,
          expiryDate: productData.expiryDate,
          origin: productData.origin,
          details: productData.details,
          ipfsCIDs: ipfsCIDs
        });
        txHash = blockchainResult.txHash;

        // Save to MongoDB
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...productData,
            txHash
          })
        });
        const dbResult = await response.json();
        if (!dbResult.success) throw new Error(dbResult.error);
      }

      setSuccessData({
        batchId,
        txHash,
        // Use local IP for QR code so it works on mobile
        verifyUrl: `http://100.100.7.131:3000/verify?batchId=${batchId}`,
        isUpdate: !!editingProduct
      });
      fetchProducts(); // Refresh the list
    } catch (error: any) {
      console.error("Operation failed", error);
      alert("Operation failed: " + error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="login-card glass-panel"
        >
          <div className="login-header">
            <Package size={48} color="#10b981" />
            <h1>Manufacturer Login</h1>
            <p>Access your HerbTrace dashboard</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="manufacturer@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full mt-20">Continue to Dashboard</button>
            <div className="divider">OR</div>
            <button
              type="button"
              className="btn-secondary w-full"
              onClick={() => handleLogin()}
            >
              Quick Demo Login
            </button>
          </form>
        </motion.div>
        <style jsx>{`
                    .login-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 70vh;
                    }
                    .login-card {
                        width: 100%;
                        max-width: 450px;
                        padding: 40px;
                        text-align: center;
                    }
                    .login-header {
                        margin-bottom: 32px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 12px;
                    }
                    .input-with-icon {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid var(--border-light);
                        padding: 0 12px;
                        border-radius: 10px;
                    }
                    .input-with-icon input {
                        background: none;
                        border: none;
                        padding: 12px 0;
                        color: white;
                        width: 100%;
                        outline: none;
                    }
                    .form-group {
                        text-align: left;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                    .form-group label {
                        font-size: 0.85rem;
                        color: var(--text-muted);
                        font-weight: 600;
                    }
                    .divider {
                        margin: 20px 0;
                        color: var(--text-muted);
                        font-size: 0.8rem;
                        position: relative;
                    }
                    .divider::before, .divider::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        width: 40%;
                        height: 1px;
                        background: var(--border-light);
                    }
                    .divider::before { left: 0; }
                    .divider::after { right: 0; }
                    .w-full { width: 100%; }
                    .mt-20 { margin-top: 20px; }
                `}</style>
      </div>
    );
  }


  return (
    <div className="dashboard-layout container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-brand">
          <Package color="#10b981" />
          <span>Manufacturer</span>
        </div>

        <nav className="sidebar-nav">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <NavItem
            icon={<FileText size={20} />}
            label="My Products"
            active={activeTab === "products"}
            onClick={() => setActiveTab("products")}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        <div className="sidebar-footer">
          {nodeStatus && (
            <div className={`node-status ${nodeStatus.success ? 'online' : 'offline'}`}>
              {nodeStatus.success ? <Link2 size={14} /> : <Link2Off size={14} />}
              <span>Node: {nodeStatus.success ? `Online (${nodeStatus.chainId})` : 'Offline (8545)'}</span>
            </div>
          )}
          {wallet ? (
            <div className="wallet-info">
              <span className="dot"></span>
              <code>{wallet.account.slice(0, 6)}...{wallet.account.slice(-4)}</code>
            </div>
          ) : (
            <button className="btn-secondary btn-sm w-full mb-12" onClick={handleConnect}>Connect Wallet</button>
          )}
          <NavItem icon={<LogOut size={20} />} label="Logout" onClick={() => setIsLoggedIn(false)} />
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>{activeTab === "overview" ? "Dashboard Overview" : "My Products"}</h1>
            <p className="text-muted">Welcome back, {loginEmail.split('@')[0]}</p>
          </div>
          <button className="btn-primary" onClick={() => {
            setSuccessData(null);
            setSelectedFiles([]);
            setEditingProduct(null);
            setShowForm(true);
          }}>
            <Plus size={18} /> New Product Batch
          </button>
        </header>

        {activeTab === "overview" && (
          <div className="stats-grid">
            <StatCard icon={<Package />} label="Total Batches" value={products.length.toString()} trend="+2 this month" />
            <StatCard icon={<ClipboardList />} label="Verified Records" value={products.length.toString()} trend="Synced with Chain" />
            <StatCard icon={<TrendingUp />} label="Storage Used" value={`${(products.length * 2.4).toFixed(1)}MB`} trend="on IPFS" />
          </div>
        )}

        {activeTab === "products" && (
          <div className="products-grid">
            {isLoadingProducts ? (
              <div className="loading-state glass-panel">
                <Loader2 size={32} className="animate-spin" />
                <p>Loading your registered batches...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="product-card glass-panel"
                >
                  <div className="product-card-header">
                    <div className="product-icon">
                      <Package size={20} />
                    </div>
                    <span className="batch-tag">{product.batchId}</span>
                  </div>
                  <div className="product-card-body">
                    <h3>{product.name}</h3>
                    <p className="text-muted">{product.origin}</p>
                    <div className="product-meta">
                      <span><strong>Harvested:</strong> {new Date(product.harvestDate).toLocaleDateString()}</span>
                      <span><strong>Tx:</strong> {product.txHash?.slice(0, 10)}...</span>
                    </div>
                  </div>
                  <div className="product-card-actions">
                    <Link href={`/verify?batchId=${product.batchId}`} target="_blank" className="btn-secondary btn-sm w-full">
                      View Verification Page
                    </Link>
                    <button
                      className="btn-primary btn-sm w-full mt-8"
                      onClick={() => {
                        setEditingProduct(product);
                        setSuccessData(null);
                        setSelectedFiles([]);
                        setShowForm(true);
                      }}
                    >
                      Update History / Docs
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="empty-state glass-panel">
                <Package size={48} className="text-muted" />
                <h3>No batches found</h3>
                <p className="text-muted">Register your first batch to see it here.</p>
                <button className="btn-primary btn-sm mt-20" onClick={() => setShowForm(true)}>
                  Register Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Product Registration Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="modal-content glass-panel"
              >
                {!successData ? (
                  <>
                    <div className="modal-header">
                      <h2>{editingProduct ? `Updating Batch: ${editingProduct.batchId}` : 'Register New Batch'}</h2>
                      <button className="close-btn" onClick={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                      }}>&times;</button>
                    </div>

                    {wallet?.chainId !== undefined && nodeStatus?.chainId !== undefined && BigInt(wallet.chainId) !== BigInt(nodeStatus.chainId) && (
                      <div className="network-warning">
                        ⚠️ <strong>Network Mismatch!</strong><br />
                        Your wallet is on Chain {wallet.chainId.toString()}. <br />
                        Please switch MetaMask to <strong>{getActiveNetwork().name}</strong>.
                      </div>
                    )}

                    <form className="batch-form" onSubmit={handleRegister}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Herb / Crop Name</label>
                          <input name="herbName" required type="text" placeholder="e.g. Organic Ashwagandha" defaultValue={editingProduct?.name} />
                        </div>
                        <div className="form-group">
                          <label>Batch ID / Lot Number</label>
                          <input name="batchId" required type="text" placeholder="BCH-2025-001" defaultValue={editingProduct?.batchId} readOnly={!!editingProduct} style={editingProduct ? { opacity: 0.7, cursor: 'not-allowed' } : {}} />
                        </div>
                        <div className="form-group">
                          <label>Harvest Date</label>
                          <input name="harvestDate" required type="text" placeholder="YYYY-MM-DD" defaultValue={editingProduct?.harvestDate} />
                        </div>
                        <div className="form-group">
                          <label>Manufacturing Date</label>
                          <input name="manufactureDate" required type="text" placeholder="YYYY-MM-DD" defaultValue={editingProduct?.manufactureDate} />
                        </div>
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input name="expiryDate" required type="text" placeholder="YYYY-MM-DD" defaultValue={editingProduct?.expiryDate} />
                        </div>
                        <div className="form-group">
                          <label>Origin / Location</label>
                          <input name="origin" required type="text" placeholder="Rajasthan, India" defaultValue={editingProduct?.origin} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Processing Details / Update Notes</label>
                        <textarea name="details" rows={2} placeholder="Describe the processing steps or what was updated..." defaultValue={editingProduct?.details}></textarea>
                      </div>

                      <div className="form-group">
                        <label>Upload Documents (Lab Reports, Certificates, etc.)</label>
                        <div className="upload-zone" onClick={() => document.getElementById('file-upload')?.click()}>
                          <Upload size={24} />
                          <p>
                            {selectedFiles.length > 0
                              ? `${selectedFiles.length} file(s) selected`
                              : "Click to select PDF certificates"}
                          </p>
                          {selectedFiles.length > 0 && (
                            <div className="selected-files-list">
                              {selectedFiles.map((f, i) => (
                                <span key={i} className="file-pill">{f.name}</span>
                              ))}
                            </div>
                          )}
                          <input
                            id="file-upload"
                            type="file"
                            accept=".pdf"
                            multiple
                            hidden
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>

                      <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={isRegistering}>
                          {isRegistering ? (
                            <>
                              <Loader2 size={18} className="animate-spin" /> Processing...
                            </>
                          ) : editingProduct ? "Confirm Update on Blockchain" : "Register & Upload to IPFS"}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="success-view text-center">
                    <div className="success-icon">
                      <CheckCircle2 size={64} color="#10b981" />
                    </div>
                    <h2>Batch Registered & Verified!</h2>
                    <p className="text-muted">Stored on MongoDB and pinned to Pinata IPFS.</p>

                    <div className="qr-container glass-card">
                      <QRCodeSVG
                        id="qr-code-canvas"
                        value={successData.verifyUrl}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                      <div className="qr-actions">
                        <p className="batch-id-text">Batch: {successData.batchId}</p>
                        <div className="btn-group">
                          <a href={successData.verifyUrl} target="_blank" className="btn-secondary btn-sm">
                            View Public Page
                          </a>
                          <button type="button" className="btn-primary btn-sm" onClick={() => {
                            alert("QR Code ready for print!");
                          }}>
                            <Download size={14} /> Download QR
                          </button>
                        </div>
                      </div>
                    </div>

                    <button className="btn-secondary mt-20" onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                    }}>Close</button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: calc(100vh - 120px);
          gap: 24px;
        }

        .sidebar {
          width: 260px;
          height: fit-content;
          position: sticky;
          top: 100px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .wallet-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          background: rgba(16, 185, 129, 0.1);
          padding: 8px;
          border-radius: 8px;
          margin-bottom: 12px;
          color: #34d399;
        }

        .node-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          padding: 8px;
          border-radius: 8px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .node-status.online {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .node-status.offline {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }


        .dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
        }

        .dashboard-main {
          flex: 1;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .product-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .product-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-icon {
          width: 36px;
          height: 36px;
          background: var(--primary-glow);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .batch-tag {
          font-family: monospace;
          background: rgba(255,255,255,0.05);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--primary);
        }

        .product-card-body h3 {
          margin-bottom: 4px;
          font-size: 1.1rem;
        }

        .product-meta {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.85rem;
        }

        .loading-state, .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          gap: 16px;
          text-align: center;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 800px;
          padding: 40px;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
        }

        .batch-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .form-group input, 
        .form-group textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          padding: 10px;
          border-radius: 10px;
          color: white;
          font-family: inherit;
          font-size: 0.9rem;
        }

        .upload-zone {
          border: 2px dashed var(--border-light);
          padding: 24px;
          text-align: center;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          cursor: pointer;
          transition: 0.2s;
        }

        .upload-zone:hover {
          background: var(--primary-glow);
          border-color: var(--primary);
        }

        .selected-files-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
            justify-content: center;
        }

        .file-pill {
            background: rgba(255,255,255,0.1);
            padding: 4px 12px;
            border-radius: 100px;
            font-size: 0.75rem;
            border: 1px solid var(--border-light);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 20px;
        }

        .qr-container {
          margin: 32px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px;
          max-width: 400px;
        }

        .qr-actions {
          margin-top: 24px;
          width: 100%;
        }

        .batch-id-text {
          font-weight: 700;
          margin-bottom: 16px;
          font-family: monospace;
          color: var(--primary);
        }

        .network-warning {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid #ef4444;
          color: #f87171;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          text-align: center;
          font-size: 0.9rem;
        }

        .btn-group {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .mb-12 { margin-bottom: 12px; }
        .mt-20 { margin-top: 20px; }
        .py-40 { padding: 40px 0; }
        .text-center { text-align: center; }
        .w-full { width: 100%; }
      `}</style>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: any) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
      <style jsx>{`
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          border: none;
          background: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: 0.2s;
          width: 100%;
          text-align: left;
          font-weight: 500;
        }
        .nav-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-item.active {
          color: white;
          background: var(--primary-glow);
          border-left: 3px solid var(--primary);
        }
      `}</style>
    </button>
  );
}

function StatCard({ icon, label, value, trend }: any) {
  return (
    <div className="glass-card stat-card">
      <div className="stat-header">
        <div className="stat-icon">{icon}</div>
        <span className="trend">{trend}</span>
      </div>
      <div className="stat-body">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
      <style jsx>{`
        .stat-card {
          padding: 24px;
        }
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .stat-icon {
          color: var(--primary);
        }
        .trend {
          font-size: 0.75rem;
          color: var(--primary);
        }
        h3 {
          font-size: 2rem;
          margin-bottom: 4px;
        }
        p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
