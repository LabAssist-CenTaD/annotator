// UploadButton.tsx
import React from "react";
import axios from "axios";

interface UploadResponse {
  message: string;
  clip_paths: string[]; // Array of clip URLs
}

interface UploadButtonProps {
  onVideoUrlChange: (url: string) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onVideoUrlChange,
  videoRef,
}) => {
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("video", file);

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

        if (response.data.clip_paths && response.data.clip_paths.length > 0) {
          const clipName = response.data.clip_paths[0].split("/").pop(); // Extract only the clip name
          const clipResponse = await axios.get(
            `http://localhost:5000/get_clip_data/${clipName}`,
            {
              responseType: "blob",
            }
          );

          const videoBlob = new Blob([clipResponse.data as BlobPart], {
            type: "video/mp4",
          });
          const newVideoUrl = URL.createObjectURL(videoBlob);

          onVideoUrlChange(newVideoUrl); // Set videoUrl to the new blob URL
        } else {
          alert("No clips were generated.");
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleUpload} />
    </div>
  );
};

export default UploadButton;
