import { useEffect, useRef } from 'react';

interface EstrelaProps {
  x: number;
  y: number;
  tamanho: number;
  velocidade: number;
}

export default function Estrela({ x, y, tamanho, velocidade }: EstrelaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const yRef = useRef(y);
  const animationRef = useRef<number | null>(null);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = tamanho * 2;
    canvas.height = tamanho * 2;

    const desenhar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(tamanho, yRef.current % canvas.height, tamanho, 0, Math.PI * 2);
      ctx.fill();
      yRef.current += velocidade;
      animationRef.current = requestAnimationFrame(desenhar);
    };

    desenhar();
    return () => cancelAnimationFrame(animationRef.current!);
  }, [tamanho, velocidade]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none"
      style={{
        left: `${x}px`,
        top: `0px`,
        width: `${tamanho * 2}px`,
        height: `${tamanho * 2}px`,
        position: 'absolute',
        zIndex: 0,
      }}
    />
  );
}
