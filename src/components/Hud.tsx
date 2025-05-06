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

  return (
    <div
      className="absolute top-6 left-6 z-50 rounded-xl border border-white/30 shadow-xl"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        backdropFilter: 'blur(4px)',
        maxWidth: '240px',
        padding: '16px 20px',
      }}
    >
      <div className="flex flex-col gap-3 text-base leading-tight">
        <p className="font-semibold drop-shadow">
          Saltos: <span className="text-blue-300 font-bold">{saltos}</span>
        </p>
        <p
          className={`font-semibold drop-shadow ${
            piscando ? 'text-red-400 animate-pulse' : 'text-green-300'
          }`}
        >
          Tempo: <span className="font-bold">{tempoRestante}s</span>
        </p>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-500"
            style={{ width: `${(tempoRestante / 180) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
