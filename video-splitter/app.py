from ultralytics.models.yolo import YOLO
from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS
from object_detector import pad_and_resize, predict_on_clips, get_valid_flask, square_crop, save_clips_as_mp4, extract_clips
from annotator import Annotator
import numpy as np
import tempfile
import math
import cv2
import os
import io

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from your React app

@app.route('/uploads/<path:filename>', methods=['GET'])
def serve_video(filename):
    return send_from_directory('uploads', filename, mimetype='video/mp4')

model = YOLO('models/obj_detect_best_v5.pt', verbose = False).cpu()
# model = YOLO('video-splitter/models/obj_detect_best_v5.pt', verbose = False).cpu()

# Initialize the Annotator class
annotator = Annotator('database.csv', 'config.json')
annotator.set_uploads_folder('uploads')
annotator.update_database()

# Route to handle video uploads and annotation logic
@app.route('/upload', methods=['POST']) 
def upload_video() -> Response:
    if 'video' not in request.files:
        return jsonify({'error': 'Flask: No video uploaded'}), 400

    video = request.files['video']
    video_name = video.filename
    print(video_name)

    # Read the video file as bytes
    video_bytes = video.read()
    clips, fps = process_video(video_bytes, 6)

    # Generate file paths for the saved clips
    clip_paths = []
    if save_clips_as_mp4('uploads', clips, base_name=video_name[:-4], fps=fps):
        # Create paths based on the specified naming convention
        for i in range(len(clips)):
            clip_path = os.path.join('uploads', f'{video_name[:-4]}_{i}.mp4').replace('\\', '/')
            if not os.path.exists(clip_path):
                print(f"Clip not found: {clip_path}")  # Log if the file doesn't exist
            clip_paths.append(clip_path)
            print(f"Clip saved at: {clip_path}")
        annotator.update_database()
        return jsonify({'message': 'Flask: Video processed successfully', 'clip_paths': annotator.get_new_task(5)}), 200
    else:
        return jsonify({'error': 'Flask: Error processing video'}), 500
    
# New endpoint to serve video clips as byte data
@app.route('/videos/<clip_name>', methods=['GET'])
def get_clip_data(clip_name):
    clip_path = os.path.join('uploads', clip_name)
    if not os.path.exists(clip_path):
        return jsonify({'error': 'Flask: Clip not found'}), 404
    with open(clip_path, 'rb') as f:
        clip_data = f.read()
    return Response(clip_data, mimetype='video/mp4', content_type='video/mp4', direct_passthrough=True, headers={'Content-Disposition': f'attachment; filename={clip_name}'})

@app.route('/get_new_tasks', methods=['GET'])
def get_new_task():
    new_tasks = annotator.get_new_task(5)
    if new_tasks is None:
        return jsonify({'error': 'Flask: No new tasks available'}), 404
    return jsonify({'new_tasks': new_tasks}), 200
    
def process_video(video:bytes | str, interval:int):
    # reads the video and separates it into clips of interval seconds. Crops the videos based on the object detection model
    extracted_clips, fps = extract_clips(video, interval, transform=pad_and_resize)
    
    preds = predict_on_clips(extracted_clips, model)
    
    cropped_clips = []
    for i, pred in enumerate(preds):
        flask_box = get_valid_flask(pred)
        if flask_box is not None:
            cropped_clip = []
            for frame in extracted_clips[i]:
                cropped_clip.append(square_crop(frame, flask_box))
            cropped_clips.append(np.array(cropped_clip))
    print(f'Found {len(cropped_clips)} valid clips')
    
    return cropped_clips, fps
            
# Run the Flask app
if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')  # Create an uploads folder if it doesn't exist
    app.run(debug=True)

    # Test the process_video function
    # with open('video-splitter/sample_vid.MOV', 'rb') as f:
    #     video = f.read()
    #     clips, fps = process_video(video, 6)
    #     # save the clips as MOV files to uploads folder
    #     save_clips_as_mp4('uploads', clips, base_name='clip', fps=fps)
        