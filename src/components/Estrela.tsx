import { useEffect, useRef } from 'react';

interface EstrelaProps {
  quantidade: number;
  largura: number;
  altura: number;
}

interface Estrela {
  x: number;
  y: number;
  tamanho: number;
  velocidade: number;
}

export default function Estrela({ quantidade, largura, altura }: EstrelaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const estrelasRef = useRef<Estrela[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = largura;
    canvas.height = altura;

    estrelasRef.current = Array.from({ length: quantidade }).map(() => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      tamanho: Math.random() * 1.5 + 0.5,
      velocidade: Math.random() * 0.2 + 0.1,
    }));

    const desenhar = () => {
      ctx.clearRect(0, 0, largura, altura);
      ctx.fillStyle = 'white';
      estrelasRef.current.forEach((estrela) => {
        ctx.beginPath();
        ctx.arc(estrela.x, estrela.y, estrela.tamanho, 0, Math.PI * 2);
        ctx.fill();

        estrela.y += estrela.velocidade;
        if (estrela.y > altura) estrela.y = 0;
      });

      requestAnimationFrame(desenhar);
    };

    desenhar();
  }, [quantidade, largura, altura]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
