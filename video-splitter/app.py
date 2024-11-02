from moviepy.editor import VideoFileClip
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
import io

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from your React app

# Route to handle video uploads and annotation logic
@app.route('/upload', methods=['POST']) 
def upload_video() -> Response:
    if 'video' not in request.files:
        return jsonify({'error': 'Flask: No video uploaded'}), 400

    video = request.files['video']
    video_bytes = io.BytesIO(video.read())
    video_clip = VideoFileClip(video_bytes)
    duration = video_clip.duration

    # # Save the uploaded video to a directory (optional)
    # video_path = os.path.join('uploads', video.filename)

    # video.save(video_path)
    
    video_timestamps = split_video_timestamps(duration, 6)
    if video_timestamps is None:
        return jsonify({'error': 'Flask: Video duration is less than 6 seconds'}), 400

    # Add your annotation logic here (for now, just return a success message)
    return jsonify(
        {
            'message': 'Flask: Video recieved successfully',
            'video_duration': duration,
            'video_timestamps': video_timestamps,
        }), 200

# Splits the video into multiple clips of x seconds each and returns the timestamps.
def split_video_timestamps(total_duration: float, clip_duration: float) -> list[tuple[float, float]]:
    if total_duration < clip_duration:
        return None

    timestamps = []
    start_time = 0
    end_time = clip_duration
    
    while end_time <= total_duration:
        timestamps.append((start_time, end_time))
        start_time = end_time
        end_time += clip_duration
        
    if end_time > total_duration:
        timestamps.append((total_duration - clip_duration, total_duration))
        
    return timestamps

# Run the Flask app
if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')  # Create an uploads folder if it doesn't exist
    app.run(debug=True)
