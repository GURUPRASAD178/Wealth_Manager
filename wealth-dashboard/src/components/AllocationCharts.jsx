import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import api from '../services/api';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AllocationCharts = () => {
  const [allocation, setAllocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllocation = async () => {
      try {
        const res = await api.get('/portfolio/allocation');
        setAllocation(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching allocation:", err);
        setLoading(false);
      }
    };
    fetchAllocation();
  }, []);

  if (loading || !allocation) return <div>Loading allocation data...</div>;

  const sectorLabels = Object.keys(allocation.bySector);
  const sectorData = sectorLabels.map(key => allocation.bySector[key].percentage);

  const marketCapLabels = Object.keys(allocation.byMarketCap);
  const marketCapData = marketCapLabels.map(key => allocation.byMarketCap[key].value);

  return (
    <div className="row g-4 mb-4">
      {/* Sector Allocation */}
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-3">Sector Allocation</h5>
            <Pie
              data={{
                labels: sectorLabels,
                datasets: [{
                  label: 'By Sector',
                  data: sectorData,
                  backgroundColor: ['#4ade80', '#60a5fa', '#fcd34d', '#f87171'],
                }]
              }}
            />
          </div>
        </div>
      </div>

      {/* Market Cap Allocation */}
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-3">Market Cap Allocation</h5>
            <Bar
              data={{
                labels: marketCapLabels,
                datasets: [{
                  label: 'By Market Cap',
                  data: marketCapData,
                  backgroundColor: ['#6366f1', '#facc15', '#f472b6'],
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationCharts;
