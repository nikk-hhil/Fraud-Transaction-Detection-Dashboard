const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  amt: { type: Number, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  city_pop: { type: Number, required: true },
  merch_lat: { type: Number, required: true },
  merch_long: { type: Number, required: true },
  merchant: { type: String, required: true },
  category: { type: String, required: true },
  gender: { type: String, required: true },
  job: { type: String, required: true },
  fraudProbability: { type: Number, required: true },
  isFraud: { type: Boolean, required: true },
  riskLevel: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  modelPredictions: {
    xgboost: { type: Number, required: true },
    catboost: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);