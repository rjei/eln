import { useState, useRef, useEffect } from "react";
import YouTube, { Options as YouTubeOptions, YouTubePlayer } from "react-youtube";
import { Play, Pause } from "lucide-react";
import { Button } from "./ui/button";

interface VideoPlayerProps {
  videoUrl: string;
  onTimeUpdate?: (currentTime: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onPlayerReady?: (player: YouTubePlayer) => void;
}

export function VideoPlayer({ videoUrl, onTimeUpdate, onPlay, onPause, onPlayerReady }: VideoPlayerProps) {
  // create local alias so code always references a declared binding
  const onPlayerReadyCallback = onPlayerReady;
  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const parseVideoId = (urlOrId: string) => {
    if (!urlOrId) return "";
    if (!urlOrId.includes("/")) return urlOrId;
    const m = urlOrId.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{4,})/);
    return m ? m[1] : urlOrId;
  };

  const videoId = parseVideoId(videoUrl);

  const opts: YouTubeOptions = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
    },
  };

  const onReady = (event: any) => {
    playerRef.current = event.target as YouTubePlayer;
    onPlayerReadyCallback?.(playerRef.current);
    // diagnostic
    // eslint-disable-next-line no-console
    console.debug('YouTube ready, playerRef set');
    // Start polling immediately so parent receives currentTime updates
    // even if user doesn't click the Play button (keeps LiveSegmentBox in sync).
    startPolling();
    if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
      const t = playerRef.current.getCurrentTime();
      setCurrentTime(t);
      onTimeUpdate?.(t);
    }
    // ensure audio is unmuted and volume set
    try {
      if (playerRef.current && typeof playerRef.current.unMute === "function") {
        playerRef.current.unMute();
      }
      if (playerRef.current && typeof playerRef.current.setVolume === "function") {
        playerRef.current.setVolume(100);
      }
    } catch (e) {
      // ignore
    }
  };

  const onStateChange = (event: any) => {
    // YouTube PlayerState: 1 = playing, 2 = paused
    const state = event.data;
    // eslint-disable-next-line no-console
    console.debug('YouTube state change', state);
    if (state === 1) {
      try {
        playerRef.current?.unMute?.();
        playerRef.current?.setVolume?.(100);
      } catch (e) {}
    }
    if (state === 2) {
      // paused
    }
  };

  const onError = (event: any) => {
    // eslint-disable-next-line no-console
    console.error('YouTube player error', event);
  };

  const startPolling = () => {
    stopPolling();
    intervalRef.current = window.setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        const t = playerRef.current.getCurrentTime();
        setCurrentTime(t);
        onTimeUpdate?.(t);
      }
    }, 500) as unknown as number;
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const handlePlay = () => {
    // ensure audio enabled before playing
    try {
      playerRef.current?.unMute?.();
      playerRef.current?.setVolume?.(100);
    } catch (e) {}
    playerRef.current?.playVideo();
    setIsPlaying(true);
    onPlay?.();
    startPolling();
  };

  const handlePause = () => {
    playerRef.current?.pauseVideo();
    setIsPlaying(false);
    onPause?.();
    stopPolling();
  };

  const seekTo = (seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
    onTimeUpdate?.(seconds);
  };

  const changeRate = (r: number) => {
    playerRef.current?.setPlaybackRate(r);
    setPlaybackRate(r);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-4xl">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {videoId ? (
            <YouTube videoId={videoId} opts={opts} onReady={onReady} onStateChange={onStateChange} onError={onError} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">No video</div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-3">
          <Button onClick={() => (isPlaying ? handlePause() : handlePlay())}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {isPlaying ? "Pause" : "Play"}
          </Button>

          <div className="text-sm text-gray-700">{formatTime(currentTime)}</div>

          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm text-gray-600">Speed:</label>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
              <button
                key={r}
                onClick={() => changeRate(r)}
                className={`px-2 py-1 rounded ${playbackRate === r ? "bg-primary text-white" : "bg-white/80"}`}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
