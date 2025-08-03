import io
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.layers import Layer, Conv2D, Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Sequential
from fastapi.middleware.cors import CORSMiddleware

# Add this after creating the FastAPI app

# Custom Layers from your notebook
# These definitions are necessary for loading the model if it uses custom layers.

class HybridSECBAM(Layer):
    def __init__(self, se_ratio=16, cbam_ratio=8, **kwargs):
        super().__init__(**kwargs)
        self.se_ratio = se_ratio
        self.cbam_ratio = cbam_ratio

    def get_config(self):
        config = super().get_config()
        config.update({
            'se_ratio': self.se_ratio,
            'cbam_ratio': self.cbam_ratio,
        })
        return config

    def build(self, input_shape):
        channels = input_shape[-1]
        self.se_dense1 = Dense(channels // self.se_ratio, activation='swish')
        self.se_dense2 = Dense(channels, activation='sigmoid')
        self.channel_mlp = Sequential([
            Dense(channels // self.cbam_ratio, activation='swish'),
            Dense(channels)
        ])
        self.spatial_conv = Conv2D(1, kernel_size=7, padding='same', activation='sigmoid')

    def call(self, inputs):
      dtype = inputs.dtype
      se = tf.reduce_mean(inputs, axis=[1, 2])
      se = self.se_dense1(se)
      se = self.se_dense2(se)
      se = tf.reshape(se, [-1, 1, 1, inputs.shape[-1]])
      se = tf.cast(se, dtype)
      avg_pool = tf.reduce_mean(inputs, axis=[1, 2])
      max_pool = tf.reduce_max(inputs, axis=[1, 2])
      channel_att = tf.nn.sigmoid(self.channel_mlp(avg_pool) + self.channel_mlp(max_pool))
      channel_att = tf.reshape(channel_att, [-1, 1, 1, inputs.shape[-1]])
      channel_att = tf.cast(channel_att, dtype)
      avg_pool_spatial = tf.reduce_mean(inputs, axis=-1, keepdims=True)
      max_pool_spatial = tf.reduce_max(inputs, axis=-1, keepdims=True)
      concat = tf.concat([avg_pool_spatial, max_pool_spatial], axis=-1)
      spatial_att = self.spatial_conv(concat)
      spatial_att = tf.cast(spatial_att, dtype)
      out = inputs * se * channel_att * spatial_att
      return out

class EnhancedMHABlock(tf.keras.layers.Layer):
    def __init__(self, num_heads=8, key_dim=64, **kwargs):
        super().__init__(**kwargs)
        self.num_heads = num_heads
        self.key_dim = key_dim

    def build(self, input_shape):
        channels = input_shape[-1]
        if channels is None:
            raise ValueError("Input channels must be defined.")
        self.mha = tf.keras.layers.MultiHeadAttention(
            num_heads=self.num_heads,
            key_dim=self.key_dim,
            kernel_initializer='glorot_uniform',
            bias_initializer='zeros'
        )
        self.ffn = tf.keras.Sequential([
            tf.keras.layers.Conv2D(4 * channels, kernel_size=1, activation='swish'),
            tf.keras.layers.Conv2D(channels, kernel_size=1)
        ])
        self.norm1 = tf.keras.layers.LayerNormalization()
        self.norm2 = tf.keras.layers.LayerNormalization()

    def call(self, inputs):
       dtype = inputs.dtype
       shape = tf.shape(inputs)
       B, H, W, C = shape[0], shape[1], shape[2], shape[3]
       x_flat = tf.reshape(inputs, [B, H * W, C])
       attn = self.mha(x_flat, x_flat)
       attn = tf.reshape(attn, [B, H, W, C])
       attn = tf.cast(attn, dtype)
       x = self.norm1(inputs + attn)
       ffn_out = self.ffn(x)
       return self.norm2(x + ffn_out)

    def get_config(self):
        config = super().get_config()
        config.update({
            "num_heads": self.num_heads,
            "key_dim": self.key_dim,
        })
        return config

# --- FastAPI App Initialization ---
app = FastAPI(title="Image Forgery Detection API")

# --- Load the Trained Model ---
# This now points to your final_model.h5 file.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
try:
    model = load_model(
        'final_model.h5',
        custom_objects={
            'HybridSECBAM': HybridSECBAM,
            'EnhancedMHABlock': EnhancedMHABlock
        }
    )
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# --- Preprocessing Function ---
def preprocess_image(image_bytes: bytes):
    """
    Preprocesses the image for the model.
    - Converts to 3-channel RGB
    - Resizes to (224, 224)
    - Converts to numpy array
    - Adds a batch dimension
    - Applies EfficientNet preprocessing
    """
    img = Image.open(io.BytesIO(image_bytes))
    # **FIX**: Convert image to RGB to handle 4-channel PNGs
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return preprocess_input(img_array)

# --- Prediction Endpoint ---
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an image file and returns the prediction.
    """
    if not model:
        return JSONResponse(status_code=500, content={"message": "Model is not loaded."})

    # Read image bytes
    image_bytes = await file.read()

    # Preprocess the image
    processed_image = preprocess_image(image_bytes)

    # Make a prediction
    prediction = model.predict(processed_image)
    prediction_value = prediction.squeeze()

    # Determine the class
    result = "Authorised" if prediction_value <= 0.5 else "Forged"
    confidence = (1 - prediction_value) if result == "Authorised" else prediction_value

    return JSONResponse(content={
        "prediction": result,
        "confidence": float(confidence)
    })

# --- Root Endpoint ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Image Forgery Detection API. Use the /predict/ endpoint to make predictions."}

# To run this application:
# 1. Save the code as `main.py`.
# 2. Make sure you have your trained model file (`final_model.h5`) in the same directory.
# 3. Install the necessary libraries:
#    pip install fastapi uvicorn python-multipart tensorflow Pillow
# 4. Run the server from your terminal:
#    uvicorn main:app --reload
