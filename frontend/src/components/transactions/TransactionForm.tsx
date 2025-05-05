'use client';

import { useState } from 'react';
import { transactionService, Transaction } from '../../lib/api';

export default function TransactionForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    amt: 150.00,
    lat: 40.7128,
    long: -74.0060,
    city_pop: 8500000,
    merch_lat: 40.7589,
    merch_long: -73.9851,
    merchant: 'Amazon',
    category: 'online_retail',
    gender: 'F',
    job: 'Engineer'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amt' || name === 'lat' || name === 'long' || 
               name === 'city_pop' || name === 'merch_lat' || name === 'merch_long' 
               ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await transactionService.analyzeTransaction(formData);
      setResult(result);
    } catch (error) {
      console.error('Failed to analyze transaction:', error);
      alert('Failed to analyze transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Analyze Transaction
        </h3>
        
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="amt" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                name="amt"
                id="amt"
                step="0.01"
                value={formData.amt}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="merchant" className="block text-sm font-medium text-gray-700">
                Merchant
              </label>
              <input
                type="text"
                name="merchant"
                id="merchant"
                value={formData.merchant}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="online_retail">Online Retail</option>
                <option value="grocery_pos">Grocery Store</option>
                <option value="entertainment">Entertainment</option>
                <option value="gas_transport">Gas/Transport</option>
                <option value="health_fitness">Health/Fitness</option>
                <option value="food_dining">Food/Dining</option>
                <option value="travel">Travel</option>
                <option value="shopping_pos">Shopping (in store)</option>
                <option value="personal_care">Personal Care</option>
                <option value="misc_pos">Misc. (in store)</option>
                <option value="misc_net">Misc. (online)</option>
                <option value="home">Home</option>
                <option value="kids_pets">Kids/Pets</option>
                <option value="education">Education</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="F">Female</option>
                <option value="M">Male</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="job" className="block text-sm font-medium text-gray-700">
                Job
              </label>
              <input
                type="text"
                name="job"
                id="job"
                value={formData.job}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="city_pop" className="block text-sm font-medium text-gray-700">
                City Population
              </label>
              <input
                type="number"
                name="city_pop"
                id="city_pop"
                value={formData.city_pop}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
                Customer Latitude
              </label>
              <input
                type="number"
                name="lat"
                id="lat"
                step="0.0001"
                value={formData.lat}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="long" className="block text-sm font-medium text-gray-700">
                Customer Longitude
              </label>
              <input
                type="number"
                name="long"
                id="long"
                step="0.0001"
                value={formData.long}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="merch_lat" className="block text-sm font-medium text-gray-700">
                Merchant Latitude
              </label>
              <input
                type="number"
                name="merch_lat"
                id="merch_lat"
                step="0.0001"
                value={formData.merch_lat}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="merch_long" className="block text-sm font-medium text-gray-700">
                Merchant Longitude
              </label>
              <input
                type="number"
                name="merch_long"
                id="merch_long"
                step="0.0001"
                value={formData.merch_long}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Analyzing...' : 'Analyze Transaction'}
            </button>
          </div>
        </form>
        
        {result && (
          <div className={`mt-6 p-4 rounded-md ${
            result.isFraud 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <h4 className="text-lg font-medium">
              {result.isFraud ? 'Fraud Detected!' : 'Transaction Legitimate'}
            </h4>
            <div className="mt-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Fraud Probability:</span>
                <span className="text-sm font-medium">{(result.fraudProbability! * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Risk Level:</span>
                <span className={`text-sm font-medium ${
                  result.riskLevel === 'High' ? 'text-red-600' : 
                  result.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {result.riskLevel}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-500">Model Predictions:</div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">XGBoost:</span>
                  <span className="text-sm font-medium">{(result.modelPredictions!.xgboost * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">CatBoost:</span>
                  <span className="text-sm font-medium">{(result.modelPredictions!.catboost * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}