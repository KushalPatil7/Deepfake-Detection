from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model

# Configuration
UPLOAD_FOLDER = r'C:\Users\kusha\Downloads\deepfake-detection\uploads'
MODEL_PATH = r'C:\Users\kusha\Downloads\deepfake-detection\models\VGG.h5'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv'}
INPUT_SIZE = (128, 128)

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:3000", "http://localhost:3000"])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

# Extract frames from video - modified to match new logic
def extract_frames(video_path, max_frames=30):
    cap = cv2.VideoCapture(video_path)
    frames = []
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_indices = list(range(0, total_frames, max(1, total_frames // max_frames)))

    for idx in frame_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if not ret:
            break
        # Resize to match model input size
        resized = cv2.resize(frame, INPUT_SIZE)
        frames.append(resized)

    cap.release()
    return np.array(frames)

# Predict using the new logic
def predict_video(video_path):
    # Extract and preprocess frames
    frames = extract_frames(video_path)
    if frames.shape[0] == 0:
        return None
    
    # Normalize frames
    frames = frames / 255.0
    
    # Get predictions and take the mean
    predictions = model.predict(frames)
    
    # Debug information
    print(f"Prediction shape: {predictions.shape}")
    print(f"Mean prediction: {np.mean(predictions)}")
    
    # Round the mean prediction to get binary result
    # 1 = fake, 0 = real according to your new logic
    predicted_class = int(np.round(np.mean(predictions)))
    
    print(f"🧠 Final prediction: {'fake' if predicted_class == 1 else 'real'}")
    return "fake" if predicted_class == 1 else "real"

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
        return jsonify({"message": "Upload successful", "filename": filename}), 200

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
        prediction = predict_video(video_path)
        if prediction is None:
            return jsonify({"error": "Failed to process video"}), 500

        # Debug the result before sending
        print(f"⚠️ Sending detection result: {prediction} for {video_filename}")
        
        return jsonify({"detection": prediction})  # "real" or "fake"
    except Exception as e:
        print(f"❌ ERROR in detection: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return "DeepFake Detection API is running."

if __name__ == "__main__":
    app.run(debug=True)