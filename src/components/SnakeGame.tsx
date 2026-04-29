import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { Point, Direction } from '../types';
import { cn } from '../lib/utils';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

interface SnakeGameProps {
  score: number;
  onScoreChange: (score: number) => void;
  highScore: number;
  onHighScoreChange: (highScore: number) => void;
}

export default function SnakeGame({ score, onScoreChange, highScore, onHighScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Border Collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsPaused(true);
        if (score > highScore) onHighScoreChange(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food Collision
      if (newHead.x === food.x && newHead.y === food.y) {
        onScoreChange(score + 10);
        setFood(generateFood(newSnake));
        setSpeed((s) => Math.max(s - 2, 60)); // Increase speed
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood, onScoreChange, onHighScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const animate = (time: number) => {
    if (time - lastUpdateRef.current > speed) {
      moveSnake();
      lastUpdateRef.current = time;
    }
    gameLoopRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(animate);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#050505'; // Bento black
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#22d3ee' : 'rgba(34, 211, 238, 0.6)';
      ctx.shadowBlur = isHead ? 15 : 0;
      ctx.shadowColor = '#22d3ee';
      
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;
      const size = cellSize - 4;
      
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 4);
      ctx.fill();
    });

    // Draw food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#d946ef';
    ctx.fillStyle = '#d946ef';
    const fx = food.x * cellSize + 4;
    const fy = food.y * cellSize + 4;
    const fs = cellSize - 8;
    ctx.beginPath();
    ctx.arc(fx + fs / 2, fy + fs / 2, fs / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center gap-6">
      <div className="relative group overflow-hidden rounded-2xl">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-[#050505] block"
        />
        
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <div className="text-center p-8">
                {isGameOver ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="mb-8"
                  >
                    <h2 className="text-5xl font-black text-fuchsia-500 uppercase tracking-tighter italic mb-2">Terminated</h2>
                    <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest">Final Score: {score}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    className="mb-8"
                  >
                    <h2 className="text-5xl font-black text-cyan-400 uppercase tracking-tighter italic">Paused</h2>
                    <p className="text-slate-500 font-mono text-[10px] mt-4 uppercase tracking-[0.3em]">System Standby</p>
                  </motion.div>
                )}
                
                <button
                  onClick={isGameOver ? resetGame : () => setIsPaused(false)}
                  className={cn(
                    "group relative flex items-center gap-3 px-10 py-4 bg-transparent border-2 rounded-full transition-all duration-300",
                    isGameOver ? "border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-white" : "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                  )}
                >
                  <span className="relative z-10 font-black uppercase tracking-widest text-xs">
                    {isGameOver ? "Reboot" : "Continue"}
                  </span>
                  {isGameOver ? <RefreshCw className={cn("relative z-10", isGameOver ? "animate-spin-slow" : "")} size={18} /> : <Play className="relative z-10 fill-current" size={18} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="font-mono text-[10px] text-white/30 uppercase tracking-[0.4em]">
        Move: [Arrows] • Pause: [Space]
      </div>
    </div>
  );
}
