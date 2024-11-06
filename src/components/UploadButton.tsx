// UploadButton.tsx
import React, { useRef, useEffect, useState } from "react";
import Button from "./Button";
import axios from "axios";

interface UploadResponse {
  message: string;
  clip_paths: string[]; // Array of clip URLs
}

interface VideoList {
  new_tasks: string[];
}

interface UploadButtonProps {
  onVideoUrlChange: (url: string) => void;
  onVideoNameChange: (name: string) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  keybind: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onVideoUrlChange,
  onVideoNameChange,
  videoRef,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      event.target.value = "";
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
          const clipResponse = await axios.post<VideoList>(
              "http://localhost:5000/get_new_tasks",
              {
                  num_clips: 1,
              }
          );
          const tasks = clipResponse.data["new_tasks"];
          onVideoUrlChange(tasks[0]);
          onVideoNameChange(file.name);
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
          onChange={handleUpload}
          style={{ display: "none" }}
          accept="video/mp4/mov"
        />
    </div>
  );
};

export default UploadButton;
