import os
import requests
from fastapi import FastAPI, File, UploadFile
from io import BytesIO
import numpy as np
import tensorflow as tf
from PIL import Image
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import gdown

# Initialize FastAPI app
app = FastAPI()

# Allow all origins for CORS (adjust as necessary)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

PLANT_NAMES = ['Apple', 'Bell Pepper', 'Cherry', 'Corn', 'Cucumber', 'Grape', 'Guava', 'Lemon', 'Mango', 'Peach', 'Potato', 'Rice', 'Strawberry', 'Sugarcane', 'Tea', 'Tomato', 'Wheat']
DISEASE_NAMES = {
    'Apple': ['Black Rot', 'Healthy', 'Rust', 'Scab'],
    'Bell Pepper': ['Bacterial Spot', 'Healthy'],
    'Cherry': ['Healthy', 'Powdery Mildew'],
    'Corn': ['Cercospora Leaf Spot', 'Common Rust', 'Healthy', 'Northern Leaf Blight'],
    'Cucumber': ['Downy Mildew', 'Healthy'],
    'Grape': ['Black Measles', 'Black Rot', 'Healthy', 'Isariopsis Leaf Spot'],
    'Guava': ['Diseased', 'Healthy'],
    'Lemon': ['Diseased', 'Healthy'],
    'Mango': ['Anthracnose', 'Healthy'],
    'Peach': ['Bacterial Spot', 'Healthy'],
    'Potato': ['Early Blight', 'Healthy', 'Late Blight'],
    'Rice': ['Brown Spot', 'Healthy', 'Hispa', 'Leaf Blast', 'Neck Blast'],
    'Strawberry': ['Healthy', 'Leaf Scorch'],
    'Sugarcane': ['Bacterial Blight', 'Healthy', 'Red Rot', 'Red Stripe', 'Rust'],
    'Tea': ['Algal Leaf', 'Anthracnose', 'Bird Eye Spot', 'Brown Blight', 'Healthy', 'Red Leaf Spot'],
    'Tomato': ['Bacterial Spot', 'Early Blight', 'Healthy', 'Late Blight', 'Leaf Mold', 'Mosaic Virus', 'Septoria Leaf Spot', 'Spider Mite', 'Target Spot', 'Yellow Leaf Curl Virus'],
    'Wheat': ['Brown Rust', 'Healthy', 'Septoria', 'Yellow Rust'],
}

# Model URLs and Paths
LEAF_MODEL_URL = "https://drive.google.com/uc?id=1_pOBUEVW4oaMeKRrMhfvNtXAkXPRmYPy"
LEAF_MODEL_PATH = "../saved_models/leaf_model.keras"

PLANT_MODEL_URL = "https://drive.google.com/uc?id=1ZpFx7_dX3Td9peM9xDLs6-anKxvkEMrp"
PLANT_MODEL_PATH = "../saved_models/plant_model.keras"

DISEASE_MODELS = {
     'Apple': {
        'URL': "https://drive.google.com/uc?id=1RmerEoE0HE-pxclLdTfn86Tq7fviYP4i",
        'PATH': "../saved_models/diseases/Apple.keras"
    },
    'Bell Pepper': {
        'URL':"https://drive.google.com/uc?id=18vrJe7UGm3aToGEUldGFLnui4Wa8fEMY",
        'PATH': "../saved_models/diseases/Bell Pepper.keras"
    },
    'Cherry': {
        'URL': "https://drive.google.com/uc?id=1uYtnaMnso11SMUWQfOF72-V47TWB0DzA",
        'PATH': "../saved_models/diseases/Cherry.keras"
    },
    'Corn': {
        'URL': "https://drive.google.com/uc?id=1ALe1R1H15HaLLsnVlTQ5XWZlUhU66Uvk",
        'PATH': "../saved_models/diseases/Corn.keras"
    },
    'Cucumber': {
        'URL': "https://drive.google.com/uc?id=1WNf0GDaR4w5GoforiLci0T8QAtmkMsgm",
        'PATH': "../saved_models/diseases/Cucumber.keras"
    },
    'Grape': {
        'URL': "https://drive.google.com/uc?id=1COK6KEdVUTaF7sXt3kQeDDCO-TxSLFpa",
        'PATH': "../saved_models/diseases/Grape.keras"
    },
    'Guava': {
        'URL': "https://drive.google.com/uc?id=1OdRJL8pSVuM1ma7e1-Al12YTHiLqnz7y",
        'PATH': "../saved_models/diseases/Guava.keras"
    },
    'Lemon': {
        'URL': "https://drive.google.com/uc?id=1ETvaMVyJSBYJjT9Rz0ufB11FW2twVSRE",
        'PATH': "../saved_models/diseases/Lemon.keras"
    },
    'Mango': {
        'URL': "https://drive.google.com/uc?id=1nb0ftn-ZZGNfsbvXxKoMsPhVYRhz0Zcg",
        'PATH': "../saved_models/diseases/Mango.keras"
    },
    'Peach': {
        'URL': "https://drive.google.com/uc?id=1f-WHYQLeI2ywgqE0c-xMCyBOhUdjFH3B",
        'PATH': "../saved_models/diseases/Peach.keras"
    },
    'Potato': {
        'URL': "https://drive.google.com/uc?id=1DpooEMYHjlWCV6BZ9B8Rn5hWuMeew0OZ",
        'PATH': "../saved_models/diseases/Potato.keras"
    },
    'Rice': {
        'URL': "https://drive.google.com/uc?id=12lNUkhX86zuVt5TSosCcZYSUewpCzk2f",
        'PATH': "../saved_models/diseases/Rice.keras"
    },
    'Strawberry': {
        'URL': "https://drive.google.com/uc?id=1p5LuL2PridS3VzYvWNSWMpjTha1lycVY",
        'PATH': "../saved_models/diseases/Strawberry.keras"
    },
    'Sugarcane': {
        'URL': "https://drive.google.com/uc?id=1YEgCPsypovHwyV5zoizq5AAEgn6FqWHQ",
        'PATH': "../saved_models/diseases/Sugarcane.keras"
    },
    'Tea': {
        'URL': "https://drive.google.com/uc?id=1sjbOvRDxjO8uJ9qsPKfc2-OZBiTngl_A",
        'PATH': "../saved_models/diseases/Tea.keras"
    },
    'Tomato': {
        'URL': "https://drive.google.com/uc?id=1Q6HJb-Hpqthd_FzSNUEwSwQjlHgB1C3B",
        'PATH': "../saved_models/diseases/Tomato.keras"
    },
    'Wheat': {
        'URL': "https://drive.google.com/uc?id=1XeDfhammpkNXK3mhd1QJkDiwL3-CfRGx",
        'PATH':  "../saved_models/diseases/Wheat.keras"
    }
}

