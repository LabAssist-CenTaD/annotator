import { useState } from "react";
import Button from "./components/Button";
import VideoPlayer from "./components/VideoPlayer";

const App = () => {
  // State to hold the video URL
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 my-8">
      {/* Video Player with Upload Button */}
      <VideoPlayer videoUrl={videoUrl} onVideoUrlChange={setVideoUrl} />
      <div className="space-x-2 p-2 border-2 border-gray-300 rounded-xl">
        {/* Other Buttons */}
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
    </div>
  );
};

export default App;
