import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceChart = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [returnsData, setReturnsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await api.get('/portfolio/performance');
        setTimelineData(res.data.timeline);
        setReturnsData(res.data.returns);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching performance:", err);
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading || !timelineData.length) return <div>Loading performance chart...</div>;

  const labels = timelineData.map(entry => entry.date);
  const portfolioSeries = timelineData.map(entry => entry.portfolio);
  const niftySeries = timelineData.map(entry => entry.nifty50);
  const goldSeries = timelineData.map(entry => entry.gold);

  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Portfolio vs Nifty 50 vs Gold</h3>
      <Line
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Portfolio',
              data: portfolioSeries,
              borderColor: '#3b82f6',
              backgroundColor: '#3b82f670',
              tension: 0.4,
            },
            {
              label: 'Nifty 50',
              data: niftySeries,
              borderColor: '#10b981',
              backgroundColor: '#10b98170',
              tension: 0.4,
            },
            {
              label: 'Gold',
              data: goldSeries,
              borderColor: '#f59e0b',
              backgroundColor: '#f59e0b70',
              tension: 0.4,
            },
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ₹ ${ctx.parsed.y.toLocaleString()}`,
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Value (INR)',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Date',
              },
            }
          }
        }}
      />

      {returnsData && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {['portfolio', 'nifty50', 'gold'].map(asset => (
            <div key={asset} className="bg-gray-50 p-3 rounded shadow-sm">
              <h4 className="font-semibold capitalize">{asset}</h4>
              <p>1 Month: {returnsData[asset]["1month"]}%</p>
              <p>3 Months: {returnsData[asset]["3months"]}%</p>
              <p>1 Year: {returnsData[asset]["1year"]}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;
