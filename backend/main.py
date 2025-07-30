from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tensorflow as tf
import numpy as np
from PIL import Image
import logging
import traceback
from datetime import datetime
import json
import io

# Configure logging with more detail
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["*"])

# Configuration
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Create necessary directories
os.makedirs('models', exist_ok=True)
os.makedirs('logs', exist_ok=True)

# Global model variable
model = None
model_info = {
    'loaded': False,
    'model_path': None,
    'load_time': None,
    'error': None
}

def build_simple_model(img_size=(224, 224), num_classes=1):
    """Build a simple model for testing"""
    try:
        logger.info("Building simple test model...")
        
        model = tf.keras.Sequential([
            tf.keras.layers.Input(shape=(*img_size, 3)),
            tf.keras.layers.Conv2D(32, 3, activation='relu'),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, 3, activation='relu'),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(128, 3, activation='relu'),
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.5),
            tf.keras.layers.Dense(num_classes, activation='sigmoid')
        ])
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        logger.info(f"Simple model built successfully with {model.count_params():,} parameters")
        return model

    except Exception as e:
        logger.error(f"Error building simple model: {str(e)}")
        logger.error(traceback.format_exc())
        raise e

def build_pretrained_model(img_size=(224, 224), num_classes=1):
    """Build a model using pre-trained weights"""
    try:
        logger.info("Building model with pre-trained base...")
        
        # Use a pre-trained base model
        base_model = tf.keras.applications.MobileNetV2(
            input_shape=(*img_size, 3),
            include_top=False,
            weights='imagenet'
        )
        
        # Freeze base model layers
        base_model.trainable = False
        
        model = tf.keras.Sequential([
            base_model,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(num_classes, activation='sigmoid')
        ])
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        logger.info(f"Pre-trained model built successfully with {model.count_params():,} parameters")
        return model

    except Exception as e:
        logger.error(f"Error building pre-trained model: {str(e)}")
        logger.error(traceback.format_exc())
        return None

def load_model():
    """Load or create a model"""
    global model, model_info
    
    try:
        logger.info("Attempting to load/create model...")
        
        # Try to load a pre-trained model first
        model_paths = [
            'models/deepfake_detector.h5',
            'models/deepfake_detector.keras',
            'models/trained_model.h5',
            'models/trained_model.keras'
        ]
        
        model_loaded = False
        for model_path in model_paths:
            if os.path.exists(model_path):
                try:
                    logger.info(f"🔄 Attempting to load pre-trained model: {model_path}")
                    model = tf.keras.models.load_model(model_path)
                    model_info.update({
                        'loaded': True,
                        'model_path': model_path,
                        'load_time': datetime.now().isoformat(),
                        'error': None,
                        'source': 'pre_trained_loaded'
                    })
                    logger.info(f"✅ Pre-trained model loaded successfully from: {model_path}")
                    model_loaded = True
                    break
                except Exception as e:
                    logger.warning(f"⚠️ Failed to load model from {model_path}: {str(e)}")
                    continue
        
        # If no pre-trained model found, try building with pre-trained base
        if not model_loaded:
            logger.info("🏗️ No saved model found. Trying pre-trained base model...")
            try:
                model = build_pretrained_model()
                if model is not None:
                    model_info.update({
                        'loaded': True,
                        'model_path': 'pretrained_base_model',
                        'load_time': datetime.now().isoformat(),
                        'error': None,
                        'source': 'pretrained_base'
                    })
                    logger.info("✅ Pre-trained base model created successfully!")
                    model_loaded = True
            except Exception as e:
                logger.warning(f"⚠️ Failed to create pre-trained base model: {str(e)}")
        
        # Last resort: create and train a simple model
        if not model_loaded:
            logger.info("🏗️ Creating and training a simple model...")
            model = build_simple_model()
            
            # Create some dummy training data for demonstration
            logger.info("📚 Creating dummy training data...")
            X_dummy = np.random.random((100, 224, 224, 3))  # 100 random images
            y_dummy = np.random.randint(0, 2, 100)  # Random labels (0=real, 1=fake)
            
            logger.info("🏋️ Training model with dummy data...")
            model.fit(X_dummy, y_dummy, epochs=5, batch_size=16, verbose=1, validation_split=0.2)
            
            # Save the trained model
            model_save_path = 'models/trained_dummy_model.h5'
            model.save(model_save_path)
            logger.info(f"💾 Model saved to: {model_save_path}")
            
            model_info.update({
                'loaded': True,
                'model_path': model_save_path,
                'load_time': datetime.now().isoformat(),
                'error': None,
                'source': 'trained_with_dummy_data'
            })
        
        logger.info("✅ Model loaded successfully!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to load/create model: {e}")
        logger.error(traceback.format_exc())
        model_info.update({
            'loaded': False,
            'error': str(e),
            'load_time': datetime.now().isoformat()
        })
        return False

