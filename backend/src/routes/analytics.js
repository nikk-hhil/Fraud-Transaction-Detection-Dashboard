const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const fraudulentTransactions = await Transaction.countDocuments({ isFraud: true });
    const totalAmount = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$amt" } } }
    ]);
    
    res.json({
      totalTransactions,
      fraudulentTransactions,
      fraudRate: totalTransactions > 0 ? (fraudulentTransactions / totalTransactions) * 100 : 0,
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get fraud trends
router.get('/fraud-trend', async (req, res) => {
  try {
    const trends = await Transaction.aggregate([
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$timestamp" 
            } 
          },
          totalTransactions: { $sum: 1 },
          fraudulentTransactions: { 
            $sum: { $cond: ["$isFraud", 1, 0] } 
          }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
    
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fraud trends' });
  }
});

module.exports = router;