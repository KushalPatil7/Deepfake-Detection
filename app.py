# app.py


# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename

# Configuration
app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:3000", "http://localhost:3000"])
app.config['UPLOAD_FOLDER'] = r'C:\Users\kusha\Downloads\deepfake-detection\uploads'
app.config['EXTRACTED_FRAMES'] = r'C:\Users\kusha\Downloads\deepfake-detection\Extracted Frames'
MODEL_PATH = r'C:\Users\kusha\Downloads\deepfake-detection\models\VGG.h5'  # Path to your trained .h5 model# Path to your trained .h5 model
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}
INPUT_SIZE = (128, 128)

# Create required folders
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['EXTRACTED_FRAMES'], exist_ok=True)

# Load deepfake detection model
try:
    model = load_model(MODEL_PATH)
    print("✅ Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# Check allowed video formats
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Extract frames from video
def extract_frames(video_path, output_folder, frames_per_video=30):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_indices = list(range(0, total_frames, max(1, total_frames // frames_per_video)))
    frames = []

    for idx, frame_idx in enumerate(frame_indices):
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if ret:
            resized = cv2.resize(frame, INPUT_SIZE)  # Match model input
            frames.append(resized)
            cv2.imwrite(os.path.join(output_folder, f"frame_{idx}.jpg"), resized)

    cap.release()
    return np.array(frames)

# Predict using the model - INVERTED logic based on test results
def predict_video(video_path):
    # Extract and preprocess frames
    frames = extract_frames(video_path, app.config['EXTRACTED_FRAMES'])
    if frames.shape[0] == 0:
        return None
    
    # Normalize frames
    frames = frames / 255.0
    
    # Get predictions and take the mean
    predictions = model.predict(frames)
    mean_prediction = np.mean(predictions)
    
    print(f"Prediction shape: {predictions.shape}")
    print(f"Mean prediction: {mean_prediction}")
    
    # INVERTED LOGIC: Low values (< 0.5) are fake, high values (> 0.5) are real
    # This is opposite of the standard interpretation but seems to match your expected results
    is_fake = bool(mean_prediction < 0.5)
    result = "fake" if is_fake else "real"
    
    # Calculate confidence: how far from the decision boundary (0.5)
    confidence = abs(mean_prediction - 0.5) * 200  # Scale to 0-100%
    
    print(f"🧠 Final prediction: {result} (mean={mean_prediction:.4f}, is_fake={is_fake})")
    
    # 🧹 Cleanup: Delete extracted frames after prediction
    for file in os.listdir(app.config['EXTRACTED_FRAMES']):
        file_path = os.path.join(app.config['EXTRACTED_FRAMES'], file)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"⚠️ Error deleting file {file_path}: {e}")
    
    return {
        "result": result,
        "is_fake": is_fake,
        "mean_prediction": float(mean_prediction),
        "confidence": float(confidence)
    }

# Flask route for video upload
@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    file = request.files['video']

    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({
            "message": "Upload successful", 
            "filename": filename,
            "filepath": filepath
        }), 200

    return jsonify({"error": "Invalid file type"}), 400

# Flask route for deepfake detection
@app.route('/detect', methods=['POST'])
def detect_video():
    data = request.get_json()
    video_filename = data.get('videoFilename')

    if not video_filename:
        return jsonify({"error": "Missing video filename"}), 400

    video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_filename)

    if not os.path.exists(video_path):
        return jsonify({"error": "Video file not found"}), 404

    try:
        prediction_info = predict_video(video_path)
        if prediction_info is None:
            return jsonify({"error": "Failed to process video"}), 500

        # Debug the result before sending
        print(f"⚠️ Sending detection result: {prediction_info['result']} for {video_filename}")
        
        return jsonify({
            "detection": prediction_info["result"],  # "real" or "fake"
            "is_fake": prediction_info["is_fake"],   # boolean for easier frontend usage
            "confidence": round(float(prediction_info["confidence"]), 2),
            "video_path": video_path
        })
    except Exception as e:
        print(f"❌ ERROR in detection: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return "DeepFake Detection API is running."

if __name__ == "__main__":
    app.run(debug=True)