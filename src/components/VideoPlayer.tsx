import React, { useRef, useEffect } from "react";
import Button from "./Button";

interface VideoPlayerProps {
  videoUrl: string | null;
  onVideoUrlChange: (url: string | null) => void; // Add prop to handle video URL change
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onVideoUrlChange,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  // Clean up URL when video URL changes
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl); // Release the object URL
      }
    };
  }, [videoUrl]);

  // Function to handle file selection
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0]; // Get the selected file
      const url = URL.createObjectURL(file); // Create a URL for the uploaded file
      onVideoUrlChange(url); // Call the prop function to update the video URL in App
      console.log("Uploaded file:", file.name); // Log the file name
    }
  };

  // Function to log the current timestamp of the video
  const logVideoTimestamp = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime; // Get the current playback time
      console.log("Current Video Timestamp:", currentTime);
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        width="640"
        height="360"
        controls
        key={videoUrl} // Add key to force re-render on URL change
      >
        {videoUrl ? (
          <source src={videoUrl} type="video/mp4" />
        ) : (
          <source src="your-video-url.mp4" type="video/mp4" /> // Default video
        )}
        Your browser does not support the video tag.
      </video>

      <div className="flex flex-row justify-center items-center mt-2 space-x-2">
        {" "}
        {/* Flexbox for buttons */}
        <Button
          color="blue"
          keyBind="u"
          onClick={() => fileInputRef.current?.click()} // Trigger file input click
        >
          <b>U</b> Upload
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }} // Hide the file input
          accept="video/mp4" // Optional: limit to mp4 files
        />
        <Button color="blue" keyBind="l" onClick={logVideoTimestamp}>
          <b>L</b> Log Video Timestamp
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;
