import React, { useEffect, useState } from 'react';
import api from '../services/api';

const HoldingsTable = () => {
  const [holdings, setHoldings] = useState([]);
  const [filteredHoldings, setFilteredHoldings] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('symbol');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await api.get('/portfolio/holdings');
        setHoldings(res.data);
        setFilteredHoldings(res.data);
      } catch (err) {
        console.error("Error fetching holdings:", err);
      }
    };
    fetchHoldings();
  }, []);

  useEffect(() => {
    let data = [...holdings];

    // Filter by search
    if (search) {
      data = data.filter(item =>
        item.symbol.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

    setFilteredHoldings(data);
  }, [search, sortField, sortAsc, holdings]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold mb-0">Holdings</h5>
          <input
            type="text"
            placeholder="Search..."
            className="form-control form-control-sm w-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle text-nowrap">
            <thead className="table-light">
              <tr>
                <th onClick={() => handleSort('symbol')} role="button">Symbol ⬍</th>
                <th onClick={() => handleSort('name')} role="button">Name ⬍</th>
                <th onClick={() => handleSort('quantity')} role="button">Qty</th>
                <th>Avg Price</th>
                <th>Current Price</th>
                <th onClick={() => handleSort('value_inr')} role="button">Value ⬍</th>
                <th onClick={() => handleSort('gain_loss_inr')} role="button">Gain/Loss ⬍</th>
                <th onClick={() => handleSort('gain_loss_percent')} role="button">% Gain ⬍</th>
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.map((h, i) => (
                <tr key={i}>
                  <td>{h.symbol}</td>
                  <td>{h.name}</td>
                  <td>{h.quantity}</td>
                  <td>₹ {h.avg_price}</td>
                  <td>₹ {h.current_price}</td>
                  <td>₹ {h.value_inr}</td>
                  <td className={h.gain_loss_inr >= 0 ? 'text-success' : 'text-danger'}>
                    ₹ {h.gain_loss_inr}
                  </td>
                  <td className={h.gain_loss_percent >= 0 ? 'text-success' : 'text-danger'}>
                    {h.gain_loss_percent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HoldingsTable;
