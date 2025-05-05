import { useEffect, useState } from 'react';

interface HudProps {
  tempo: number;
  saltos: number;
}

export default function Hud({ tempo, saltos }: HudProps) {
  const [tempoRestante, setTempoRestante] = useState(tempo);
  const [piscando, setPiscando] = useState(false);

  useEffect(() => {
    setTempoRestante(tempo);
    setPiscando(tempo <= 15);
  }, [tempo]);

  return (
    <div className="absolute top-6 left-6 z-50 bg-black/60 backdrop-blur p-4 rounded-xl border border-white/20 shadow-md">
      <h2 className="text-white text-xl font-bold">HUD</h2>
      <div className="mt-2">
        <p className="text-white text-sm">Saltos realizados: <span className="font-semibold text-blue-400">{saltos}</span></p>
        <p className={`text-white text-sm transition-all ${piscando ? 'animate-pulse text-red-400' : 'text-green-300'}`}>
          Tempo restante: <span className="font-semibold">{tempoRestante}s</span>
        </p>
      </div>
      <div className="mt-2 w-full bg-white/20 h-2 rounded">
        <div
          className="bg-blue-500 h-2 rounded"
          style={{ width: `${(tempoRestante / 180) * 100}%` }}
        />
      </div>
    </div>
  );
}
