import React from 'react';
import OverviewCards from '../components/OverviewCards';
import AllocationCharts from '../components/AllocationCharts';
import HoldingsTable from '../components/HoldingsTable';
import PerformanceChart from '../components/PerformanceChart';
import TopPerformers from '../components/TopPerformers';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Portfolio Analytics Dashboard</h1>
      <OverviewCards />
      <AllocationCharts />
      <HoldingsTable />
      <PerformanceChart />
      <TopPerformers />
    </div>
  );
};

export default Dashboard;
