import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import PlayIcon from '@heroicons/react/24/outline/PlayIcon';
import PauseIcon from '@heroicons/react/24/outline/PauseIcon';
import SpeakerWaveIcon from '@heroicons/react/24/outline/SpeakerWaveIcon';
import SpeakerXMarkIcon from '@heroicons/react/24/outline/SpeakerXMarkIcon';
import ForwardIcon from '@heroicons/react/24/outline/ForwardIcon';
import BackwardIcon from '@heroicons/react/24/outline/BackwardIcon';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { MusicTrack } from '@/services/music-sources';

export interface YouTubeMusicPlayerProps {
  song: MusicTrack;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: string) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onEnded: () => void;
}

export function YouTubeMusicPlayer({
  song,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isRepeat,
  isShuffle,
  onPlayPause,
  onPrevious,
  onNext,
  onTimeUpdate,
  onDurationChange,
  onVolumeChange,
  onToggleMute,
  onToggleRepeat,
  onToggleShuffle,
  onEnded
}: YouTubeMusicPlayerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const playerContainerId = 'youtube-music-player';
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeInterval = useRef<NodeJS.Timeout>();

  // Load YouTube IFrame API if needed
  useEffect(() => {
    if (!song?.youtubeData?.videoId) return;
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initializePlayer;
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song?.youtubeData?.videoId]);

  // Initialize YouTube Player
  const initializePlayer = () => {
    if (!window.YT || !song?.youtubeData?.videoId) return;
    playerRef.current = new window.YT.Player(playerContainerId, {
      height: '0',
      width: '0',
      videoId: song.youtubeData.videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        origin: window.location.origin,
        cc_load_policy: 0,
        playsinline: 1,
      },
      events: {
        onReady: handlePlayerReady,
        onStateChange: handlePlayerStateChange,
      },
    });
  };

  // Handle YouTube Player ready
  const handlePlayerReady = (event?: any) => {
    setIsLoading(false);
    if (isMuted) {
      event?.target.mute();
    } else {
      event?.target.unMute();
      event?.target.setVolume(volume * 100);
    }
    if (isPlaying) {
      event?.target.playVideo();
    }
  };

  // Handle YouTube Player state changes
  const handlePlayerStateChange = (event: any) => {
    // 0 = ended, 1 = playing, 2 = paused
    if (event.data === 0) {
      onEnded();
    }
    if (event.data === 1) {
      setIsLoading(false);
    }
  };

  // Play/pause control for YouTube
  useEffect(() => {
    if (!playerRef.current || !song?.youtubeData?.videoId) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (error) {
      // ignore
    }
  }, [isPlaying, song?.youtubeData?.videoId]);

  // Mute/unmute control for YouTube
  useEffect(() => {
    if (!playerRef.current || !song?.youtubeData?.videoId) return;
    try {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume * 100);
      }
    } catch (error) {
      // ignore
    }
  }, [isMuted, volume, song?.youtubeData?.videoId]);

  // Fallback: audio element for non-YouTube sources
  useEffect(() => {
    if (!audioRef.current || song?.youtubeData?.videoId) return;
    if (!song) return;
    const loadNewSong = async () => {
      setIsLoading(true);
      let src: string | undefined = undefined;
      if (song.youtubeData?.streamUrl) {
        src = song.youtubeData.streamUrl;
      } else if (song.sourceUrl) {
        src = song.sourceUrl;
      }
      if (src && audioRef.current) {
        audioRef.current.src = src;
        audioRef.current.load();
        try {
          if (isPlaying) {
            await audioRef.current.play();
          }
        } catch (error) {
          // ignore
        } finally {
          setIsLoading(false);
        }
      } else {
        // No valid src, do not set or load
        setIsLoading(false);
      }
    };
    loadNewSong();
  }, [song?.sourceUrl, song?.youtubeData?.streamUrl, song?.youtubeData?.videoId, isPlaying, song]);

  useEffect(() => {
    setIsVisible(!!song);
  }, [song]);

  // Handle volume changes for audio element
  useEffect(() => {
    if (audioRef.current && !song?.youtubeData?.videoId) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, song?.youtubeData?.videoId]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && !song?.youtubeData?.videoId) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      onTimeUpdate(newTime);
    }
  };

  if (!song) return null;

  return (
    <Card 
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 p-4 bg-background/80 backdrop-blur-md border rounded-2xl shadow-xl w-[95%] max-w-3xl z-50 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      {/* YouTube Player (hidden visually) */}
      {song.youtubeData?.videoId && (
        <div style={{ width: 0, height: 0, overflow: 'hidden' }}>
          <div id={playerContainerId} />
        </div>
      )}
      {/* Fallback audio element for non-YouTube sources */}
      {!song.youtubeData?.videoId && (
        <audio 
          ref={audioRef} 
          preload="metadata"
          onLoadedMetadata={(e) => {
            const audio = e.currentTarget;
            setTotalDuration(audio.duration);
            onDurationChange(formatTime(audio.duration));
          }}
        />
      )}
      <div className="flex flex-col gap-3">
        {/* Song Info */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 8v-4" />
              <path d="M12 16v4" />
              <path d="M16 12h4" />
              <path d="M4 12h4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{song.title}</h3>
            {song.artist && (
              <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-1">
          <div className="relative w-full group">
            <Slider
              value={[currentTime]}
              max={totalDuration || duration || 100}
              step={0.1}
              onValueChange={handleProgressChange}
              className="flex-1"
            />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-2 py-1 rounded-md text-xs">
              {formatTime(currentTime)} / {formatTime(totalDuration || duration)}
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(totalDuration || duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggleShuffle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "h-4 w-4",
                  isShuffle && "text-primary"
                )}
              >
                <path d="M16 3h5v5" />
                <path d="M4 20L21 3" />
                <path d="M21 16v5h-5" />
                <path d="M15 15l6 6" />
                <path d="M4 4l5 5" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggleRepeat}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "h-4 w-4",
                  isRepeat && "text-primary"
                )}
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:scale-105 transition-transform"
              onClick={onPrevious}
              title="Previous track"
            >
              <BackwardIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 hover:scale-105 transition-all"
              onClick={onPlayPause}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-6 w-6 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <PauseIcon className="h-6 w-6 text-primary-foreground" />
              ) : (
                <PlayIcon className="h-6 w-6 text-primary-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:scale-105 transition-transform"
              onClick={onNext}
              title="Next track"
            >
              <ForwardIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggleMute}
            >
              {isMuted ? (
                <SpeakerXMarkIcon className="h-4 w-4" />
              ) : (
                <SpeakerWaveIcon className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={(value) => onVolumeChange(value[0])}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </Card>
  );
} 