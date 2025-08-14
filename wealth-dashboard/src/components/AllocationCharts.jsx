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
      } catch (err) {
        console.error("Error fetching allocation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllocation();
  }, []);

  if (loading) return <div>Loading allocation data...</div>;
  if (!allocation) return <div>No allocation data available.</div>;

  // Sector Allocation - using percentage
  const sectorLabels = Object.keys(allocation.bySector);
  const sectorData = sectorLabels.map(key => allocation.bySector[key].percentage);

  // Market Cap Allocation - using percentage for consistency
  const marketCapLabels = Object.keys(allocation.byMarketCap);
  const marketCapData = marketCapLabels.map(key => allocation.byMarketCap[key].percentage);

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
                  label: 'Sector %',
                  data: sectorData,
                  backgroundColor: ['#4ade80', '#60a5fa', '#fcd34d', '#f87171', '#a78bfa', '#fb923c'],
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
                  label: 'Market Cap %',
                  data: marketCapData,
                  backgroundColor: ['#6366f1', '#facc15', '#f472b6'],
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    ticks: {
                      callback: function (value) {
                        return value + '%';
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationCharts;
