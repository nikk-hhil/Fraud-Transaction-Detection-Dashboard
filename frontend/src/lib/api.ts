import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

export interface Transaction {
  _id?: string;
  transactionId: string;
  amt: number;
  lat: number;
  long: number;
  city_pop: number;
  merch_lat: number;
  merch_long: number;
  merchant: string;
  category: string;
  gender: string;
  job: string;
  fraudProbability?: number;
  isFraud?: boolean;
  riskLevel?: string;
  timestamp?: Date;
  modelPredictions?: {
    xgboost: number;
    catboost: number;
  };
}

export interface DashboardStats {
  totalTransactions: number;
  fraudulentTransactions: number;
  fraudRate: number;
  totalAmount: number;
}

export const transactionService = {
  async analyzeTransaction(transaction: Omit<Transaction, '_id' | 'transactionId' | 'fraudProbability' | 'isFraud' | 'riskLevel' | 'timestamp' | 'modelPredictions'>) {
    const response = await api.post<Transaction>('/transactions/analyze', transaction);
    return response.data;
  },

  async getTransactions() {
    const response = await api.get<Transaction[]>('/transactions');
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get<DashboardStats>('/analytics/dashboard');
    return response.data;
  },

  async getFraudTrends() {
    const response = await api.get('/analytics/fraud-trend');
    return response.data;
  }
};