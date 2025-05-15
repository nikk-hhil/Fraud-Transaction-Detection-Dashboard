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
    <div className="card">
      <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Analyze Transaction
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Fill out the details below to check if a transaction is potentially fraudulent.
        </p>
      </div>
      
      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="amt" className="form-label">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="amt"
                  id="amt"
                  step="0.01"
                  value={formData.amt}
                  onChange={handleChange}
                  className="form-input pl-7"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="merchant" className="form-label">
                Merchant
              </label>
              <input
                type="text"
                name="merchant"
                id="merchant"
                value={formData.merchant}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
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
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
              >
                <option value="F">Female</option>
                <option value="M">Male</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="job" className="form-label">
                Job
              </label>
              <input
                type="text"
                name="job"
                id="job"
                value={formData.job}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="city_pop" className="form-label">
                City Population
              </label>
              <input
                type="number"
                name="city_pop"
                id="city_pop"
                value={formData.city_pop}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label htmlFor="lat" className="form-label">
                Customer Latitude
              </label>
              <input
                type="number"
                name="lat"
                id="lat"
                step="0.0001"
                value={formData.lat}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="long" className="form-label">
                Customer Longitude
              </label>
              <input
                type="number"
                name="long"
                id="long"
                step="0.0001"
                value={formData.long}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="merch_lat" className="form-label">
                Merchant Latitude
              </label>
              <input
                type="number"
                name="merch_lat"
                id="merch_lat"
                step="0.0001"
                value={formData.merch_lat}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="merch_long" className="form-label">
                Merchant Longitude
              </label>
              <input
                type="number"
                name="merch_long"
                id="merch_long"
                step="0.0001"
                value={formData.merch_long}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full sm:w-auto flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Analyze Transaction
                </>
              )}
            </button>
          </div>
        </form>
        
        {result && (
          <div className={`mt-6 p-5 rounded-lg ${
            result.isFraud 
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          }`}>
            <h4 className={`text-lg font-medium flex items-center ${
              result.isFraud ? 'text-red-800 dark:text-red-400' : 'text-green-800 dark:text-green-400'
            }`}>
              {result.isFraud ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Fraud Detected!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Transaction Legitimate
                </>
              )}
            </h4>
            
            <div className="mt-4 space-y-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fraud Probability:</span>
                  <div 
                    className={`text-sm font-semibold px-2 py-1 rounded-md ${
                      result.fraudProbability! > 0.7 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      result.fraudProbability! > 0.3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    {(result.fraudProbability! * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      result.fraudProbability! > 0.7 ? 'bg-red-500' :
                      result.fraudProbability! > 0.3 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${result.fraudProbability! * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Risk Level:</span>
                <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                  result.riskLevel === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                  result.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {result.riskLevel}
                </span>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model Predictions:</div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">XGBoost</div>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {(result.modelPredictions!.xgboost * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CatBoost</div>
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {(result.modelPredictions!.catboost * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}