def preprocess_image_from_memory(image_data, img_size=(224, 224)):
    """Preprocess image directly from memory"""
    try:
        logger.info("📸 Preprocessing image from memory")
        
        # Create BytesIO object from image data
        image_stream = io.BytesIO(image_data)
        
        # Read image directly from BytesIO stream
        img = Image.open(image_stream)
        logger.info(f"📸 Original image size: {img.size}, mode: {img.mode}")
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
            logger.info("📸 Converted image to RGB")
        
        # Resize image
        img = img.resize(img_size, Image.Resampling.LANCZOS)
        logger.info(f"📸 Resized image to: {img.size}")
        
        # Convert to array
        img_array = np.array(img, dtype=np.float32)
        logger.info(f"📸 Image array shape: {img_array.shape}")
        logger.info(f"📸 Image array min/max: {img_array.min():.2f}/{img_array.max():.2f}")
        
        # Normalize to [0, 1]
        img_array = img_array / 255.0
        logger.info(f"📸 After normalization min/max: {img_array.min():.2f}/{img_array.max():.2f}")
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        logger.info(f"📸 Final processed shape: {img_array.shape}")
        
        return img_array
        
    except Exception as e:
        logger.error(f"❌ Error preprocessing image: {str(e)}")
        logger.error(traceback.format_exc())
        raise e

def predict_image_from_memory(model, image_data, threshold=0.5):
    """Make prediction on image directly from memory"""
    try:
        logger.info("🔮 Making prediction from memory")
        
        # Preprocess image
        logger.info("🔮 Starting preprocessing...")
        processed_img = preprocess_image_from_memory(image_data)
        logger.info("✅ Image preprocessing completed")
        
        # Make prediction
        start_time = datetime.now()
        logger.info("🔮 Starting model prediction...")
        
        # Add some debugging info about the model
        logger.info(f"🔮 Model input shape: {model.input_shape}")
        logger.info(f"🔮 Processed image shape: {processed_img.shape}")
        
        prediction = model.predict(processed_img, verbose=1)
        logger.info(f"🔮 Raw model output shape: {prediction.shape}")
        logger.info(f"🔮 Raw model output: {prediction}")
        
        # Extract the actual prediction value
        pred_value = float(prediction[0][0])
        inference_time = (datetime.now() - start_time).total_seconds()
        
        logger.info(f"🔮 Extracted prediction value: {pred_value}")
        logger.info(f"🔮 Inference time: {inference_time:.3f} seconds")
        
        # Interpret results
        is_real = pred_value < threshold
        confidence = (1 - pred_value) if is_real else pred_value
        
        result = {
            'prediction': 'Real' if is_real else 'Fake',
            'confidence': float(confidence),
            'raw_score': float(pred_value),
            'is_real': bool(is_real),
            'threshold': threshold,
            'inference_time_seconds': inference_time,
            'timestamp': datetime.now().isoformat()
        }
        
        logger.info(f"✅ Final prediction result: {result}")
        return result
        
    except Exception as e:
        logger.error(f"❌ Error making prediction: {str(e)}")
        logger.error(traceback.format_exc())
        raise e

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_info_from_memory(image_data, filename):
    """Get file information from memory"""
    try:
        # Create BytesIO object from image data
        image_stream = io.BytesIO(image_data)
        
        # Get file size
        size_bytes = len(image_data)
        
        # Open image to get dimensions and format
        with Image.open(image_stream) as img:
            file_info = {
                'size_bytes': size_bytes,
                'dimensions': img.size,
                'format': img.format,
                'mode': img.mode,
                'filename': filename
            }
        
        return file_info
        
    except Exception as e:
        logger.error(f"❌ Error getting file info: {str(e)}")
        return {'error': str(e)}

