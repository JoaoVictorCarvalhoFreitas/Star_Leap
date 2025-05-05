import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface CreditosProps {
  voltar: () => void;
}

export default function Creditos({ voltar }: CreditosProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') voltar(); // Voltar para o menu ao pressionar Enter
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [voltar]);

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center text-white text-center px-4">
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🚀 Créditos Finais
      </motion.h1>

      <motion.div
        className="space-y-3 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p>Desenvolvido por <span className="text-blue-400 font-semibold">Matheus Brehm</span></p>
        <p>Projeto acadêmico usando <span className="text-pink-400 font-semibold">React + TypeScript</span></p>
        <p>Trilha sonora por <span className="text-yellow-300">Pixabay Audio</span></p>
        <p>Gráficos e lógica: <span className="text-green-300">100% customizados</span></p>
      </motion.div>

      <motion.button
        onClick={voltar} // Função voltar chamada ao clicar
        className="mt-10 px-6 py-2 bg-white text-black rounded-xl text-lg font-bold hover:bg-gray-300 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Voltar ao Menu (Enter)
      </motion.button>
    </div>
  );
}
