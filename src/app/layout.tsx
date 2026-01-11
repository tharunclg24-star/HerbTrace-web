"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import { connectWallet } from "@/lib/web3";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [wallet, setWallet] = useState<any>(null);

  const handleConnect = async () => {
    const res = await connectWallet();
    if (res) setWallet(res);
  };

  return (
    <html lang="en">
      <head>
        <title>HerbTrace | Blockchain-Powered Herbal Traceability</title>
        <meta name="description" content="Verify the authenticity and origin of Ayurvedic and herbal products using blockchain and IPFS." />
      </head>
      <body>
        <div className="app-wrapper">
          <nav className="navbar glass-panel">
            <div className="nav-container">
              <div className="logo cursor-pointer" onClick={() => window.location.href = "/"}>
                <span className="logo-icon">🌿</span>
                <span className="logo-text">Herb<span className="text-primary">Trace</span></span>
              </div>
              <div className="nav-links">
                <a href="/" className="nav-link">Home</a>
                <a href="/dashboard" className="nav-link">Dashboard</a>
                <a href="/verify" className="nav-link">Verify</a>
                <a href="/reports" className="nav-link">Reports</a>
              </div>
              <div className="nav-actions">
                {wallet ? (
                  <div className="wallet-pill">
                    <div className="wallet-dot"></div>
                    <span>{wallet.account.slice(0, 6)}...{wallet.account.slice(-4)}</span>
                  </div>
                ) : (
                  <button className="btn-secondary btn-sm" onClick={handleConnect}>Connect Wallet</button>
                )}
              </div>
            </div>
          </nav>
          <main className="main-content">
            {children}
          </main>
          <footer className="footer">
            <div className="container">
              <div className="footer-grid">
                <div className="footer-brand">
                  <h3>HerbTrace</h3>
                  <p>Trust through transparency in the herbal supply chain.</p>
                </div>
                <div className="footer-links">
                  <h4>Platform</h4>
                  <a href="/verify">Verification</a>
                  <a href="/dashboard">Manufacturers</a>
                  <a href="/reports">Regulators</a>
                </div>
                <div className="footer-links">
                  <h4>Legal</h4>
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Service</a>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2025 HerbTrace. Empowering Transparency in Ayurveda.</p>
              </div>
            </div>
          </footer>
        </div>

        <style jsx>{`
          .app-wrapper {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background: 
              radial-gradient(circle at 10% 10%, rgba(16, 185, 129, 0.05), transparent 30%),
              radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.03), transparent 30%),
              var(--bg-dark);
          }

          .cursor-pointer { cursor: pointer; }

          .navbar {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 1200px;
            z-index: 1000;
            padding: 10px 24px;
            border-radius: 20px;
          }

          .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.4rem;
            font-weight: 800;
            font-family: 'Outfit', sans-serif;
          }

          .text-primary {
            color: #10b981;
          }

          .nav-links {
            display: flex;
            gap: 32px;
          }

          .nav-link {
            font-size: 0.9rem;
            font-weight: 600;
            color: #94a3b8;
            transition: 0.2s;
          }

          .nav-link:hover {
            color: #10b981;
          }

          .wallet-pill {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.2);
            padding: 6px 16px;
            border-radius: 100px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: monospace;
            font-size: 0.85rem;
            color: #10b981;
          }

          .wallet-dot {
            width: 6px;
            height: 6px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 10px #10b981;
          }

          .main-content {
            flex: 1;
            padding-top: 120px;
            padding-bottom: 60px;
          }

          .footer {
            padding: 80px 0 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            background: rgba(15, 23, 42, 0.5);
          }

          .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 60px;
            margin-bottom: 60px;
          }

          .footer-brand h3 { margin-bottom: 16px; }
          .footer-brand p { color: var(--text-muted); max-width: 300px; line-height: 1.6; }

          .footer-links h4 { margin-bottom: 24px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim); }
          .footer-links a { display: block; margin-bottom: 12px; color: var(--text-muted); transition: 0.2s; font-size: 0.95rem; }
          .footer-links a:hover { color: var(--primary); }

          .footer-bottom {
            padding-top: 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            text-align: center;
            color: #64748b;
            font-size: 0.85rem;
          }

          .btn-sm {
            padding: 8px 16px;
            font-size: 0.85rem;
          }

          @media (max-width: 768px) {
            .nav-links { display: none; }
            .footer-grid { grid-template-columns: 1fr; gap: 40px; }
          }
        `}</style>
      </body>
    </html>
  );
}
