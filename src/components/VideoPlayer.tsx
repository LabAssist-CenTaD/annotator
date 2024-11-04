import React, { useRef, useState, useEffect, useCallback } from "react";
import UploadButton from "./UploadButton";
import axios from "axios";
import Button from "./Button";

interface VideoPlayerProps {
    videoUrl: string | null;
    onVideoUrlChange: (url: string | null) => void;
}

interface VideoList {
    new_tasks: string[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = () => {
    const [videoUrl, setVideoUrl] = useState<string>("");
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoList, setVideoList] = useState<string[]>([]);
    const [videoBuffer, setVideoBuffer] = useState<Map<string, string>>(
        new Map()
    );

    // Callback to play the next video in the list
    const playNextVideo = useCallback(() => {
        if (videoList.length > 0) {
            const nextVideoName = videoList[0];
            const nextVideoUrl = videoBuffer.get(nextVideoName);
            if (nextVideoUrl) {
                setVideoUrl(nextVideoUrl);
                setVideoList((prevList) => prevList.slice(1));
                if (videoRef.current) {
                    videoRef.current.src = nextVideoUrl;
                    videoRef.current.load();
                    videoRef.current.play();
                }
            }
        }
    }, [videoList, videoBuffer]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener("ended", playNextVideo);
        }
        return () => {
            if (videoElement) {
                videoElement.removeEventListener("ended", playNextVideo);
            }
        };
    }, [playNextVideo]);

    const requestVideoList = async () => {
        try {
            const response = await axios.post<VideoList>(
                "http://localhost:5000/get_new_tasks",
                {
                    num_clips: 5,
                }
            );
            const tasks = response.data["new_tasks"];
            setVideoList(tasks);
            preloadVideos(tasks);
        } catch (error) {
            console.error("Error fetching video list:", error);
        }
    };

    const preloadVideos = async (videoNames: string[]) => {
        const buffer = new Map<string, string>();
        for (const videoName of videoNames) {
            try {
                const response = await axios.get(
                    `http://localhost:5000/videos/${videoName}`,
                    {
                        responseType: "blob",
                    }
                );
                const videoUrl = URL.createObjectURL(response.data as Blob);
                buffer.set(videoName, videoUrl);
            } catch (error) {
                console.error(`Error preloading video ${videoName}:`, error);
            }
        }
        setVideoBuffer(buffer);
    };

    const handleVideoUrlChange = (url: string) => {
        setVideoUrl(url);
    };

    return (
        <div>
            <Button color="blue" keyBind="1" onClick={requestVideoList}>
                Update
            </Button>
            <UploadButton
                onVideoUrlChange={handleVideoUrlChange}
                videoRef={videoRef}
            />
            <video ref={videoRef} controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;