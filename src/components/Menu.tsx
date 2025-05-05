import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MenuProps {
  iniciarJogo: () => void;
}

const estrelasQtd = 80;
const opcoes = ['Fácil', 'Médio', 'Difícil'];

export default function Menu({ iniciarJogo }: MenuProps) {
  const [indice, setIndice] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const estrelas = Array.from({ length: estrelasQtd }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.2,
  }));

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const moverEstrelas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      estrelas.forEach((estrela) => {
        estrela.y += estrela.speed;
        if (estrela.y > window.innerHeight) {
          estrela.y = 0;
          estrela.x = Math.random() * window.innerWidth;
        }
        ctx.beginPath();
        ctx.arc(estrela.x, estrela.y, estrela.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      });

      requestAnimationFrame(moverEstrelas);
    };

    moverEstrelas();
  }, []);

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setIndice((prev) => (prev > 0 ? prev - 1 : prev));
      if (e.key === 'ArrowDown') setIndice((prev) => (prev < 2 ? prev + 1 : prev));
      if (e.key === ' ') iniciarJogo();
    };

    window.addEventListener('keydown', keyListener);
    return () => window.removeEventListener('keydown', keyListener);
  }, [indice]);

  return (
    <div ref={containerRef} className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute top-0 left-0 z-0"
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-10 px-4">
        <motion.h1
          className="text-6xl font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-xl"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Star Leap
        </motion.h1>

        <motion.div
          className="flex flex-col gap-5 mt-8 w-full max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {opcoes.map((opcao, i) => (
            <motion.button
              key={opcao}
              onClick={() => {
                setIndice(i);
                iniciarJogo();
              }}
              whileHover={{ scale: 1.05 }}
              className={`py-3 text-xl font-medium border rounded-lg transition-all duration-300 shadow-md ${
                indice === i
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 border-transparent scale-105 text-white shadow-lg'
                  : 'bg-black border-white hover:border-cyan-300'
              }`}
            >
              {opcao}
            </motion.button>
          ))}
        </motion.div>

        <motion.p
          className="mt-12 text-sm text-gray-400 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Use ↑ ↓ para selecionar — Espaço ou clique para iniciar
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        © 2025 Matheus Brehm · Powered by React + Tailwind + Framer Motion
      </motion.div>
    </div>
  );
}
