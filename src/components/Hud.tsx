import { useEffect, useState } from 'react';

interface HudProps {
  tempo: number;
  saltos: number;
  gameOver: boolean;
  vitoria: boolean;
}

export default function Hud({ tempo, saltos, gameOver, vitoria }: HudProps) {
  const [tempoRestante, setTempoRestante] = useState(tempo);
  const [piscando, setPiscando] = useState(false);

  useEffect(() => {
    if (gameOver || vitoria) return;

    const intervalo = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [gameOver, vitoria]);

  useEffect(() => {
    setPiscando(tempoRestante <= 15);
  }, [tempoRestante]);

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 50,
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    backdropFilter: 'blur(4px)',
    maxWidth: '240px',
    padding: '16px 20px',
    fontFamily: 'sans-serif',
    boxShadow: '0 0 20px rgba(0,0,0,0.4)',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
    marginBottom: '8px',
    fontSize: '15px',
  };

  const valorStyle: React.CSSProperties = {
    fontWeight: 700,
    color: '#38bdf8',
    marginLeft: '5px',
  };

  const tempoStyle: React.CSSProperties = {
    ...labelStyle,
    color: piscando ? '#f87171' : '#6ee7b7',
    animation: piscando ? 'pulse 1s infinite' : 'none',
  };

  const barraExterna: React.CSSProperties = {
    width: '100%',
    height: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '10px',
  };

  const barraInterna: React.CSSProperties = {
    height: '100%',
    background: 'linear-gradient(to right, #60a5fa, #06b6d4)',
    width: `${(tempoRestante / 180) * 100}%`,
    transition: 'width 0.5s ease',
  };

  return (
    <div style={containerStyle}>
      <div>
        <p style={labelStyle}>
          Saltos:
          <span style={valorStyle}>{saltos}</span>
        </p>
        <p style={tempoStyle}>
          Tempo:
          <span style={{ fontWeight: 700, marginLeft: '5px' }}>{tempoRestante}s</span>
        </p>
        <div style={barraExterna}>
          <div style={barraInterna}></div>
        </div>
      </div>
    </div>
  );
}
