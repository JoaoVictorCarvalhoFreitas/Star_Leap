import { useEffect, useRef } from 'react';

interface Estrela {
  x: number;
  y: number;
  tamanho: number;
  velocidade: number;
}

export default function Estrela({ quantidade }: { quantidade: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const estrelasRef = useRef<Estrela[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ajustarTamanho = () => {
      canvas.width = 3000;
      canvas.height = window.innerHeight * 0.99;
    };
    

    const gerarEstrelas = () => {
      const largura = canvas.width;
      const altura = canvas.height;
      estrelasRef.current = Array.from({ length: quantidade }).map(() => ({
        x: Math.random() * largura,
        y: Math.random() * altura,
        tamanho: Math.random() * 1.5 + 0.5,
        velocidade: Math.random() * 0.2 + 0.1,
      }));
    };

    const desenhar = () => {
      const largura = canvas.width;
      const altura = canvas.height;
      ctx.clearRect(0, 0, largura, altura);
      ctx.fillStyle = '#ffffff';

      estrelasRef.current.forEach((estrela) => {
        ctx.beginPath();
        ctx.arc(estrela.x, estrela.y, estrela.tamanho, 0, Math.PI * 2);
        ctx.fill();

        estrela.y += estrela.velocidade;
        if (estrela.y > altura) {
          estrela.y = 0;
          estrela.x = Math.random() * largura;
        }
      });

      requestAnimationFrame(desenhar);
    };

    const iniciar = () => {
      ajustarTamanho();
      gerarEstrelas();
      desenhar();
    };

    iniciar();
    window.addEventListener('resize', iniciar);
    return () => window.removeEventListener('resize', iniciar);
  }, [quantidade]);

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
