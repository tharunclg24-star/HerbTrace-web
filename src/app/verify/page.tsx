"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { ShieldCheck, Calendar, MapPin, FileText, CheckCircle, ExternalLink, Box, Activity, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

import { getBatchFromChain } from "@/lib/web3";

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
        console.log("Fetching batch from chain verified:", batchId);
        // Direct Blockchain Call
        const product = await getBatchFromChain(batchId);

        if (product) {
          // Add history for UI compatibility
          const productWithHistory = {
            ...product,
            history: [
              {
                event: "Registered on Blockchain",
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
          setError("Batch not found on blockchain.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to verify on-chain records.");
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
        <p>Verifying Batch records on-chain...</p>
      </div>
    );
  }

  if (!batchId || error) {
    return (
      <div className="verify-page container">
        <div className="glass-panel error-section text-center py-80">
          <AlertCircle size={64} color="#f87171" className="mb-20" />
          <h1>Verification Failed</h1>
          <p className="text-muted">{error || "Please scan a valid product QR code."}</p>
          <a href="/" className="btn-primary mt-20">Back to Home</a>
        </div>
        <style jsx>{`
                    .error-section { margin-top: 40px; }
                    .mb-20 { margin-bottom: 20px; }
                    .mt-20 { margin-top: 20px; }
                    .text-center { text-align: center; }
                    .py-80 { padding: 80px 0; }
                `}</style>
      </div>
    );
  }

  return (
    <div className="verify-page container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="verify-header"
      >
        <div className="status-banner glass-card">
          <ShieldCheck size={40} color="#10b981" />
          <div>
            <h1>Authenticity Verified</h1>
            <p>This product batch is tracked and secured by HerbTrace Blockchain</p>
          </div>
          {productData.txHash && (
            <div className="tx-link">
              <span className="tx-label">Blockchain TX</span>
              <code>{productData.txHash.slice(0, 10)}...</code>
            </div>
          )}
        </div>
      </motion.div>

      <div className="verify-grid">
        {/* Left Column: Details */}
        <div className="verify-details">
          <section className="detail-section glass-panel">
            <h3>Product Information</h3>
            <div className="detail-row">
              <Box size={20} className="text-primary" />
              <div>
                <label>Product Name</label>
                <p>{productData.name}</p>
              </div>
            </div>
            <div className="detail-row">
              <Calendar size={20} className="text-primary" />
              <div>
                <label>Manufacture Date</label>
                <p>{format(new Date(productData.manufactureDate), 'PPP')}</p>
              </div>
            </div>
            <div className="detail-row">
              <MapPin size={20} className="text-primary" />
              <div>
                <label>Origin</label>
                <p>{productData.origin}</p>
              </div>
            </div>
          </section>

          <section className="detail-section glass-panel">
            <h3>Compliance & Quality</h3>
            <div className="space-y-3">
              {productData.ipfsHashes && productData.ipfsHashes.length > 0 ? (
                productData.ipfsHashes.map((hash: string, index: number) => {
                  if (hash.startsWith("QmMockHash")) {
                    return (
                      <div key={index} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm">
                        <p className="font-semibold">⚠️ Document Storage Not Configured</p>
                        <p className="opacity-80">This record was created in Mock Mode causing the PDF link to be invalid. Configure Pinata in .env.local to enable real file storage.</p>
                      </div>
                    );
                  }
                  return (
                    <a
                      key={index}
                      href={`https://gateway.pinata.cloud/ipfs/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors group"
                    >
                      <span className="flex items-center text-white font-medium">
                        <FileText className="w-5 h-5 mr-3 text-purple-400 group-hover:text-purple-300" />
                        Lab Report/Certificate #{index + 1}
                      </span>
                      <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                    </a>
                  );
                })
              ) : (
                <p className="text-white/50 text-sm italic">No documents attached to this batch.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Timeline */}
        <div className="verify-timeline">
          <section className="detail-section glass-panel">
            <h3>Provenance Timeline</h3>
            <div className="timeline">
              {productData.history.map((step: any, i: number) => (
                <div key={i} className="timeline-step">
                  <div className="timeline-marker">
                    <CheckCircle size={16} />
                    {i < productData.history.length - 1 && <div className="timeline-line"></div>}
                  </div>
                  <div className="timeline-content">
                    <h4>{step.event}</h4>
                    <p className="step-date">{format(new Date(step.date), 'PPP')}</p>
                    <p className="step-loc">{step.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="manufacturer-card glass-card">
            <Activity size={24} color="#10b981" />
            <div>
              <label>Registered Manufacturer</label>
              <p>{productData.manufacturer}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .verify-page {
          padding-bottom: 80px;
        }

        .verify-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 20px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid var(--primary-glow);
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .verify-header {
          margin-bottom: 40px;
        }

        .status-banner {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 32px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
          border-color: var(--primary);
        }

        .status-banner h1 {
          font-size: 2rem;
          color: #34d399;
        }

        .tx-link {
          margin-left: auto;
          text-align: right;
        }

        .tx-label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-dim);
          margin-bottom: 4px;
        }

        code {
          background: rgba(0, 0, 0, 0.3);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .verify-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 32px;
        }

        .detail-section {
          padding: 32px;
          margin-bottom: 24px;
        }

        .detail-section h3 {
          margin-bottom: 24px;
          font-size: 1.25rem;
          border-left: 4px solid var(--primary);
          padding-left: 12px;
        }

        .detail-row {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .detail-row label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-row p {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .report-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .report-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
        }

        .report-info {
          flex: 1;
        }

        .report-name {
          font-weight: 600;
        }

        .report-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .btn-icon {
          color: var(--text-muted);
          transition: 0.2s;
        }

        .btn-icon:hover {
          color: var(--primary);
        }

        .timeline {
          padding-left: 10px;
        }

        .timeline-step {
          display: flex;
          gap: 20px;
          padding-bottom: 30px;
        }

        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          color: var(--primary);
        }

        .timeline-line {
          width: 2px;
          flex: 1;
          background: var(--border-light);
          margin-top: 8px;
        }

        .timeline-content h4 {
          font-size: 1rem;
          margin-bottom: 4px;
        }

        .step-date {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .step-loc {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .manufacturer-card {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .manufacturer-card label {
          font-size: 0.75rem;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .manufacturer-card p {
          font-weight: 600;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .verify-grid {
            grid-template-columns: 1fr;
          }
          .status-banner {
            flex-direction: column;
            text-align: center;
          }
          .tx-link {
            margin: 20px 0 0;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div>Loading verification...</div>}>
      <VerificationContent />
    </Suspense>
  );
}
