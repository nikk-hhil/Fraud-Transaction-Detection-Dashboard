# Fraud Transaction Detection Dashboard

## Project Overview

This project is a comprehensive fraud detection system that integrates machine learning with a modern web stack to identify suspicious transactions in real-time. The system uses an ensemble approach combining multiple ML models for greater accuracy and explainability.

## Architecture

The system consists of three main components:

1. **ML Service**: Python/FastAPI backend serving XGBoost and CatBoost models
2. **Backend API**: Node.js/Express API with MongoDB for transaction storage
3. **Frontend**: Next.js dashboard with real-time visualization

## Features

- Real-time transaction analysis with fraud probability scores
- Risk level classification (Low/Medium/High)
- Individual model predictions with ensemble approach
- Transaction history and statistics
- Interactive dashboards for monitoring fraud trends

## Technologies Used

### ML Service
- Python 3.9
- FastAPI
- XGBoost & CatBoost (achieving 98.8% and 96.6% accuracy)
- NumPy & Pandas for data processing
- Joblib for model serialization

### Backend
- Node.js with Express
- MongoDB for data storage
- WebSockets for real-time updates
- JWT for authentication
- Winston for logging

### Frontend
- Next.js 13/14
- React with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API communication

### DevOps
- Docker & Docker Compose for containerization
- Multi-stage deployment pipeline

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- Python 3.9+
- MongoDB (if running locally)

### Installation

1. Clone the repository
```bash
git clone https://github.com/nikk-hhil/Fraud-Transaction-Detection-Dashboard
cd fraud-detection-dashboard
```

2. Start with Docker Compose
```bash
docker compose up
```

This will start all three services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- ML Service: http://localhost:8000

### Manual Setup (without Docker)

If you prefer to run the services individually:

**ML Service**
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Navigate to http://localhost:3000
2. Use the dashboard to view current fraud statistics
3. Go to the Transactions page to analyze new transactions
4. Submit transaction details to get real-time fraud analysis

## Examples

### Legitimate Transaction
```json
{
  "amt": 78.35,
  "lat": 40.7128,
  "long": -74.0060,
  "city_pop": 8500000,
  "merch_lat": 40.7589,
  "merch_long": -73.9851,
  "merchant": "Whole Foods",
  "category": "grocery_pos",
  "gender": "F",
  "job": "Teacher"
}
```

### Suspicious Transaction
```json
{
  "amt": 4299.50,
  "lat": 40.7128,
  "long": -74.0060,
  "city_pop": 8500000,
  "merch_lat": -33.8688,
  "merch_long": 151.2093,
  "merchant": "Amazon",
  "category": "online_retail",
  "gender": "M",
  "job": "Unemployed"
}
```

## Future Enhancements

- Interactive visualizations for feature importance
- Geographic fraud mapping
- User behavior analytics
- Feedback loops for model improvement
- Smart notification system for suspicious patterns

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Dataset from Kaggle: [Credit Card Fraud Detection](https://www.kaggle.com/datasets/kartik2112/fraud-detection)