import os
import gdown
import numpy as np
import tensorflow as tf
from tensorflow import keras
from PIL import Image
from io import BytesIO
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Initialize FastAPI app
app = FastAPI()

# Allow all origins for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model path and URL
LEAF_MODEL_PATH = "../saved_models/leaf_model.keras"
LEAF_MODEL_URL = "https://drive.google.com/uc?id=1_pOBUEVW4oaMeKRrMhfvNtXAkXPRmYPy"

# Download model function
def download_model(model_url, model_path):
    if not os.path.exists(model_path) or os.path.getsize(model_path) < 1000:
        print(f"Downloading {model_path}...")
        gdown.download(model_url, model_path, quiet=False)

        if os.path.exists(model_path) and os.path.getsize(model_path) > 1000:
            print(f"Model downloaded successfully: {model_path}")
        else:
            print(f"Download failed: {model_path}")
            exit(1)

# Download and load the model globally
download_model(LEAF_MODEL_URL, LEAF_MODEL_PATH)
try:
    leaf_model = tf.keras.models.load_model(LEAF_MODEL_PATH)
    print("Leaf model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    exit(1)

# Image preprocessing function
def preprocess_image(image: Image.Image, target_size=(96, 96)) -> np.ndarray:
    """Resizes and preprocesses image for MobileNetV2"""
    image = image.resize(target_size, Image.BICUBIC).convert("RGB")
    image_array = np.array(image, dtype=np.float32)
    return np.expand_dims(image_array, axis=0)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Predict whether the uploaded image is a leaf or not."""
    try:
        # Read and preprocess the image
        image = Image.open(BytesIO(await file.read())).convert("RGB")
        preprocessed_image = preprocess_image(image)
        print(f"Preprocessed image shape: {preprocessed_image.shape}")

        # Make prediction
        prediction = leaf_model.predict(preprocessed_image)
        print(f"Raw prediction: {prediction}")

        # Interpret prediction
        leaf_prediction = prediction[0][0]
        result = "Leaf" if leaf_prediction < 0.5 else "Not Leaf"
        print(f"Final prediction: {result}")

        return {"prediction": result, "confidence": float(leaf_prediction)}

    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed. Please try again.")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)