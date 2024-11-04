import React, { useRef, useState, useEffect } from "react";
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
    }, [videoList, videoBuffer]);

    const requestVideoList = async () => {
        try {
            const response = await axios.get<VideoList>(
                "http://localhost:5000/get_new_tasks"
            );
            setVideoList(response.data["new_tasks"]);
            preloadVideos(response.data["new_tasks"]);
        } catch (error) {
            console.error("Error fetching video list:", error);
        }
    };

    const preloadVideos = async (videoNames: string[]) => {
        const buffer = new Map<string, string>();
        for (const videoName of videoNames) {
            axios
                .get(`http://localhost:5000/videos/${videoName}`, {
                    responseType: "blob",
                })
                .then((response) => {
                    console.log(response.data);
                    // const videoBlob = new Blob([response.data as BlobPart], { type: 'video/mp4' });
                    const videoUrl = URL.createObjectURL(response.data as Blob);
                    videoRef.current!.src = videoUrl;
                    videoRef.current!.load();
                    videoRef.current!.play();
                    console.log(`Preloaded video ${videoName}:`, videoUrl);
                    buffer.set(videoName, videoUrl);
                })
                .catch((error) => {
                    console.error(
                        `Error preloading video ${videoName}:`,
                        error
                    );
                });
        }
        setVideoBuffer(buffer);
    };

    const playNextVideo = () => {
        if (videoList.length > 0) {
            const nextVideoName = videoList.shift();
            if (nextVideoName && videoBuffer.has(nextVideoName)) {
                const nextVideoUrl = videoBuffer.get(nextVideoName);
                if (nextVideoUrl) {
                    setVideoUrl(nextVideoUrl);
                    if (videoRef.current) {
                        console.log("Playing next video:", nextVideoName);
                        videoRef.current.src = nextVideoUrl;
                        videoRef.current.load();
                        videoRef.current.play();
                    }
                }
            }
        }
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
