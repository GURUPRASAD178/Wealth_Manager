import React, { useEffect, useState } from 'react';
import api from '../services/api';

const TopPerformers = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get('/portfolio/summary');
                setSummary(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching top performers:", err);
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading || !summary) return <div>Loading top performers...</div>;

    const { topPerformer, worstPerformer, diversificationScore, riskLevel } = summary;

    return (
        <div className="bg-white shadow rounded p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Top Performers & Insights</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-4">
                {/* Best Performer */}
                <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                    <h4 className="text-green-700 font-semibold">Top Performer</h4>
                    {/* <p className="text-sm">Symbol: <strong>{topPerformer.symbol}</strong></p> */}
                    {/* <p className="text-sm">Name: <strong>{topPerformer.name}</strong></p> */}
                    {/* <p className="text-sm">Gain: <span className="text-green-600">{topPerformer.gainPercent}%</span></p> */}
                </div>

                {/* Worst Performer */}
                <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                    <h4 className="text-red-700 font-semibold">Worst Performer</h4>
                    {/* <p className="text-sm">Symbol: <strong>{worstPerformer.symbol}</strong></p> */}
                    {/* <p className="text-sm">Name: <strong>{worstPerformer.name}</strong></p> */}
                    {/* <p className="text-sm">Loss: <span className="text-red-600">{worstPerformer.gainPercent}%</span></p> */}
                </div>
            </div>

            {/* Portfolio Insights */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded p-4 shadow-sm">
                    <h4 className="text-sm text-gray-600">Diversification Score</h4>
                    <p className="text-2xl font-bold text-gray-800">{diversificationScore}</p>
                </div>
                <div className="bg-gray-50 rounded p-4 shadow-sm">
                    <h4 className="text-sm text-gray-600">Risk Level</h4>
                    <p className="text-2xl font-bold text-gray-800">{riskLevel}</p>
                </div>
            </div>
        </div>
    );
};

export default TopPerformers;