# Image sizes for different models
LEAF_IMAGE_SIZE = (96, 96)
PLANT_IMAGE_SIZE = (128, 128)
DISEASE_IMAGE_SIZE = (128, 128)

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

# Download models
download_model(LEAF_MODEL_URL, LEAF_MODEL_PATH)
download_model(PLANT_MODEL_URL, PLANT_MODEL_PATH)
for plant in DISEASE_MODELS:
    download_model(DISEASE_MODELS[plant]['URL'], DISEASE_MODELS[plant]['PATH'])

# Load models
try:
    leaf_model = tf.keras.models.load_model(LEAF_MODEL_PATH)
    plant_model = tf.keras.models.load_model(PLANT_MODEL_PATH)
    for plant in DISEASE_MODELS:
        DISEASE_MODELS[plant]['MODEL'] = tf.keras.models.load_model(DISEASE_MODELS[plant]['PATH'])
except Exception as e:
    print(f"Error loading model: {e}")
    exit(1)

# Image preprocessing function
def preprocess_image(image: Image.Image, target_size: tuple) -> np.ndarray:
    """Resizes and normalizes an image for model input."""
    image = image.resize(target_size, Image.BICUBIC).convert("RGB")
    image_array = np.array(image, dtype=np.float32)
    return np.expand_dims(image_array, axis=0)

@app.get("/ping")
async def ping():
    return {"message": "Server is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Predict plant and disease from an uploaded leaf image."""
    image = Image.open(BytesIO(await file.read())).convert("RGB")

    # Preprocess images for each model
    leaf_image = preprocess_image(image, LEAF_IMAGE_SIZE)
    plant_image = preprocess_image(image, PLANT_IMAGE_SIZE)
    disease_image = preprocess_image(image, DISEASE_IMAGE_SIZE)

    # Leaf detection
    leaf_predictions = leaf_model.predict(leaf_image)[0][0]
    print(f"Leaf predictions: {leaf_predictions}")
    if leaf_predictions < 0.5:
        # Identify plant
        plant_predictions = plant_model.predict(plant_image)[0]
        print(f"Plant predictions: {plant_predictions}")
        plant_class = PLANT_NAMES[np.argmax(plant_predictions)]

        # Identify disease
        if plant_class in DISEASE_MODELS:
            disease_model = DISEASE_MODELS[plant_class]['MODEL']
            disease_predictions = disease_model.predict(disease_image)[0]
            print(f"Disease predictions: {disease_predictions}")
            disease_class = DISEASE_NAMES[plant_class][np.argmax(disease_predictions)]
            confidence = float(np.max(disease_predictions))
            message = "Prediction successful"
        else:
            disease_class = "Unknown"
            confidence = 0.0
            message = "Disease model unavailable"
    else:
        plant_class = "Unknown"
        disease_class = "Unknown"
        confidence = 0.0
        message = "Please upload a leaf image"

    return {
        "plant": plant_class,
        "disease": disease_class,
        "confidence": confidence,
        "message": message
    }

# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
