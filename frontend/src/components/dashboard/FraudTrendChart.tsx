'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { transactionService } from '../../lib/api';
import { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';


const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">{`Date: ${label}`}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <span className="inline-block w-3 h-3 mr-1 bg-blue-500 rounded-full"></span>
          {`Total: ${payload[0].value}`}
        </p>
        <p className="text-sm text-red-600 dark:text-red-400">
          <span className="inline-block w-3 h-3 mr-1 bg-red-500 rounded-full"></span>
          {`Fraudulent: ${payload[1].value}`}
        </p>
      </div>
    );
  }

  return null;
};

export default function FraudTrendChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

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
    return (
      <div className="card p-4 h-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fraud Trends</h3>
          <div className="animate-pulse w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="w-full h-[300px] animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  const renderChart = () => {
    if (chartType === 'line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis 
            dataKey="_id" 
            tick={{ fill: '#6B7280' }}
            axisLine={{ stroke: '#9CA3AF' }}
          />
          <YAxis 
            tick={{ fill: '#6B7280' }}
            axisLine={{ stroke: '#9CA3AF' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Line 
            type="monotone" 
            dataKey="totalTransactions" 
            stroke="#4F46E5" 
            strokeWidth={2}
            name="Total Transactions"
            dot={{ stroke: '#4F46E5', strokeWidth: 2, r: 4 }}
            activeDot={{ stroke: '#4F46E5', strokeWidth: 2, r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="fraudulentTransactions" 
            stroke="#DC2626" 
            strokeWidth={2}
            name="Fraudulent"
            dot={{ stroke: '#DC2626', strokeWidth: 2, r: 4 }}
            activeDot={{ stroke: '#DC2626', strokeWidth: 2, r: 6 }}
          />
        </LineChart>
      );
    }
    
    return (
      <AreaChart data={data}>
        <defs>
          <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="fraudGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#DC2626" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis 
          dataKey="_id" 
          tick={{ fill: '#6B7280' }}
          axisLine={{ stroke: '#9CA3AF' }}
        />
        <YAxis 
          tick={{ fill: '#6B7280' }}
          axisLine={{ stroke: '#9CA3AF' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        <Area 
          type="monotone" 
          dataKey="totalTransactions" 
          stroke="#4F46E5" 
          fill="url(#totalGradient)" 
          strokeWidth={2}
          name="Total Transactions"
        />
        <Area 
          type="monotone" 
          dataKey="fraudulentTransactions" 
          stroke="#DC2626" 
          fill="url(#fraudGradient)" 
          strokeWidth={2}
          name="Fraudulent"
        />
      </AreaChart>
    );
  };

 return (
  <div className="card h-full flex flex-col">
    <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fraud Trends</h3>
    </div>
    <div className="p-5 flex-grow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button 
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              chartType === 'line' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Line
          </button>
          <button 
            onClick={() => setChartType('area')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              chartType === 'area' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Area
          </button>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);
}