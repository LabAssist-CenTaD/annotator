import React, { useRef, useState } from "react";
import Button from "./Button";

interface UploadButtonProps {
  onVideoUrlChange: (url: string | null) => void; // Function to handle video URL change
}

const UploadButton: React.FC<UploadButtonProps> = ({ onVideoUrlChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State to hold the video URL
  const [, setVideoUrl] = useState<string | null>(null);

  // Function to handle file selection
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0]; // Get the selected file
      const url = URL.createObjectURL(file); // Create a URL for the uploaded file
      setVideoUrl(url); // Update the local video URL state
      onVideoUrlChange(url); // Call the passed function with the new URL
      console.log("Uploaded file:", file.name); // Log the file name
    }
  };

  return (
    <>
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
    </>
  );
};

export default UploadButton;
