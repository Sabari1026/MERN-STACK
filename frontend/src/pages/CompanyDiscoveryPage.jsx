import React, { useState, useEffect } from 'react';
import { companyService } from '../services/companyService';
import { CompanyCard } from '../components/companies/CompanyCard';
import { useToast } from '../context/ToastContext';

export function CompanyDiscoveryPage() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');

  useEffect(() => {
    async function loadCompanies() {
      setLoading(true);
      try {
        const params = { limit: 24 };
        if (search) params.search = search;
        if (industry) params.industry = industry;

        const res = await companyService.getCompanies(params);
        const list = res?.data?.companies || res?.companies || [];
        setCompanies(list);
      } catch (err) {
        toast.error('Unable to load companies directory.');
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, [search, industry, toast]);

  return (
    <div className="page-container">
      <main className="main-content">
        <div className="site-container">
          <div style={{ marginBottom: '32px' }}>
            <span className="caption" style={{ color: 'var(--color-accent-mint)', display: 'block', marginBottom: '8px' }}>
              Verified Tech Employers
            </span>
            <h1 className="h1" style={{ marginBottom: '12px' }}>
              Explore Companies
            </h1>
            <p className="body-text">
              Discover engineering teams, high-growth startups, and tech leaders hiring verified talent.
            </p>
          </div>

          {/* Filter Bar */}
          <div
            className="surface-card"
            style={{
              padding: '20px',
              marginBottom: '32px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center'
            }}
          >
            <div style={{ flex: '2 1 260px' }}>
              <input
                type="text"
                placeholder="Search company by name or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                <option value="">All Industries</option>
                <option value="Fintech">Fintech & Payments</option>
                <option value="SaaS">Enterprise SaaS</option>
                <option value="Healthtech">Healthtech</option>
                <option value="E-commerce">E-commerce & Logistics</option>
                <option value="AI / ML">Artificial Intelligence</option>
              </select>
            </div>
            {(search || industry) && (
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => {
                  setSearch('');
                  setIndustry('');
                }}
              >
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Companies Grid */}
          {loading ? (
            <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span className="spinner" style={{ width: '32px', height: '32px' }} />
              <div style={{ marginTop: '16px' }}>Loading verified companies...</div>
            </div>
          ) : companies.length === 0 ? (
            <div className="surface-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <p className="body-text">No companies matched your query.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {companies.map((c) => (
                <CompanyCard key={c._id || c.id} company={c} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
