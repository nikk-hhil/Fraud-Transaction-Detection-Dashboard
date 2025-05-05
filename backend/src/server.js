const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fraud_detection')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  transactionId: String,
  amt: Number,
  lat: Number,
  long: Number,
  city_pop: Number,
  merch_lat: Number,
  merch_long: Number,
  merchant: String,
  category: String,
  gender: String,
  job: String,
  fraudProbability: Number,
  isFraud: Boolean,
  riskLevel: String,
  timestamp: { type: Date, default: Date.now },
  modelPredictions: {
    xgboost: Number,
    catboost: Number
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Analyze transaction
app.post('/api/transactions/analyze', async (req, res) => {
  try {
    // Call ML service
    const mlResponse = await axios.post('http://localhost:8000/predict', req.body);
    
    // Save to database
    const transaction = new Transaction({
      ...req.body,
      transactionId: `TX${Date.now()}`,
      fraudProbability: mlResponse.data.prediction,
      isFraud: mlResponse.data.is_fraud,
      riskLevel: mlResponse.data.risk_level,
      modelPredictions: {
        xgboost: mlResponse.data.xgboost_prediction,
        catboost: mlResponse.data.catboost_prediction
      }
    });
    
    await transaction.save();
    
    // Emit to connected clients if fraud detected
    if (mlResponse.data.is_fraud) {
      io.emit('fraud-alert', transaction);
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Error analyzing transaction:', error);
    res.status(500).json({ error: 'Failed to analyze transaction' });
  }
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ timestamp: -1 }).limit(100);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get dashboard statistics
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const fraudulentTransactions = await Transaction.countDocuments({ isFraud: true });
    const totalAmount = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$amt" } } }
    ]);
    
    res.json({
      totalTransactions,
      fraudulentTransactions,
      fraudRate: (fraudulentTransactions / totalTransactions) * 100,
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});