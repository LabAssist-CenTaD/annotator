from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from your React app

# Route to handle video uploads and annotation logic
@app.route('/annotate', methods=['POST'])
def annotate_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video uploaded'}), 400

    video = request.files['video']

    # Save the uploaded video to a directory (optional)
    video_path = os.path.join('uploads', video.filename)
    video.save(video_path)

    # Add your annotation logic here (for now, just return a success message)
    return jsonify({'message': 'Video annotated successfully'}), 200

# Run the Flask app
if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')  # Create an uploads folder if it doesn't exist
    app.run(debug=True)
