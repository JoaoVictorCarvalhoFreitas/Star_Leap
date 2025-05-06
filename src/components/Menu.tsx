import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesCore } from '../components/ui/sparkles';

interface MenuProps {
  iniciarJogo: (dificuldade: string) => void;
}

const opcoes = ['Fácil', 'Médio', 'Difícil'];

export default function Menu({ iniciarJogo }: MenuProps) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setIndice((prev) => (prev > 0 ? prev - 1 : prev));
      if (e.key === 'ArrowDown') setIndice((prev) => (prev < opcoes.length - 1 ? prev + 1 : prev));
      if (e.key === ' ') iniciarJogo(opcoes[indice]);
    };

    window.addEventListener('keydown', keyListener);
    return () => window.removeEventListener('keydown', keyListener);
  }, [indice]);

  return (
    <div className="relative h-screen w-screen bg-black text-white overflow-hidden">
      <SparklesCore
        background="transparent"
        minSize={0.5}
        maxSize={1.5}
        particleDensity={100}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        particleColor="#ffffff"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-xl mb-8"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Star Leap
        </motion.h1>

        <motion.div
          className="flex flex-col gap-6 w-full max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {opcoes.map((opcao, i) => (
            <motion.button
              key={opcao}
              onClick={() => iniciarJogo(opcao)}
              whileHover={{ scale: 1.05 }}
              className={`py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md ${
                indice === i
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white scale-105 shadow-lg'
                  : 'bg-white/10 text-white border border-white/30 hover:border-cyan-300'
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
          transition={{ delay: 1.5 }}
        >
          Use ↑ ↓ para escolher · Espaço ou clique para iniciar
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        © 2025 Matheus Brehm · Powered by React + Tailwind + Framer Motion
      </motion.div>
    </div>
  );
}
