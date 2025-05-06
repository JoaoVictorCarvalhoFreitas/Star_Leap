import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MenuProps {
  iniciarJogo: (dificuldade: string) => void;
}

const opcoes = ['Fácil', 'Médio', 'Difícil'];

export default function Menu({ iniciarJogo }: MenuProps) {
  const [indice, setIndice] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const estrelas = useRef<{ x: number; y: number; size: number; speed: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/sounds/space.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
  }, []);

  const iniciarSomEFase = (dificuldade: string) => {
    audioRef.current?.play();
    iniciarJogo(dificuldade);
  };

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setIndice((prev) => (prev > 0 ? prev - 1 : prev));
      if (e.key === 'ArrowDown') setIndice((prev) => (prev < opcoes.length - 1 ? prev + 1 : prev));
      if (e.key === ' ') iniciarSomEFase(opcoes[indice]);
    };
    window.addEventListener('keydown', keyListener);
    return () => window.removeEventListener('keydown', keyListener);
  }, [indice]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    estrelas.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.4 + 0.2,
    }));

    const animar = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';

      estrelas.current.forEach((estrela) => {
        estrela.y += estrela.speed;
        if (estrela.y > canvas.height) {
          estrela.y = 0;
          estrela.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(estrela.x, estrela.y, estrela.size, 0, 2 * Math.PI);
        ctx.fill();
      });

      requestAnimationFrame(animar);
    };
    animar();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const styles = {
    container: {
      width: '99vw',
      height: '97.7vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontFamily: 'sans-serif',
      position: 'relative' as const,
    },
    canvas: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
    },
    inner: {
      maxWidth: '1000px',
      width: '100%',
      padding: '0 20px',
      textAlign: 'center' as const,
      position: 'relative' as const,
      zIndex: 1,
    },
    title: {
      fontSize: '4rem',
      fontWeight: 'bold' as const,
      background: 'linear-gradient(to right, #06b6d4, #a855f7)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '40px',
    },
    button: (active: boolean) => ({
      padding: '14px 24px',
      margin: '10px',
      fontSize: '1.2rem',
      fontWeight: 600,
      borderRadius: '12px',
      border: active ? 'none' : '1px solid #aaa',
      background: active ? 'linear-gradient(to right, #9333ea, #06b6d4)' : 'rgba(255,255,255,0.1)',
      color: 'white',
      cursor: 'pointer',
      transition: 'transform 0.2s, background 0.3s',
      transform: active ? 'scale(1.05)' : 'scale(1)',
    }),
    hint: {
      marginTop: '30px',
      fontSize: '0.9rem',
      color: '#888',
    },
    rodape: {
      position: 'absolute' as const,
      bottom: '10px',
      fontSize: '0.75rem',
      color: '#666',
      zIndex: 1,
    },
  };

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>

      <div style={styles.inner}>
        <motion.h1
          style={styles.title}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Star Leap
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          {opcoes.map((opcao, i) => (
            <motion.button
              key={opcao}
              onClick={() => iniciarSomEFase(opcao)}
              whileHover={{ scale: 1.07 }}
              style={styles.button(indice === i)}
            >
              {opcao}
            </motion.button>
          ))}
        </motion.div>

        <motion.p
          style={styles.hint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Use ↑ ↓ para escolher · Espaço ou clique para iniciar
        </motion.p>
      </div>

      <motion.div
        style={styles.rodape}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        © 2025 Matheus Brehm · React + Framer Motion
      </motion.div>
    </div>
  );
}
