from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io
from pathlib import Path
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React frontend to call this API

# Load the model once at startup
MODEL_PATH = Path(r"D:\sdme\test_model\malaria_vgg19_updated.h5")
model = load_model(MODEL_PATH)
print("Model loaded OK:", MODEL_PATH)

def preprocess_image(file) -> np.ndarray:
    """Preprocess uploaded image for prediction"""
    img = Image.open(io.BytesIO(file)).resize((64, 64)).convert("RGB")
    x = np.array(img, dtype=float) / 255.0
    x = np.expand_dims(x, 0)
    return x

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    x = preprocess_image(file.read())
    pred = model.predict(x)[0][0]
    
    # Convert NumPy float32 to regular Python float for JSON serialization
    pred_float = float(pred)  # This is the fix!
    
    # Return format that matches your frontend expectations
    result = "parasitized" if pred_float > 0.5 else "uninfected"
    confidence = round((pred_float if result == "parasitized" else (1 - pred_float)) * 100, 2)
    
    return jsonify({
        "result": result, 
        "confidence": confidence,
        "prediction_value": pred_float  # Use the converted float
    })

# Add health endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "OK", 
        "message": "Malaria Detection API is running",
        "model_loaded": True
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)