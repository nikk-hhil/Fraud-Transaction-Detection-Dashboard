# Fraud Transaction Detection Dashboard

A modern web application for real-time fraud transaction detection and monitoring.

## Tech Stack

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- Chart.js/Recharts
- TypeScript

### Backend
- Node.js
- Express.js
- RESTful APIs

### Databases
- MongoDB (for transaction data)
- PostgreSQL (for user data and system config)

### ML Integration
- TensorFlow.js
- Python ML models (XGBoost, CatBoost)
- Model serving via API

### DevOps
- Docker
- Vercel (deployment)

## Features

- Real-time transaction monitoring
- Fraud detection alerts
- Interactive dashboards
- Transaction analytics
- User authentication
- Role-based access control
- ML model performance monitoring
- Real-time data visualization

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- PostgreSQL
- Python 3.9+ (for ML models)

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd Fraud-Transaction-Detection-Dashboard
```

2. Install dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install ML service dependencies
cd ../ml-service
pip install -r requirements.txt
```

3. Set up environment variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Backend (.env)
MONGODB_URI=your_mongodb_uri
POSTGRES_URI=your_postgres_uri
JWT_SECRET=your_jwt_secret
```

4. Start the development servers
```bash
# Start frontend
npm run dev

# Start backend (in a new terminal)
cd backend
npm run dev

# Start ML service (in a new terminal)
cd ml-service
python app.py
```

## Project Structure

```
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   └── public/             # Static files
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic
│   └── tests/             # Backend tests
├── ml-service/             # ML model service
│   ├── models/            # Trained ML models
│   ├── training/          # Model training scripts
│   └── api/              # Model serving API
└── docker/                # Docker configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 
