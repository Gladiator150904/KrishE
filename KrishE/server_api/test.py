import os
import numpy as np
import tensorflow as tf
from PIL import Image

# Model path
LEAF_MODEL_PATH = "../saved_models/leaf_model.keras"

# Load the model
try:
    leaf_model = tf.keras.models.load_model(LEAF_MODEL_PATH)
    print("Leaf model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    exit(1)

# Image preprocessing function
def preprocess_image(image: Image.Image, target_size=(96, 96)) -> np.ndarray:
    """Resizes and normalizes an image for model input."""
    image = image.resize(target_size, Image.BICUBIC)  # Resize to target size
    image = np.array(image, dtype=np.float32) / 255.0  # Normalize pixel values to [0, 1]
    return np.expand_dims(image, axis=0)  # Add batch dimension

# Prediction function
def predict_image(image_path: str, class_names: list):
    """Predict whether the object in the image is a leaf or not."""
    try:
        # Open and preprocess the image
        image = Image.open(image_path).convert("RGB")
        preprocessed_image = preprocess_image(image)
        print(f"Preprocessed image shape: {preprocessed_image.shape}")

        # Make prediction
        prediction = leaf_model.predict(preprocessed_image)
        print(f"Raw prediction: {prediction}")

        # Interpret prediction
        predicted_label = class_names[int(np.round(prediction[0][0]))]
        print(f"Predicted label: {predicted_label}")

    except Exception as e:
        print(f"Error during prediction: {e}")

# Main function
if __name__ == "__main__":
    # Define class names (same as in the notebook)
    leaf_class_names = ["Not Leaf", "Leaf"]

    # Provide the path to the image
    image_path = input("Enter the path to the image: ").strip()
    if not os.path.exists(image_path):
        print(f"Error: File not found at {image_path}")
    else:
        predict_image(image_path, leaf_class_names)