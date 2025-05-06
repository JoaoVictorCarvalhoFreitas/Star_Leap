import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface CreditosProps {
  voltar: () => void;
  tempoRestante: number;
  saltos: number;
  gameOver?: boolean;
}

export default function Creditos({ voltar, tempoRestante, saltos, gameOver = false }: CreditosProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        pararTodosAudios();
        voltar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [voltar]);

  const pararTodosAudios = () => {
    if (typeof window !== 'undefined') {
      const audios = document.querySelectorAll('audio');
      audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });

      const globalCtx = (window as any)._globalAudioContext as AudioContext | undefined;
      if (globalCtx && globalCtx.state !== 'closed') {
        globalCtx.close();
        (window as any)._globalAudioContext = undefined;
      }

      if ((window as any)._loopedSounds) {
        const sounds = (window as any)._loopedSounds as Record<string, AudioBufferSourceNode | null>;
        Object.keys(sounds).forEach((key) => {
          try {
            sounds[key]?.stop();
          } catch {}
        });
        (window as any)._loopedSounds = {};
      }
    }
  };

  const score = Math.max(0, tempoRestante * 10 - saltos * 5);

  const styles = {
    container: {
      width: '99vw',
      height: '97.7vh',
      background: 'linear-gradient(to bottom, #000000, #1f2937, #000000)',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center' as const,
      fontFamily: 'sans-serif',
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: 800,
      marginBottom: '2rem',
      background: 'linear-gradient(to right, #06b6d4, #a855f7)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    content: {
      fontSize: '1.2rem',
      lineHeight: '2rem',
      marginBottom: '2rem',
    },
    highlight: (color: string) => ({
      color,
      fontWeight: 600,
    }),
    score: {
      fontSize: '1.8rem',
      fontWeight: 700,
      color: gameOver ? '#ef4444' : '#facc15',
      marginBottom: '3rem',
    },
    button: {
      padding: '12px 24px',
      fontSize: '1rem',
      fontWeight: 'bold' as const,
      background: '#ffffff',
      color: '#000',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s, background 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      <motion.h1
        style={styles.title}
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🚀 Créditos Finais
      </motion.h1>

      <motion.div
        style={styles.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <p>
          Desenvolvido por <span style={styles.highlight('#3b82f6')}>Matheus Brehm</span>
        </p>
        <p>
          Projeto acadêmico com <span style={styles.highlight('#ec4899')}>React + TypeScript</span>
        </p>
        <p>
          Trilha sonora por <span style={styles.highlight('#facc15')}>Pixabay Audio</span>
        </p>
        <p>
          Gráficos e lógica: <span style={styles.highlight('#4ade80')}>100% customizados</span>
        </p>
      </motion.div>

      <motion.p
        style={styles.score}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {gameOver ? '🚨 GAME OVER 🚨' : `🌟 Score final: ${score} pontos`}
      </motion.p>

      <motion.button
        onClick={() => {
          pararTodosAudios();
          voltar();
        }}
        style={styles.button}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        Voltar ao Menu (Enter)
      </motion.button>
    </div>
  );
}
