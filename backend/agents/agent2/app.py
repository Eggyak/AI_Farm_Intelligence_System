# ==========================================
# AGENT 2 (INTELLIGENT + UI CONTROLLED)
# ==========================================

import os
import json
import random
import numpy as np
import cv2
import tensorflow as tf
from sklearn.ensemble import IsolationForest

DATASET_PATH = "backend/agents/agent2/Dataset"
MODEL_NAME = "llama3"

# =========================
# RULE BASE
# =========================

CROP_RULES = {
    "rice": {"temp": (20, 35), "moisture": 60, "humidity": 70},
    "wheat": {"temp": (10, 25), "moisture": 40, "humidity": 50},
    "cotton": {"temp": (21, 30), "moisture": 35, "humidity": 60},
    "sugarcane": {"temp": (20, 38), "moisture": 65, "humidity": 65}
}

# =========================
# TOOL 1: RULE ENGINE
# =========================

def tool_rule_engine(data):
    crop = data.get("crop", "rice")
    rules = CROP_RULES[crop]
    risks = []

    if not (rules["temp"][0] <= data.get("temperature", 25) <= rules["temp"][1]):
        risks.append(("Temperature Stress", "HIGH"))

    if data.get("soil_moisture", 50) < rules["moisture"]:
        risks.append(("Water Stress", "HIGH"))

    if data.get("humidity", 50) < rules["humidity"]:
        risks.append(("Pest Probability", "MEDIUM"))

    if data.get("ndvi", 0.5) < 0.4:
        risks.append(("Nutrient Deficiency", "HIGH"))

    return risks

# =========================
# TOOL 2: ML ANOMALY
# =========================

def train_sensor_model():
    data = np.random.rand(500, 4)
    model = IsolationForest(contamination=0.1)
    model.fit(data)
    return model

sensor_model = train_sensor_model()

def tool_ml_anomaly(data):
    X = np.array([[data.get("temperature", 25),
                   data.get("humidity", 50),
                   data.get("soil_moisture", 50),
                   data.get("ndvi", 0.5)]])

    if sensor_model.predict(X)[0] == -1:
        return [("Environmental Anomaly", "HIGH")]
    return []

# =========================
# TOOL 3: IMAGE MODEL
# =========================

image_model = None
class_names = ["healthy"]

def load_image_model():
    global image_model, class_names

    if image_model is not None:
        return

    try:
        dataset = tf.keras.preprocessing.image_dataset_from_directory(
            DATASET_PATH,
            image_size=(128, 128),
            batch_size=32
        )

        class_names = dataset.class_names

        model = tf.keras.Sequential([
            tf.keras.layers.Rescaling(1./255),
            tf.keras.layers.Conv2D(32, 3, activation='relu'),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, 3, activation='relu'),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(len(class_names), activation='softmax')
        ])

        model.compile(optimizer='adam',
                      loss='sparse_categorical_crossentropy',
                      metrics=['accuracy'])

        model.fit(dataset, epochs=1, verbose=0)

        image_model = model

    except Exception:
        image_model = None

def tool_image_analysis(image_path, crop):
    if image_model is None:
        return [], "no_model"

    img = cv2.imread(image_path)
    img = cv2.resize(img, (128,128))
    img = np.expand_dims(img, axis=0)

    pred = image_model.predict(img, verbose=0)
    label = class_names[np.argmax(pred)]

    risks = []
    if "healthy" not in label.lower():
        risks.append(("Disease Detected", "HIGH"))

    return risks, label

# =========================
# 🧠 HYBRID DECISION ENGINE
# =========================

def decide_analysis_mode(input_data):

    # 🟢 Manual mode (from UI)
    try:
        if isinstance(input_data, dict):
            agent2_input = input_data.get("agent2", {})
            if agent2_input.get("analysis"):
                mode = agent2_input.get("analysis")
                print("🎛️ Manual Mode:", mode)
                return mode
    except:
        pass

    # 🔵 LLM mode
    try:
        import ollama

        res = ollama.chat(
            model=MODEL_NAME,
            messages=[{
                "role": "user",
                "content": f"""
                User input: {input_data}

                Choose analysis type:
                options = [rule, ml, image, full]

                Return only one word.
                """
            }]
        )

        raw = res["message"]["content"].lower()

        for key in ["rule", "ml", "image", "full"]:
            if key in raw:
                print("🧠 LLM Decision:", key)
                return key

        return "full"

    except Exception:
        return "full"

# =========================
# UTILITIES
# =========================

def get_random_image():
    imgs = []
    for root, _, files in os.walk(DATASET_PATH):
        for f in files:
            if f.endswith((".jpg", ".png", ".jpeg")):
                imgs.append(os.path.join(root, f))
    return random.choice(imgs) if imgs else None

# =========================
# PIPELINE ENTRY  ← UPDATED (Step 3 Fix)
# =========================

def main(agent1_output):

    # Safely extract agent2-relevant input, ensures no crash
    try:
        agent2_input = agent1_output if isinstance(agent1_output, dict) else {}
    except:
        agent2_input = {}

    if isinstance(agent1_output, list) and len(agent1_output) > 0:
        record = agent1_output[0]
    else:
        record = {}

    data = {
        "crop": "cotton",
        "temperature": record.get("weather", {}).get("temperature", 25),
        "humidity": record.get("weather", {}).get("humidity", 50),
        "soil_moisture": record.get("sensor", {}).get("soil_moisture", 50),
        "ndvi": 0.5
    }

    mode = decide_analysis_mode(agent2_input)

    risks = []
    disease = "unknown"

    image_path = get_random_image()

    if mode == "rule":
        risks += tool_rule_engine(data)

    elif mode == "ml":
        risks += tool_ml_anomaly(data)

    elif mode == "image":
        load_image_model()
        r, d = tool_image_analysis(image_path, data["crop"])
        risks += r
        disease = d

    else:
        risks += tool_rule_engine(data)
        risks += tool_ml_anomaly(data)

        load_image_model()
        r, d = tool_image_analysis(image_path, data["crop"])
        risks += r
        disease = d

    score_map = {"LOW": 1, "MEDIUM": 2, "HIGH": 3}
    score = sum(score_map[r[1]] for r in risks)

    return {
        "agent2_output": {
            "risks": risks,
            "disease": disease,
            "risk_score": score,
            "status": "SAFE" if score == 0 else "ALERT"
        },
        "input_used": data
    }

# =========================
# TEST MODE
# =========================

if __name__ == "__main__":
    print("🚀 Agent2 Running...")

    print(json.dumps(main({
        "agent2": {"analysis": "rule"}
    }), indent=4))