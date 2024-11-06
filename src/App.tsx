import { useState } from "react";
import axios from "axios";
import Button from "./components/Button";
import VideoPlayer from "./components/VideoPlayer";

const App = () => {
  // State to hold the video URL
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);

  const annotateVideo = async (key: string) => {
    console.log(`Annotating ${videoName} as ${key}`);
    if (!videoName) {
      alert("No video selected!");
      return;
    } else {
      try {
        await axios.post("http://localhost:5000/annotate", {
          video_name: videoName,
          label: key,
        });
        console.log(`Successfully annotated ${videoName} as ${key}`);
      } catch (error) {
        console.error("Error annotating video:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 my-8">
      {/* Video Player with Upload Button */}
      <VideoPlayer videoUrl={videoUrl} onVideoUrlChange={setVideoUrl} onVideoNameChange={setVideoName} />
      <div className="space-x-2 p-2 border-2 border-gray-300 rounded-xl">
        {/* Other Buttons */}
        <Button color="green" keyBind="1" onClick={() => annotateVideo("Correct")}>
          <b>1</b> Correct
        </Button>
        <Button color="red" keyBind="2" onClick={() => annotateVideo("Incorrect")}>
          <b>2</b> Incorrect
        </Button>
        <Button color="gray" keyBind="3" onClick={() => annotateVideo("Stationary")}>
          <b>3</b> Stationary
        </Button>
        <Button color="blue" keyBind="4" onClick={() => annotateVideo("Reject")}>
          <b>4</b> Reject
        </Button>
        <Button color="blue" keyBind="5">
          <b>5</b> Back
        </Button>
      </div>
    </div>
  );
};

export default App;
