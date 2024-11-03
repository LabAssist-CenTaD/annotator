import React, { useRef, useEffect, useState } from "react";
import Button from "./Button";
import axios, { AxiosError, isAxiosError } from "axios";

interface VideoPlayerProps {
  videoUrl: string | null;
  onVideoUrlChange: (url: string | null) => void;
}

interface UploadResponse {
  message: string;
  clip_paths: string[]; // Array of clip URLs
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onVideoUrlChange,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Clean up URL when video URL changes
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Function to handle file selection
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      onVideoUrlChange(url);
      console.log("Uploaded file:", file.name);
    }
  };

  // Function to send the file to the Flask backend
  const sendFileToPython = async () => {
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const response = await axios.post<UploadResponse>(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from Flask:", response.data);
      alert(response.data.message || "File sent successfully!");

      // Update the video URL to the first clip if available
      if (response.data.clip_paths && response.data.clip_paths.length > 0) {
        const newVideoUrl = `http://localhost:5000/${response.data.clip_paths[0]}`;
        onVideoUrlChange(newVideoUrl); // Set videoUrl to the first clip
        if (videoRef.current) {
          videoRef.current.src = newVideoUrl; // Update the source directly
          videoRef.current.load(); // Load the new video source
          videoRef.current.play(); // Attempt to play the video automatically
        }
      } else {
        alert("No clips were generated.");
      }
    } catch (error) {
      console.error("Error sending file to Flask:", error);
      const axiosError = error as AxiosError;
      const errorMessage =
        isAxiosError(axiosError) && axiosError.response?.data?.error
          ? axiosError.response.data.error
          : "Failed to send file.";
      alert(errorMessage);
    }
  };

  // Function to log the current timestamp of the video
  const logVideoTimestamp = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      console.log("Current Video Timestamp:", currentTime);
    }
  };

  return (
    <div>
      <video ref={videoRef} width="640" height="360" controls key={videoUrl}>
        {videoUrl ? (
          <source src={videoUrl} type="video/mp4" />
        ) : (
          <source src="your-video-url.mp4" type="video/mp4" />
        )}
      </video>

      <div className="flex flex-row justify-center items-center mt-2 space-x-2">
        <Button
          color="blue"
          keyBind="u"
          onClick={() => fileInputRef.current?.click()}
        >
          <b>U</b> Upload
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }}
          accept="video/mp4"
        />
        <Button color="blue" keyBind="l" onClick={logVideoTimestamp}>
          <b>L</b> Log Video Timestamp
        </Button>
        <Button color="green" onClick={sendFileToPython}>
          Send File to Python
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;
