import React, { useEffect, useState } from 'react';
import api from '../services/api';

const OverviewCards = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [holdingsCount, setHoldingsCount] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/portfolio/summary');
        setSummary(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching summary:", err);
        setLoading(false);
      }
    };

    const fetchHoldingsCount = async () => {
      try {
        const res = await api.get('/portfolio/holdings');
        setHoldingsCount(res.data.length);
      } catch (err) {
        console.error("Error fetching holdings:", err);
      }
    };

    fetchSummary();
    fetchHoldingsCount();
  }, []);

  if (loading || !summary) return <div>Loading portfolio summary...</div>;

  return (
    <div className="row mb-4">
      <div className="col-md-3 mb-3">
        <div className="card shadow-sm">
          <div className="card-body">
            <h6 className="text-muted mb-1">Total Portfolio Value</h6>
            <h4 className="fw-bold text-primary">₹ {summary.totalValue.toLocaleString()}</h4>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className={`card shadow-sm ${summary.totalGainLoss >= 0 ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
          <div className="card-body">
            <h6 className="text-muted mb-1">Total Gain / Loss</h6>
            <h4 className={`fw-bold ${summary.totalGainLoss >= 0 ? 'text-success' : 'text-danger'}`}>
              ₹ {summary.totalGainLoss.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className={`card shadow-sm ${summary.totalGainLossPercent >= 0 ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
          <div className="card-body">
            <h6 className="text-muted mb-1">Portfolio Performance</h6>
            <h4 className={`fw-bold ${summary.totalGainLossPercent >= 0 ? 'text-success' : 'text-danger'}`}>
              {summary.totalGainLossPercent}%
            </h4>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className="card shadow-sm">
          <div className="card-body">
            <h6 className="text-muted mb-1">Number of Holdings</h6>
            <h4 className="fw-bold text-dark">{holdingsCount}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;
