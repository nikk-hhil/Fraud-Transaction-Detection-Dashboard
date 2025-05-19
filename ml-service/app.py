from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from xgboost import XGBClassifier
from catboost import CatBoostClassifier
import numpy as np
import pandas as pd
import joblib
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Fraud Detection ML Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and preprocessors
try:
    xgboost_model = XGBClassifier()
    xgboost_model.load_model('models/xgboost_model.json')

    catboost_model = CatBoostClassifier()
    catboost_model.load_model('models/catboost_model.cbm')
    scaler = joblib.load('models/scaler.joblib')
    feature_names = joblib.load('models/feature_names.joblib')
    logger.info("Models loaded successfully")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    raise

class Transaction(BaseModel):
    amt: float
    lat: float
    long: float
    city_pop: int
    merch_lat: float
    merch_long: float
    merchant: str
    category: str
    gender: str = 'M'  # Default values if not provided
    job: str = 'Other'
    
    class Config:
        schema_extra = {
            "example": {
                "amt": 75.50,
                "lat": 40.7128,
                "long": -74.0060,
                "city_pop": 8500000,
                "merch_lat": 40.7589,
                "merch_long": -73.9851,
                "merchant": "Amazon",
                "category": "online_retail",
                "gender": "F",
                "job": "Software Engineer"
            }
        }

class PredictionResponse(BaseModel):
    prediction: float
    xgboost_prediction: float
    catboost_prediction: float
    is_fraud: bool
    risk_level: str

@app.get("/")
async def root():
    return {"message": "Fraud Detection ML Service is running"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(transaction: Transaction):
    try:
        # Create DataFrame from input
        input_data = pd.DataFrame([transaction.dict()])
        
        # Create dummy columns for categorical variables
        categorical_columns = ['merchant', 'category', 'gender', 'job']
        input_encoded = pd.get_dummies(input_data, columns=categorical_columns)
        
        # Add missing columns with zeros
        for col in feature_names:
            if col not in input_encoded.columns:
                input_encoded[col] = 0
        
        # Ensure columns are in the same order as training
        input_encoded = input_encoded[feature_names]
        
        # Scale the features
        input_scaled = scaler.transform(input_encoded)
        
        # Get predictions from both models
        xgb_pred = xgboost_model.predict_proba(input_scaled)[0]
        cat_pred = catboost_model.predict_proba(input_scaled)[0]
        
        # Ensemble prediction (average)
        final_pred = (xgb_pred + cat_pred) / 2
        fraud_probability = float(final_pred[1])
        
        # Determine risk level
        if fraud_probability < 0.3:
            risk_level = "Low"
        elif fraud_probability < 0.7:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return PredictionResponse(
            prediction=fraud_probability,
            xgboost_prediction=float(xgb_pred[1]),
            catboost_prediction=float(cat_pred[1]),
            is_fraud=fraud_probability > 0.5,
            risk_level=risk_level
        )
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-info")
async def model_info():
    return {
        "models": {
            "xgboost": {
                "type": "XGBoost",
                "accuracy": "98.83%"
            },
            "catboost": {
                "type": "CatBoost",
                "accuracy": "96.63%"
            }
        },
        "ensemble_method": "Average of probabilities",
        "features_expected": len(feature_names),
        "last_updated": "2025-05-04"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)