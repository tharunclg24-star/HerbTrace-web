"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { ShieldCheck, Calendar, MapPin, FileText, CheckCircle, ExternalLink, Box, Activity, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

import { getBatchFromChain } from "@/lib/web3";
import { getActiveNetwork, getContractAddress } from "@/config/network.config";

function VerificationContent() {
  const searchParams = useSearchParams();
  const batchId = searchParams.get("batchId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!batchId) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching batch from chain:", batchId);
        const product = await getBatchFromChain(batchId);

        if (product) {
          // Add history for UI compatibility
          const productWithHistory = {
            ...product,
            history: (product as any).history || [
              {
                event: "Product Registered on Blockchain",
                date: new Date(Number(product.timestamp) * 1000),
                location: "HerbTrace Smart Contract"
              },
              {
                event: "Harvested",
                date: product.harvestDate ? new Date(product.harvestDate) : new Date(),
                location: product.origin
              }
            ]
          };
          setProductData(productWithHistory);
        } else {
          setError(`❌ Batch "${batchId}" NOT found on Blockchain.`);
        }
      } catch (err: any) {
        console.error(err);
        setError("Failed to connect to Blockchain. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [batchId]);

  if (loading) {
    return (
      <div className="verify-loading">
        <div className="spinner"></div>
        <p>Securing connection to the blockchain...</p>
        <style jsx>{`
          .verify-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; gap: 20px; color: #94a3b8; }
          .spinner { width: 50px; height: 50px; border: 3px solid rgba(16, 185, 129, 0.1); border-top: 3px solid #10b981; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!batchId || error) {
    return (
      <div className="verify-page container">
        <div className="glass-panel error-section text-center">
          <AlertCircle size={64} color="#f87171" className="mb-20" />
          <h1>Verification Failed</h1>
          <p className="text-muted">{error || "Invalid Product QR code."}</p>
          <a href="/" className="btn-primary mt-30">Back to Explorer</a>
        </div>
        <style jsx>{`
          .error-section { margin-top: 40px; padding: 100px 40px; }
          .mb-20 { margin-bottom: 20px; }
          .mt-30 { margin-top: 30px; }
          .text-center { text-align: center; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="verify-page container">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="certificate-container"
      >
        <div className="certificate-inner glass-panel">
          <div className="certificate-header">
            <div className="branding-seal">
              <ShieldCheck size={64} className="seal-icon" />
              <div className="seal-rings"></div>
            </div>
            <div className="header-text">
              <h1 className="text-gradient">Certificate of Authenticity</h1>
              <p className="serial-number">Blockchain Index: {batchId}</p>
            </div>
          </div>

          <div className="status-badge-container">
            <div className="status-badge pulse">
              <CheckCircle size={18} />
              <span>Immutable Record Verified</span>
            </div>
          </div>

          <div className="verify-grid">
            <div className="verify-details">
              <section className="detail-section">
                <h3>Product Specifications</h3>
                <div className="detail-row">
                  <Box size={20} className="text-primary" />
                  <div>
                    <label>Botanical / Herb Name</label>
                    <p>{productData.name}</p>
                  </div>
                </div>
                <div className="detail-row">
                  <Calendar size={20} className="text-primary" />
                  <div>
                    <label>Harvest & Manufacture</label>
                    <p>
                      {productData.harvestDate && format(new Date(productData.harvestDate), 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="detail-row">
                  <MapPin size={20} className="text-primary" />
                  <div>
                    <label>Geographical Origin</label>
                    <p>{productData.origin}</p>
                  </div>
                </div>
              </section>

              <section className="detail-section">
                <h3>Quality Compliance</h3>
                <div className="document-list">
                  {productData.ipfsHashes && productData.ipfsHashes.length > 0 ? (
                    productData.ipfsHashes.map((hash: string, index: number) => (
                      <a
                        key={index}
                        href={`https://gateway.pinata.cloud/ipfs/${hash}`}
                        target="_blank"
                        className="document-link"
                      >
                        <FileText size={18} />
                        <span>Quality Certificate #{index + 1}</span>
                        <ExternalLink size={14} className="ms-auto" />
                      </a>
                    ))
                  ) : (
                    <p className="text-muted italic">No digital audit documents attached.</p>
                  )}
                </div>
              </section>
            </div>

            <div className="verify-timeline">
              <section className="detail-section">
                <h3>Supply Chain Provenance</h3>
                <div className="timeline">
                  {productData.history && productData.history.length > 0 ? (
                    productData.history.map((step: any, i: number) => (
                      <div key={i} className="timeline-step">
                        <div className="timeline-marker">
                          <CheckCircle size={16} />
                          {i < productData.history.length - 1 && <div className="timeline-line"></div>}
                        </div>
                        <div className="timeline-content">
                          <h4>{step.event}</h4>
                          <p className="step-date">
                            {format(new Date(step.date), 'PPP')}
                          </p>
                          <p className="step-loc">{step.location}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No provenance events tracked.</p>
                  )}
                </div>
              </section>

              <div className="manufacturer-card">
                <Activity size={24} color="#10b981" />
                <div>
                  <label>Authorized Manufacturer</label>
                  <p>{productData.manufacturerAddress?.slice(0, 10)}...{productData.manufacturerAddress?.slice(-8)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .verify-page {
          padding: 100px 0;
          min-height: 100vh;
          background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.08) 0%, transparent 40%);
        }

        .certificate-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .certificate-inner {
          padding: 80px;
          border: 1px solid var(--primary-glow);
          background: linear-gradient(135deg, rgba(8, 14, 30, 0.98) 0%, rgba(5, 11, 26, 1) 100%);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
        }

        .certificate-header {
          display: flex;
          align-items: center;
          gap: 40px;
          margin-bottom: 60px;
        }

        .branding-seal {
          width: 120px;
          height: 120px;
          background: var(--primary-glow);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          color: var(--primary);
          box-shadow: 0 0 40px var(--primary-glow);
        }

        .seal-rings {
          position: absolute;
          inset: -10px;
          border: 1px solid var(--primary-glow);
          border-radius: 50%;
          animation: spin 30s linear infinite;
        }

        .header-text h1 {
          font-size: 3.2rem;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .serial-number {
          font-family: 'Outfit', monospace;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 16px;
          border-radius: 10px;
          display: inline-block;
          font-size: 0.95rem;
          border: 1px solid var(--border-light);
        }

        .status-badge-container {
          display: flex;
          justify-content: center;
          margin-bottom: 60px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 40px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--primary);
          border-radius: 100px;
          color: #34d399;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 0.95rem;
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
        }

        .pulse { animation: pulse-ring 3s infinite; }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .verify-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 60px;
          border-top: 1px solid var(--border-light);
          padding-top: 60px;
        }

        .detail-section h3 {
          font-size: 1.1rem;
          margin-bottom: 30px;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 700;
        }

        .detail-row {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }

        .detail-row label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-dim);
          margin-bottom: 4px;
        }

        .detail-row p { font-weight: 600; font-size: 1.25rem; color: var(--text-main); }

        .document-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
          color: var(--text-muted);
        }

        .document-link:hover {
          background: rgba(16, 185, 129, 0.05);
          border-color: var(--primary);
          color: var(--text-main);
          transform: translateX(5px);
        }

        .timeline-step { display: flex; gap: 24px; padding-bottom: 30px; position: relative; }
        .timeline-marker { display: flex; flex-direction: column; align-items: center; z-index: 1; color: var(--primary); }
        .timeline-line { width: 1px; height: 100%; background: var(--border-light); position: absolute; top: 24px; left: 8px; }
        .timeline-content h4 { font-size: 1.1rem; margin-bottom: 6px; font-weight: 600; }
        .step-date { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 2px; }
        .step-loc { font-size: 0.9rem; color: var(--primary); font-weight: 600; }

        .manufacturer-card {
          margin-top: 40px;
          padding: 30px;
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(16, 185, 129, 0.05);
          border-radius: 20px;
          border: 1px solid var(--primary-glow);
        }

        .manufacturer-card label {
          font-size: 0.8rem;
          color: var(--text-dim);
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .manufacturer-card p { font-family: monospace; font-size: 1.1rem; color: var(--primary); font-weight: 700; word-break: break-all; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 992px) {
          .certificate-inner { padding: 40px 20px; }
          .verify-grid { grid-template-columns: 1fr; gap: 40px; }
          .header-text h1 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="p-40 text-center">Initialising Verification...</div>}>
      <VerificationContent />
    </Suspense>
  );
}
