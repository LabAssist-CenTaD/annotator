import React, { useRef, useEffect } from "react";
import UploadButton from "./UploadButton";
import Button from "./Button";
import axios from "axios";

interface VideoPlayerProps {
  videoUrl: string | null;
  onVideoUrlChange: (url: string | null) => void;
  onVideoNameChange: (name: string) => void;
  requestVideoList: () => Promise<void>; // New prop for requesting next video
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onVideoUrlChange,
  onVideoNameChange,
  requestVideoList,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cleanup: revoke URL when videoUrl changes
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Function to load video by video name
  const loadVideo = async (videoName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/videos/${videoName}`,
        {
          responseType: "blob",
        }
      );
      const videoUrl = URL.createObjectURL(response.data as Blob);
      onVideoUrlChange(videoUrl);
      if (videoRef.current) {
        videoRef.current.src = videoUrl;
        videoRef.current.load();
        videoRef.current.play();
      }
    } catch (error) {
      console.error(`Error loading video ${videoName}:`, error);
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
        {/* Upload Button */}
        <UploadButton
          keybind="u"
          onVideoUrlChange={loadVideo}
          videoRef={videoRef}
          onVideoNameChange={onVideoNameChange}
        />
        {/* Update Button to manually load next video */}
        <Button color="blue" onClick={requestVideoList}>
          Update
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;
