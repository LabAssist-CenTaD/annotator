import React, { useRef, useEffect } from "react";
import Button from "./Button";

interface VideoPlayerProps {
  videoUrl: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Clean up URL when video URL changes
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl); // Release the object URL
      }
    };
  }, [videoUrl]);

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
      <Button color="blue" keyBind="l" onClick={logVideoTimestamp}>
        <b>L</b> Log Video Timestamp
      </Button>
    </div>
  );
};

export default VideoPlayer;
