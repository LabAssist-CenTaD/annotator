import React, { useRef, useState } from "react";
import Button from "./components/Button";
import VideoPlayer from "./components/VideoPlayer";

const App = () => {
  // State to hold the video URL
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0]; // Get the selected file
      const url = URL.createObjectURL(file); // Create a URL for the uploaded file
      setVideoUrl(url); // Update the video URL state
      console.log("Uploaded file:", file.name); // Log the file name
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <VideoPlayer videoUrl={videoUrl} />

      {/* Buttons */}
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
        style={{ display: "none" }} // Hide the file input
        accept="video/mp4" // Optional: limit to mp4 files
      />

      <Button color="green" keyBind="1">
        <b>1</b> Correct
      </Button>
      <Button color="red" keyBind="2">
        <b>2</b> Incorrect
      </Button>
      <Button color="gray" keyBind="3">
        <b>3</b> Stationary
      </Button>
      <Button color="blue" keyBind="4">
        <b>4</b> Reject
      </Button>
      <Button color="blue" keyBind="5">
        <b>5</b> Back
      </Button>
    </div>
  );
};

export default App;
