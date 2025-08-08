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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-sm text-gray-500">Total Portfolio Value</h2>
        <p className="text-xl font-bold text-blue-600">₹ {summary.totalValue.toLocaleString()}</p>
      </div>
      <div className={`shadow rounded p-4 ${summary.totalGainLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
        <h2 className="text-sm text-gray-500">Total Gain / Loss</h2>
        <p className={`text-xl font-bold ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ₹ {summary.totalGainLoss.toLocaleString()}
        </p>
      </div>
      <div className={`shadow rounded p-4 ${summary.totalGainLossPercent >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
        <h2 className="text-sm text-gray-500">Portfolio Performance</h2>
        <p className={`text-xl font-bold ${summary.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {summary.totalGainLossPercent}%
        </p>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-sm text-gray-500">Number of Holdings</h2>
        <p className="text-xl font-bold text-gray-700">{holdingsCount}</p>
      </div>
    </div>
  );
};

export default OverviewCards;
