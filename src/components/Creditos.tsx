import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface CreditosProps {
  voltar: () => void;
}

export default function Creditos({ voltar }: CreditosProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') voltar();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [voltar]);

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-black via-gray-800 to-black flex flex-col items-center justify-center text-white text-center px-4">
      <motion.h1
        className="text-5xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🚀 Créditos Finais
      </motion.h1>

      <motion.div
        className="space-y-4 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <p>
          Desenvolvido por <span className="text-blue-400 font-semibold">Matheus Brehm</span>
        </p>
        <p>
          Projeto acadêmico com <span className="text-pink-400 font-semibold">React + TypeScript</span>
        </p>
        <p>
          Trilha sonora por <span className="text-yellow-300">Pixabay Audio</span>
        </p>
        <p>
          Gráficos e lógica: <span className="text-green-300 font-medium">100% customizados</span>
        </p>
      </motion.div>

      <motion.button
        onClick={voltar}
        className="mt-12 px-6 py-3 bg-white text-black rounded-xl text-lg font-bold shadow-md hover:bg-gray-300 transition"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        Voltar ao Menu (Enter)
      </motion.button>
    </div>
  );
}
