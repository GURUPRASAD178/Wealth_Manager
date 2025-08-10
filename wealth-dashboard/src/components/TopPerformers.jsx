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

    if (loading || !summary) {
        return <div className="alert alert-info">Loading top performers...</div>;
    }

    const { topPerformer, worstPerformer, diversificationScore, riskLevel } = summary;

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h5 className="card-title fw-bold mb-4">
                    Top Performers & Insights
                </h5>

                <div className="row mb-4">
                    {/* Top Performer */}
                    <div className="col-md-6 mb-3">
                        <div className="p-3 border-start border-success border-4 bg-success bg-opacity-10 rounded">
                            <h6 className="fw-semibold text-success">Top Performer</h6>
                            <p className="mb-1">Symbol: <strong>{topPerformer.symbol}</strong></p>
                            <p className="mb-1">Name: <strong>{topPerformer.name}</strong></p>
                            <p className="mb-0">Gain: <span className="text-success">{topPerformer.gainPercent}%</span></p>
                        </div>
                    </div>

                    {/* Worst Performer */}
                    <div className="col-md-6 mb-3">
                        <div className="p-3 border-start border-danger border-4 bg-danger bg-opacity-10 rounded">
                            <h6 className="fw-semibold text-danger">Worst Performer</h6>
                            <p className="mb-1">Symbol: <strong>{worstPerformer.symbol}</strong></p>
                            <p className="mb-1">Name: <strong>{worstPerformer.name}</strong></p>
                            <p className="mb-0">Loss: <span className="text-danger">{worstPerformer.gainPercent}%</span></p>
                        </div>
                    </div>
                </div>

                {/* Portfolio Insights */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="p-3 bg-light rounded shadow-sm">
                            <h6 className="text-muted mb-1">Diversification Score</h6>
                            <p className="fs-4 fw-bold mb-0">{diversificationScore}</p>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="p-3 bg-light rounded shadow-sm">
                            <h6 className="text-muted mb-1">Risk Level</h6>
                            <p className="fs-4 fw-bold mb-0">{riskLevel}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopPerformers;
