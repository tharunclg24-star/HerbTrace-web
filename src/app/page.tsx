"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Database, QrCode, ArrowRight, CheckCircle, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <span className="badge">Next-Gen Traceability</span>
          <h1 className="hero-title">
            Bringing <span className="text-gradient">Trust</span> to Every <br />
            Herbal Batch
          </h1>
          <p className="hero-subtitle">
            HerbTrace uses blockchain and IPFS technology to verify the authenticity,
            origin, and quality of Ayurvedic products. Scan. Verify. Trust.
          </p>
          <div className="hero-cta">
            <Link href="/dashboard">
              <button className="btn-primary">
                Launch Dashboard <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn-secondary">View Demo</button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hero-visual"
        >
          <div className="qr-preview glass-card">
            <div className="qr-box">
              <QrCode size={120} color="#10b981" />
            </div>
            <div className="qr-details">
              <h4>Batch #HT-9921</h4>
              <p>Ashwagandha Root Extract</p>
              <span className="status-tag">Verified On-Chain</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="features container">
        <div className="section-header">
          <h2>Core Features</h2>
          <p>Built for manufacturers, trusted by consumers.</p>
        </div>

        <div className="features-grid">
          <FeatureCard
            icon={<Shield />}
            title="Blockchain Verified"
            desc="Every batch is anchored to the blockchain, ensuring immutable records that cannot be tampered with."
          />
          <FeatureCard
            icon={<Database />}
            title="IPFS Scaling"
            desc="Large compliance documents and lab reports are stored securely off-chain using decentralized IPFS."
          />
          <FeatureCard
            icon={<QrCode />}
            title="Instant QR Verification"
            desc="Generate unique QR codes for every product. Consumers verify details instantly without any app."
          />
          <FeatureCard
            icon={<CheckCircle />}
            title="Regulatory Compliance"
            desc="Built-in reporting tools for admins and regulators to audit supply chains effortlessly."
          />
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          padding-top: 40px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: center;
          min-height: 80vh;
        }

        .badge {
          display: inline-block;
          padding: 6px 16px;
          background: var(--primary-glow);
          border: 1px solid var(--border-glow);
          color: var(--primary);
          border-radius: 100px;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 24px;
        }

        .hero-title {
          font-size: 4.5rem;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 600px;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .hero-cta {
          display: flex;
          gap: 16px;
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          position: relative;
        }

        .qr-preview {
          padding: 30px;
          text-align: center;
          width: 300px;
        }

        .qr-box {
          background: white;
          padding: 20px;
          border-radius: 16px;
          display: inline-block;
          margin-bottom: 20px;
        }

        .qr-details h4 {
          margin-bottom: 4px;
        }

        .qr-details p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .status-tag {
          font-size: 0.75rem;
          background: #064e3b;
          color: #34d399;
          padding: 4px 12px;
          border-radius: 100px;
          font-weight: 600;
        }

        .features {
          padding: 100px 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .section-header p {
          color: var(--text-muted);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        @media (max-width: 968px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-subtitle {
            margin: 0 auto 40px;
          }
          .hero-cta {
            justify-content: center;
          }
          .hero-title {
            font-size: 3rem;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass-card feature-card">
      <div className="feat-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <style jsx>{`
        .feature-card {
          padding: 40px;
        }
        .feat-icon {
          color: var(--primary);
          margin-bottom: 20px;
          background: var(--primary-glow);
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }
        h3 {
          margin-bottom: 12px;
        }
        p {
          color: var(--text-muted);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
