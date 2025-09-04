
import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function GlobalAudioPlayer({ 
  currentBeat, 
  onNext, 
  onPrevious, 
  onBeatEnd, 
  onDownload,
  playlist = [] 
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentBeat?.audio_url && audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = currentBeat.audio_url;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        }).catch(() => {
          setIsPlaying(false); // Can't auto-play
          setIsLoading(false);
        });
      }
    } else if (!currentBeat) {
       if (audioRef.current) {
           audioRef.current.pause();
           setIsPlaying(false);
       }
    }
  }, [currentBeat]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (onBeatEnd) onBeatEnd();
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlayThrough = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [onBeatEnd]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentBeat) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="p-2">
            <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-lg shadow-2xl shadow-black/10">
                <audio ref={audioRef} preload="metadata" />
                
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                    {/* Beat Info */}
                    <div className="flex items-center gap-3 min-w-0 w-1/4">
                    <img
                        src={currentBeat.cover_art_url || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop`}
                        alt={currentBeat.title}
                        className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="min-w-0">
                        <h4 className="text-[var(--text-primary)] font-semibold text-sm truncate">
                        {currentBeat.title.toUpperCase()}
                        </h4>
                        <p className="text-[var(--text-secondary)] text-xs truncate">
                        {currentBeat.artist || 'RoyaltyFreeBeats'}
                        </p>
                    </div>
                    </div>

                    {/* Controls & Progress */}
                    <div className="flex flex-col items-center gap-2 flex-1 max-w-lg">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onPrevious}
                                disabled={!onPrevious}
                                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] w-8 h-8"
                            >
                                <SkipBack className="w-5 h-5" fill="currentColor" />
                            </Button>
                            
                            <Button
                                onClick={togglePlayPause}
                                disabled={isLoading}
                                className="bg-[var(--text-primary)] hover:bg-black text-[var(--primary-foreground)] w-10 h-10 rounded-full shadow-md"
                            >
                                {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : isPlaying ? (
                                <Pause className="w-5 h-5" fill="currentColor" />
                                ) : (
                                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                                )}
                            </Button>
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onNext}
                                disabled={!onNext}
                                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] w-8 h-8"
                            >
                                <SkipForward className="w-5 h-5" fill="currentColor" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 w-full">
                            <span className="text-xs text-[var(--text-secondary)] w-10 text-right">{formatTime(currentTime)}</span>
                            <Slider
                                value={[currentTime]}
                                max={duration || 100}
                                step={1}
                                onValueChange={handleSeek}
                                className="flex-1"
                            />
                            <span className="text-xs text-[var(--text-secondary)] w-10">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Volume & Actions */}
                    <div className="flex items-center gap-2 w-1/4 justify-end">
                    <div className="hidden lg:flex items-center gap-2 w-28">
                        <Volume2 className="w-5 h-5 text-[var(--text-secondary)]" />
                        <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="flex-1"
                        />
                    </div>
                    
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDownload && onDownload(currentBeat)}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] w-9 h-9"
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