# API Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        logger.info("🏥 Health check requested")
        response = {
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'model_info': model_info,
            'tensorflow_version': tf.__version__,
            'available_gpus': len(tf.config.list_physical_devices('GPU')),
            'model_ready': model is not None and model_info['loaded']
        }
        logger.info(f"🏥 Health check response: {response}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"❌ Health check error: {str(e)}")
        return jsonify({
            'status': 'error',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict if uploaded image is real or fake"""
    
    try:
        logger.info("=" * 60)
        logger.info("🚀 PREDICTION REQUEST RECEIVED")
        logger.info("=" * 60)
        logger.info(f"Request method: {request.method}")
        logger.info(f"Content type: {request.content_type}")
        logger.info(f"Files in request: {list(request.files.keys())}")
        logger.info(f"Form data keys: {list(request.form.keys())}")
        
        # Check if file is present
        if 'file' not in request.files:
            logger.error("❌ No file in request")
            return jsonify({'success': False, 'error': 'No file uploaded', 'code': 'NO_FILE'}), 400
        
        file = request.files['file']
        logger.info(f"📁 File received: {file.filename}")
        logger.info(f"📁 File content type: {file.content_type}")
        
        # Check if file is selected
        if file.filename == '' or file.filename is None:
            logger.error("❌ Empty filename")
            return jsonify({'success': False, 'error': 'No file selected', 'code': 'EMPTY_FILE'}), 400
        
        # Read file data into memory once
        logger.info("📁 Reading file data into memory...")
        try:
            image_data = file.read()
            if not image_data:
                logger.error("❌ Empty file data")
                return jsonify({'success': False, 'error': 'Empty file uploaded', 'code': 'EMPTY_FILE_DATA'}), 400
            logger.info(f"📁 File data read successfully: {len(image_data)} bytes")
        except Exception as e:
            logger.error(f"❌ Error reading file data: {str(e)}")
            return jsonify({'success': False, 'error': 'Failed to read file data', 'code': 'FILE_READ_ERROR'}), 400
        
        # Check file type
        if not allowed_file(file.filename):
            logger.error(f"❌ Invalid file type: {file.filename}")
            return jsonify({
                'success': False,
                'error': f'Invalid file type. Allowed: {", ".join(ALLOWED_EXTENSIONS).upper()}',
                'code': 'INVALID_TYPE'
            }), 400
        
        # Check if model is loaded
        if model is None or not model_info['loaded']:
            logger.error("❌ Model not loaded")
            return jsonify({
                'success': False,
                'error': 'Model not loaded properly',
                'code': 'MODEL_NOT_LOADED',
                'model_info': model_info
            }), 500
        
        # Get file information from memory
        logger.info("📋 Getting file information from memory...")
        file_info = get_file_info_from_memory(image_data, file.filename)
        logger.info(f"📋 File info: {file_info}")
        
        # Get prediction threshold
        threshold = float(request.form.get('threshold', 0.5))
        logger.info(f"🎯 Using threshold: {threshold}")
        
        # Make prediction directly from memory
        logger.info("🔮 Starting prediction process from memory...")
        
        result = predict_image_from_memory(model, image_data, threshold)
        logger.info("✅ Prediction completed successfully")
        
        # Add file information to result
        result['file_info'] = file_info
        result['original_filename'] = file.filename
        
        # Prepare response
        response = {
            'success': True,
            'result': result,
            'message': f'Image predicted as {result["prediction"]} with {result["confidence"]:.1%} confidence',
            'model_source': model_info.get('source', 'unknown'),
            'debug_info': {
                'processed_from_memory': True,
                'file_size': file_info.get('size_bytes', 0),
                'processing_time': result['inference_time_seconds']
            }
        }
        
        logger.info("=" * 60)
        logger.info("📤 SENDING RESPONSE")
        logger.info("=" * 60)
        logger.info(f"Response success: {response['success']}")
        logger.info(f"Response result: {response['result']}")
        logger.info("=" * 60)
        
        return jsonify(response)
        
    except Exception as e:
        logger.error("=" * 60)
        logger.error("❌ PREDICTION ERROR")
        logger.error("=" * 60)
        logger.error(f"Error: {str(e)}")
        logger.error(traceback.format_exc())
        logger.error("=" * 60)
        
        return jsonify({
            'success': False,
            'error': f'Prediction failed: {str(e)}',
            'code': 'PREDICTION_ERROR'
        }), 500

# Error handlers
@app.errorhandler(413)
def too_large(e):
    logger.error("❌ File too large error")
    return jsonify({
        'success': False,
        'error': 'File too large. Maximum size is 16MB.',
        'code': 'FILE_TOO_LARGE'
    }), 413

@app.errorhandler(404)
def not_found(e):
    logger.error(f"❌ 404 error: {request.path}")
    return jsonify({
        'success': False,
        'error': 'Endpoint not found',
        'code': 'NOT_FOUND'
    }), 404

@app.errorhandler(500)
def internal_error(e):
    logger.error(f"❌ 500 error: {str(e)}")
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'code': 'INTERNAL_ERROR'
    }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Starting Real/Fake Image Detection API...")
    print("=" * 60)
    
    try:
        success = load_model()
        if success:
            print("✅ Model loading completed successfully!")
        else:
            print("❌ Model loading failed!")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        print("⚠️  Server will start but predictions may not work correctly.")
    
    print("🌐 Starting Flask server...")
    print("📋 API Endpoints:")
    print("  - POST /api/predict - Upload image for prediction")
    print("  - GET  /api/health  - Health check")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)