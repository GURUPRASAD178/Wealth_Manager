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

  if (loading || !timelineData.length) {
    return <div className="alert alert-info">Loading performance chart...</div>;
  }

  const labels = timelineData.map(entry => entry.date);
  const portfolioSeries = timelineData.map(entry => entry.portfolio);
  const niftySeries = timelineData.map(entry => entry.nifty50);
  const goldSeries = timelineData.map(entry => entry.gold);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title fw-bold mb-4">
          Portfolio vs Nifty 50 vs Gold
        </h5>

        <Line
          data={{
            labels: labels,
            datasets: [
              {
                label: 'Portfolio',
                data: portfolioSeries,
                borderColor: '#0d6efd',
                backgroundColor: '#0d6efd70',
                tension: 0.4,
              },
              {
                label: 'Nifty 50',
                data: niftySeries,
                borderColor: '#198754',
                backgroundColor: '#19875470',
                tension: 0.4,
              },
              {
                label: 'Gold',
                data: goldSeries,
                borderColor: '#ffc107',
                backgroundColor: '#ffc10770',
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
          <div className="row mt-4">
            {['portfolio', 'nifty50', 'gold'].map(asset => (
              <div key={asset} className="col-md-4 mb-3">
                <div className="p-3 border rounded bg-light">
                  <h6 className="fw-semibold text-capitalize">{asset}</h6>
                  <p className="mb-1">1 Month: {returnsData[asset]["1month"]}%</p>
                  <p className="mb-1">3 Months: {returnsData[asset]["3months"]}%</p>
                  <p className="mb-0">1 Year: {returnsData[asset]["1year"]}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
