"use client";

import { useState } from "react";
import {
    BarChart3,
    FileSearch,
    Download,
    Filter,
    ShieldAlert,
    ArrowUpRight,
    ChevronRight,
    Search
} from "lucide-react";
import { motion } from "framer-motion";

export default function ReportsPage() {
    const [filterType, setFilterType] = useState("all");

    const mockBatches = [
        { id: "HT-9921", product: "Ashwagandha", manufacturer: "VillageHerbs Co.", date: "2025-10-28", status: "Verified", score: 98 },
        { id: "HT-9922", product: "Brahmi Ext.", manufacturer: "Organic India", date: "2025-10-30", status: "Pending", score: 92 },
        { id: "HT-9923", product: "Turmeric Powder", manufacturer: "PureRoots Ltd.", date: "2025-11-02", status: "Verified", score: 99 },
        { id: "HT-9924", product: "Neem Oil", manufacturer: "EcoExtracts", date: "2025-11-05", status: "Under Review", score: 85 },
    ];

    return (
        <div className="reports-page container">
            <header className="page-header">
                <div>
                    <h1>Compliance & Audit Logs</h1>
                    <p className="text-muted">Regulatory oversight and batch-wise sustainability reports.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary">
                        <Download size={18} /> Export All (CSV)
                    </button>
                </div>
            </header>

            {/* Admin Stats */}
            <div className="admin-stats-grid">
                <div className="glass-card admin-stat">
                    <div className="stat-label">Total Registered Batches</div>
                    <div className="stat-value">1,452</div>
                    <div className="stat-meta text-primary">+12% from last month</div>
                </div>
                <div className="glass-card admin-stat">
                    <div className="stat-label">Active Manufacturers</div>
                    <div className="stat-value">84</div>
                    <div className="stat-meta">Across 12 regions</div>
                </div>
                <div className="glass-card admin-stat">
                    <div className="stat-label">Verification Requests</div>
                    <div className="stat-value">12,840</div>
                    <div className="stat-meta text-primary">High scan density</div>
                </div>
                <div className="glass-card admin-stat">
                    <div className="stat-label">Compliance Red Flags</div>
                    <div className="stat-value">2</div>
                    <div className="stat-meta" style={{ color: '#f87171' }}>Requires immediate audit</div>
                </div>
            </div>

            {/* Audit Table */}
            <section className="audit-section glass-panel">
                <div className="audit-header">
                    <div className="audit-title">
                        <FileSearch size={22} color="#10b981" />
                        <h3>Recent Batch Audits</h3>
                    </div>
                    <div className="audit-filters">
                        <div className="search-box">
                            <Search size={18} />
                            <input type="text" placeholder="Search Batch ID or Manufacturer..." />
                        </div>
                        <button className="btn-secondary btn-sm">
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>

                <div className="audit-table-wrapper">
                    <table className="audit-table">
                        <thead>
                            <tr>
                                <th>Batch ID</th>
                                <th>Product</th>
                                <th>Manufacturer</th>
                                <th>Registration Date</th>
                                <th>Trust Score</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockBatches.map((batch, i) => (
                                <tr key={i}>
                                    <td><code>{batch.id}</code></td>
                                    <td>{batch.product}</td>
                                    <td>{batch.manufacturer}</td>
                                    <td>{batch.date}</td>
                                    <td>
                                        <div className="score-pill">
                                            <div className="score-fill" style={{ width: `${batch.score}%` }}></div>
                                            <span>{batch.score}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${batch.status.toLowerCase().replace(' ', '-')}`}>
                                            {batch.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-icon-link">
                                            Details <ChevronRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <style jsx>{`
        .reports-page {
          padding-bottom: 60px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .admin-stat {
          padding: 24px;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-dim);
          text-transform: uppercase;
          margin-bottom: 12px;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-meta {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .audit-section {
          padding: 0;
          overflow: hidden;
        }

        .audit-header {
          padding: 24px 32px;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .audit-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .audit-filters {
          display: flex;
          gap: 16px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          padding: 0 12px;
          border-radius: 10px;
          width: 300px;
        }

        .search-box input {
          background: none;
          border: none;
          padding: 10px;
          color: white;
          width: 100%;
          outline: none;
        }

        .audit-table-wrapper {
          overflow-x: auto;
        }

        .audit-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .audit-table th {
          padding: 16px 32px;
          background: rgba(255, 255, 255, 0.02);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-dim);
          text-transform: uppercase;
        }

        .audit-table td {
          padding: 16px 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.95rem;
        }

        code {
          background: rgba(16, 185, 129, 0.1);
          color: var(--primary);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.verified { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-badge.under-review { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .score-pill {
          width: 100px;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .score-fill {
          height: 100%;
          background: var(--primary);
          border-radius: 100px;
        }

        .score-pill span {
          position: absolute;
          right: -40px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .btn-icon-link {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: 0.2s;
        }

        .btn-icon-link:hover {
          color: var(--primary);
        }

        @media (max-width: 1024px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
        </div>
    );
}
