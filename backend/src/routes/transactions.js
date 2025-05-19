const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// You'll need to create this model
const Transaction = require('../models/Transaction');

// Analyze transaction
router.post('/analyze', async (req, res) => {
  try {
    // Call ML service
    const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, req.body);

    
    // Create transaction record
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
    
    // Emit to WebSocket if fraud detected
    if (mlResponse.data.is_fraud) {
      try {
        if (req.app.get('io')) {
          req.app.get('io').emit('fraud-alert', transaction);
        } else {
          console.log('WebSocket not available, skipping notification');
        }
      } catch (error) {
        console.log('Error sending WebSocket notification:', error);
      }
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Error analyzing transaction:', error);
    res.status(500).json({ error: 'Failed to analyze transaction' });
  }
});

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

module.exports = router;