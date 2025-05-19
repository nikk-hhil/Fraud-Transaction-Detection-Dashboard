import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from catboost import CatBoostClassifier
import joblib
import os
import logging
from pathlib import Path
import sys
import gc  # For garbage collection
import psutil  # For memory monitoring

# Configure logging to show output
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

def log_memory_usage():
    """Log current memory usage."""
    process = psutil.Process(os.getpid())
    memory_info = process.memory_info()
    logger.info(f"Memory usage: {memory_info.rss / 1024 / 1024:.2f} MB")

# Get the project root directory
PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_DIR = PROJECT_ROOT / 'data'
MODELS_DIR = PROJECT_ROOT / 'ml-service' / 'models'

# Define data types for memory optimization
dtypes = {
    'amt': 'float32',
    'lat': 'float32',
    'long': 'float32',
    'city_pop': 'int32',
    'merch_lat': 'float32',
    'merch_long': 'float32',
    'is_fraud': 'int8'
}

def process_data(file_path, is_training=True):
    """Process a single data file (train or test)."""
    try:
        logger.info(f"Processing {'training' if is_training else 'test'} data from {file_path}")
        log_memory_usage()
        
        # Define columns to keep
        columns_to_keep = [
            'amt', 'lat', 'long', 'city_pop', 'merch_lat', 'merch_long',
            'merchant', 'category', 'gender', 'job', 'is_fraud'
        ]
        
        if is_training:
            # Process training data in chunks
            chunk_size = 25000
            logger.info(f"Reading training data in chunks of {chunk_size} rows...")
            
            chunks = pd.read_csv(
                file_path,
                chunksize=chunk_size,
                usecols=columns_to_keep,
                dtype=dtypes
            )
            
            # Process first chunk
            logger.info("Processing first chunk...")
            first_chunk = next(chunks)
            categorical_columns = ['merchant', 'category', 'gender', 'job']
            
            # Initialize lists to store processed chunks
            X_chunks = []
            y_chunks = []
            
            # Process first chunk
            y_chunk = first_chunk['is_fraud']
            X_chunk = first_chunk.drop('is_fraud', axis=1)
            X_chunk = pd.get_dummies(X_chunk, columns=categorical_columns)
            
            X_chunks.append(X_chunk)
            y_chunks.append(y_chunk)
            
            # Process remaining chunks
            chunk_count = 1
            for chunk in chunks:
                chunk_count += 1
                logger.info(f"Processing chunk {chunk_count}...")
                log_memory_usage()
                
                y_chunk = chunk['is_fraud']
                X_chunk = chunk.drop('is_fraud', axis=1)
                X_chunk = pd.get_dummies(X_chunk, columns=categorical_columns)
                
                # Ensure all columns are present
                for col in X_chunks[0].columns:
                    if col not in X_chunk.columns:
                        X_chunk[col] = 0
                X_chunk = X_chunk[X_chunks[0].columns]
                
                X_chunks.append(X_chunk)
                y_chunks.append(y_chunk)
                
                # Clear memory
                del X_chunk, y_chunk
                gc.collect()
            
            # Combine chunks
            logger.info("Combining all chunks...")
            X = pd.concat(X_chunks, axis=0)
            y = pd.concat(y_chunks, axis=0)
            
            # Clear memory
            del X_chunks, y_chunks
            gc.collect()
            
        else:
            # Process test data all at once
            logger.info("Reading test data...")
            data = pd.read_csv(
                file_path,
                usecols=columns_to_keep,
                dtype=dtypes
            )
            
            y = data['is_fraud']
            X = data.drop('is_fraud', axis=1)
            
            # Get dummies for categorical columns
            categorical_columns = ['merchant', 'category', 'gender', 'job']
            X = pd.get_dummies(X, columns=categorical_columns)
        
        logger.info(f"Features shape: {X.shape}, Target shape: {y.shape}")
        log_memory_usage()
        
        return X, y
        
    except Exception as e:
        logger.error(f"Error in process_data: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise

def main():
    try:
        logger.info("Starting model training process...")
        log_memory_usage()
        
        # Create models directory if it doesn't exist
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        
        # Process training data
        train_file = DATA_DIR / 'fraudTrain.csv'
        X_train, y_train = process_data(train_file, is_training=True)
        
        # Process test data
        test_file = DATA_DIR / 'fraudTest.csv'
        X_test, y_test = process_data(test_file, is_training=False)
        
        # Ensure test data has same columns as training data
        for col in X_train.columns:
            if col not in X_test.columns:
                X_test[col] = 0
        X_test = X_test[X_train.columns]
        
        # Scale features
        logger.info("Scaling features...")
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Save scaler and feature names
        scaler_path = MODELS_DIR / 'scaler.joblib'
        joblib.dump(scaler, scaler_path)
        features_path = MODELS_DIR / 'feature_names.joblib'
        joblib.dump(X_train.columns, features_path)
        
        # Clear memory
        del X_train, X_test
        gc.collect()
        
        # Train XGBoost
        logger.info("Training XGBoost model...")
        xgb_model = XGBClassifier(
            n_estimators=50,
            learning_rate=0.1,
            max_depth=4,
            min_child_weight=3,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            scale_pos_weight=100,
            tree_method='hist',
            n_jobs=-1,
            early_stopping_rounds=5
        )
        
        xgb_model.fit(
            X_train_scaled, y_train,
            eval_set=[(X_test_scaled, y_test)],
            verbose=True
        )
        
        # Train CatBoost
        logger.info("Training CatBoost model...")
        cat_model = CatBoostClassifier(
            iterations=50,
            learning_rate=0.1,
            depth=4,
            random_seed=42,
            verbose=100,
            class_weights=[1, 100],
            task_type='GPU',
            devices='0',
            early_stopping_rounds=5,
            thread_count=-1
        )
        
        cat_model.fit(
            X_train_scaled, y_train,
            eval_set=(X_test_scaled, y_test),
            use_best_model=True
        )
        
        # Save models
        xgb_model.save_model(str(MODELS_DIR / 'xgboost_model.json'))
        cat_model.save_model(str(MODELS_DIR / 'catboost_model.cbm'))

        
        # Evaluate models
        xgb_score = xgb_model.score(X_test_scaled, y_test)
        cat_score = cat_model.score(X_test_scaled, y_test)
        
        logger.info(f"XGBoost test accuracy: {xgb_score:.4f}")
        logger.info(f"CatBoost test accuracy: {cat_score:.4f}")
        
        logger.info("Model training completed successfully!")
        log_memory_usage()
        
    except Exception as e:
        logger.error(f"Error in main: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logger.error(f"Fatal error: {str(e)}")
        sys.exit(1) 