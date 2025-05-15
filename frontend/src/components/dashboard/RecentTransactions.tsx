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
    return (
      <div className="card">
        <div className="px-4 py-5">
          <div className="flex justify-between items-center">
            <div className="animate-pulse h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="animate-pulse h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
  <div className="card h-full flex flex-col">
    <div className="px-5 py-4 flex justify-between items-center bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Recent Transactions
      </h3>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last 24 hours</span>
    </div>
    <div className="border-t border-gray-200 dark:border-gray-700 flex-grow overflow-y-auto">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map((transaction) => (
          <li key={transaction._id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  getColorForCategory(transaction.category)
                }`}>
                  {getCategoryIcon(transaction.category)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.merchant}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${transaction.amt.toFixed(2)} - {formatCategory(transaction.category)}
                  </p>
                  {transaction.timestamp && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(transaction.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  )}
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                transaction.isFraud 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800'
              }`}>
                {transaction.isFraud ? 'Fraud' : 'Legitimate'}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <a href="/transactions" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
        View all transactions →
      </a>
    </div>
  </div>
);
}

function getColorForCategory(category: string): string {
  const categoryColors: Record<string, string> = {
    'online_retail': 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    'grocery_pos': 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    'entertainment': 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
    'gas_transport': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
    'health_fitness': 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300',
    'food_dining': 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300',
    'travel': 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
    'shopping_pos': 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300',
    'personal_care': 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
    'home': 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
  };
  
  return categoryColors[category] || 'bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300';
}

function getCategoryIcon(category: string): React.JSX.Element {
  const icons: Record<string, React.JSX.Element> = {
    'online_retail': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>,
    'grocery_pos': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg>,
    'entertainment': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path></svg>,
    'gas_transport': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path></svg>,
    'food_dining': <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path></svg>,
  };
  
  return icons[category] || <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path></svg>;
}

function formatCategory(category: string): string {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}