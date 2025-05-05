'use client';

import { useEffect, useState } from 'react';
import { transactionService, Transaction } from '../../lib/api';

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getTransactions();
        setTransactions(data.slice(0, 5)); // Get only the 5 most recent
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Recent Transactions
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <li key={transaction._id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.merchant}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${transaction.amt.toFixed(2)} - {transaction.category}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transaction.isFraud 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {transaction.isFraud ? 'Fraud' : 'Legitimate'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}