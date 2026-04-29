import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';
import { cn } from '../lib/utils';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'Synth-AI Ghost',
    cover: 'https://picsum.photos/seed/neon/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Cyber Glitch',
    artist: 'Circuit Breaker',
    cover: 'https://picsum.photos/seed/cyber/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Retro Wave',
    artist: '80s Dreamer',
    cover: 'https://picsum.photos/seed/retro/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      {/* Info Section */}
      <div className="flex items-center gap-6 w-full md:w-1/3">
        <div className="relative w-16 h-16 bg-gradient-to-tr from-cyan-600 to-blue-900 rounded-xl shadow-lg ring-1 ring-white/10 overflow-hidden shrink-0">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isPlaying ? "scale-110" : "scale-100"
            )}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white truncate leading-tight">{currentTrack.title}</h3>
          <p className="text-sm text-white/50 italic truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls & Progress Section */}
      <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
        <div className="flex items-center gap-8">
          <button
            onClick={skipBack}
            className="text-white/40 hover:text-cyan-400 transition-colors"
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
          </button>

          <button
            onClick={skipForward}
            className="text-white/40 hover:text-cyan-400 transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/40 tabular-nums">
            {Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}
          </span>
          <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
          </div>
          <span className="text-[10px] font-mono text-white/40 tabular-nums">
            {Math.floor((audioRef.current?.duration || 0) / 60)}:{(Math.floor((audioRef.current?.duration || 0) % 60)).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Visualizer Section */}
      <div className="hidden md:flex w-1/3 justify-end gap-1 px-4">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isPlaying ? [12, 32, 16, 48, 12][(i + Math.floor(progress)) % 5] : 12
            }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.05
            }}
            className="w-1 bg-cyan-500/40 rounded-full h-3 align-bottom mt-auto"
          />
        ))}
      </div>
    </div>
  );
}
