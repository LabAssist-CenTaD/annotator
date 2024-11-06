import React, { useRef, useState, useEffect, useCallback } from "react";
import UploadButton from "./UploadButton";
import axios from "axios";
import Button from "./Button";

interface VideoPlayerProps {
    videoUrl: string | null;
    onVideoUrlChange: (url: string | null) => void;
    onVideoNameChange: (name: string) => void;
    
}

interface VideoList {
    new_tasks: string[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = (
    {videoUrl, onVideoUrlChange, onVideoNameChange}
) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoList, setVideoList] = useState<string[]>([]);
    const [videoBuffer, setVideoBuffer] = useState<Map<string, string>>(
        new Map()
    );

    // Callback to play the next video in the list
    // const playNextVideo = useCallback(() => {
    //     if (videoList.length > 0) {
    //         const nextVideoName = videoList[0];
    //         const nextVideoUrl = videoBuffer.get(nextVideoName);
    //         if (nextVideoUrl) {
    //             setVideoUrl(nextVideoUrl);
    //             setVideoList((prevList) => prevList.slice(1));
    //             if (videoRef.current) {
    //                 videoRef.current.src = nextVideoUrl;
    //                 videoRef.current.load();
    //                 videoRef.current.play();
    //             }
    //         }
    //     }
    // }, [videoList, videoBuffer]);

    // useEffect(() => {
    //     const videoElement = videoRef.current;
    //     if (videoElement) {
    //         videoElement.addEventListener("ended", playNextVideo);
    //     }
    //     return () => {
    //         if (videoElement) {
    //             videoElement.removeEventListener("ended", playNextVideo);
    //         }
    //     };
    // }, [playNextVideo]);

    useEffect(() => {
    	return () => {
      		if (videoUrl) {
        		URL.revokeObjectURL(videoUrl);
      		}
    	};
  	}, [videoUrl]);

    const requestVideoList = async () => {
        try {
            const response = await axios.post<VideoList>(
                "http://localhost:5000/get_new_tasks",
                {
                    num_clips: 1,
                }
            );
            const tasks = response.data["new_tasks"];
            // setVideoList(tasks);
            // preloadVideos(tasks);
            onVideoNameChange(tasks[0]);
            loadVideo(tasks[0]);

        } catch (error) {
            console.error("Error fetching video list:", error);
        }
    };

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
    }

    const setVideoName = (name: string) => {
        console.log("Video name:", name);
        onVideoNameChange(name);
    }

    // const preloadVideos = async (videoNames: string[]) => {
    //     const buffer = new Map<string, string>();
    //     for (const videoName of videoNames) {
    //         try {
    //             const response = await axios.get(
    //                 `http://localhost:5000/videos/${videoName}`,
    //                 {
    //                     responseType: "blob",
    //                 }
    //             );
    //             const videoUrl = URL.createObjectURL(response.data as Blob);
    //             buffer.set(videoName, videoUrl);
    //         } catch (error) {
    //             console.error(`Error preloading video ${videoName}:`, error);
    //         }
    //     }
    //     setVideoBuffer(buffer);
    // };

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
                <UploadButton
                    keybind="u"
                    onVideoUrlChange={loadVideo}
                    videoRef={videoRef}
                    onVideoNameChange={setVideoName}
                />
        		<Button color="blue" onClick={requestVideoList}>
                    Update
                </Button>
      		</div>
        </div>
    );
};

export default VideoPlayer;
