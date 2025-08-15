import React from 'react';
import OverviewCards from '../components/OverviewCards';
import AllocationCharts from '../components/AllocationCharts';
import HoldingsTable from '../components/HoldingsTable';
import PerformanceChart from '../components/PerformanceChart';
import TopPerformers from '../components/TopPerformers';

const Dashboard = () => {
  return (
    <div className="container py-4">
      <h1 className="display-5 fw-bold mb-4 text-primary">WEALTH MANAGER - Portfolio Analytics Dashboard</h1>
      <a href="https://wealth-manager-q43n.onrender.com/admin/" className="btn btn-secondary mb-4" target="_blank" rel="noopener noreferrer">

      </a>
      {/* You can wrap sections in Bootstrap grid if needed */}
      <div className="mb-4">
        <OverviewCards />
      </div>

      <div className="mb-4">
        <AllocationCharts />
      </div>

      <div className="mb-4">
        <HoldingsTable />
      </div>

      <div className="mb-4">
        <PerformanceChart />
      </div>

      <div className="mb-4">
        <TopPerformers />
      </div>
    </div>
  );
};

export default Dashboard;
