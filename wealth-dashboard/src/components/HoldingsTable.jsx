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
    <div className="bg-white shadow rounded p-4 mb-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Holdings</h3>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b text-gray-700">
            <th onClick={() => handleSort('symbol')} className="cursor-pointer">Symbol ⬍</th>
            <th onClick={() => handleSort('name')} className="cursor-pointer">Name ⬍</th>
            <th>Qty</th>
            <th>Avg Price</th>
            <th>Current Price</th>
            <th onClick={() => handleSort('value')} className="cursor-pointer">Value ⬍</th>
            <th onClick={() => handleSort('gainLoss')} className="cursor-pointer">Gain/Loss ⬍</th>
            <th onClick={() => handleSort('gainLossPercent')} className="cursor-pointer">% Gain ⬍</th>
          </tr>
        </thead>
        <tbody>
          {filteredHoldings.map((h, i) => (
            <tr key={i} className="border-b">
              <td className="py-1">{h.symbol}</td>
              <td>{h.name}</td>
              <td>{h.quantity}</td>
              <td>₹ {h.avgPrice}</td>
              <td>₹ {h.currentPrice}</td>
              <td>₹ {h.value.toLocaleString()}</td>
              <td className={h.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                ₹ {h.gainLoss.toLocaleString()}
              </td>
              <td className={h.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                {h.gainLossPercent}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;
