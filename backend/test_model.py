import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
import os

# Load the model
model = load_model("models/malaria_vgg19_updated.h5")

# Test with sample images
def test_image(image_path):
    img = Image.open(image_path).resize((64, 64)).convert("RGB")
    x = np.array(img, dtype=float) / 255.0
    x = np.expand_dims(x, 0)
    pred = model.predict(x)[0][0]
    result = "parasitized" if pred > 0.5 else "uninfected"
    confidence = pred if result == "parasitized" else 1 - pred
    return result, confidence, pred

# Test with known images (create a sample_images folder with test images)
test_images = [
    ("sample_images/infected_1.png", "should be parasitized"),
    ("sample_images/infected_2.png", "should be parasitized"),
    ("sample_images/healthy_1.png", "should be uninfected"),
    ("sample_images/healthy_2.png", "should be uninfected"),
]

print("Testing model with sample images...")
for img_path, expected in test_images:
    if os.path.exists(img_path):
        result, confidence, pred_value = test_image(img_path)
        print(f"{img_path}: {result} (confidence: {confidence:.2%}, value: {pred_value:.4f}) - {expected}")
    else:
        print(f"{img_path} not found")