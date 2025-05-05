'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { transactionService } from '../../lib/api';

export default function FraudTrendChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const trends = await transactionService.getFraudTrends();
        setData(trends);
      } catch (error) {
        console.error('Failed to fetch fraud trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading) {
    return <div>Loading chart...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Fraud Trends</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="totalTransactions" 
              stroke="#8884d8" 
              name="Total Transactions"
            />
            <Line 
              type="monotone" 
              dataKey="fraudulentTransactions" 
              stroke="#dc2626" 
              name="Fraudulent"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}