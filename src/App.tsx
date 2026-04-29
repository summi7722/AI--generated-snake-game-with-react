import { useState } from 'react';
import { Gamepad2, Trophy, Music, Zap, Activity } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 p-4 md:p-8 flex flex-col gap-6">
      {/* Header Section */}
      <header className="flex justify-between items-center border-b border-white/10 pb-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Gamepad2 className="text-black" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter uppercase italic leading-none">
              Pulse <span className="text-cyan-400">Runner</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mt-1">Neon Arcade v2.0</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-4">
          <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
            <Activity size={14} className="text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Latency: 12ms</span>
          </div>
          <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 text-fuchsia-400">
            <Zap size={14} />
            <span className="text-[10px] font-mono uppercase tracking-widest">FPS: 60.0</span>
          </div>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="grid grid-cols-12 grid-rows-6 gap-4 flex-1 min-h-0">
        
        {/* Left Sidebar: Info/Context (3 cols) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-3 lg:row-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-cyan-400 mb-2">
              <Music size={18} />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Transmission</h2>
            </div>
            <h3 className="text-2xl font-bold leading-tight italic uppercase italic">
              Vibe or <br />
              <span className="text-fuchsia-500">Collapse.</span>
            </h3>
            <p className="text-sm text-white/40 leading-relaxed font-medium">
              Navigate the electric grid. Listen to the synth-waves of the future while you avoid the edge.
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded flex items-center justify-center text-[10px] font-bold text-cyan-400">01</div>
                  <span className="text-xs font-semibold text-white/80 group-hover:text-cyan-400 transition-colors">Cybernetic Drift</span>
                </div>
                <span className="text-[10px] font-mono text-white/20">3:42</span>
              </div>
              <div className="flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold">02</div>
                  <span className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors">Neon Rainfall</span>
                </div>
                <span className="text-[10px] font-mono text-white/20">4:15</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center: Snake Game (6 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-6 lg:row-span-4 bg-black border-2 border-cyan-500/30 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.05)]"
        >
          {/* Subtle Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.07] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(#22d3ee 0.5px, transparent 0.5px)', 
              backgroundSize: '20px 20px' 
            }} 
          />
          <div className="relative z-10 p-4">
            <SnakeGame 
              score={score} 
              onScoreChange={setScore} 
              highScore={highScore} 
              onHighScoreChange={setHighScore} 
            />
          </div>
          <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-400/50 bg-black/50 px-3 py-1.5 rounded border border-cyan-400/20 backdrop-blur-md">
            SYSTEM_LINK: ACTIVE
          </div>
        </motion.div>

        {/* Right Sidebar: Stats (3 cols) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-3 lg:row-span-4 flex flex-col gap-4"
        >
          <div className="bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:bg-fuchsia-500/10 transition-colors">
            <span className="text-[10px] uppercase tracking-[0.3em] text-fuchsia-400/60 font-black mb-3">Live Session</span>
            <div className="text-6xl font-black italic tabular-nums tracking-tighter text-white drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              {score}
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center flex-1">
            <Trophy className="text-white/20 mb-4" size={32} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black mb-2">Record Protocol</span>
            <div className="text-4xl font-bold text-white/80 tabular-nums tracking-tight italic">
              {highScore}
            </div>
          </div>

          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white/50 hover:bg-white/10 hover:text-white transition-all">
            Unlock Full OST
          </button>
        </motion.div>

        {/* Bottom Bar: Music Player (12 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-12 lg:row-span-2"
        >
          <MusicPlayer />
        </motion.div>

      </main>

      <footer className="shrink-0 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] pb-2">
        <span>© 2026 Pulse Runner Inc.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Source</a>
        </div>
      </footer>
    </div>
  );
}
