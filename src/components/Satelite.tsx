import { useEffect, useRef, useState } from 'react';

interface SateliteProps {
  x: number;
  y: number;
  angulo: number;
  emOrbita: boolean;
  onColidir: () => void;
  emMovimento: boolean;
}

export default function Satelite({ x, y, angulo, emOrbita, onColidir, emMovimento }: SateliteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 100; // Tamanho do canvas do satélite
    canvas.height = 100;

    // Limpar o canvas e desenhar o satélite
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(50, 50); // Centralizando o satélite no centro do canvas
    ctx.rotate(angulo);

    // Desenhando as camadas do satélite
    for (let i = 10; i > 0; i--) {
      ctx.fillStyle = `rgba(200,200,200,${i / 10})`;
      ctx.beginPath();
      ctx.arc(0, 0, i, 0, Math.PI * 2);
      ctx.fill();
    }

    // Corpo central do satélite
    ctx.fillStyle = '#aaa';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    // Antenas do satélite
    ctx.fillStyle = '#3399ff';
    ctx.fillRect(-24, -4, 8, 8);
    ctx.fillRect(16, -4, 8, 8);

    // Desenhando as linhas de conexão
    ctx.strokeStyle = '#ffffff88';
    ctx.beginPath();
    ctx.moveTo(-20, -4);
    ctx.lineTo(-20, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20, -4);
    ctx.lineTo(20, 4);
    ctx.stroke();

    // Desenhando o cabo que conecta o satélite
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -17, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Verificando se o satélite saiu da tela ou colidiu
    if (y > 500 && emMovimento) {
      onColidir(); // Chama a função de colisão quando necessário
    }
  }, [x, y, angulo, emOrbita, emMovimento, onColidir]); // Dependências do hook

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x - 50}px`, // Ajustando a posição horizontal
        top: `${y - 50}px`,  // Ajustando a posição vertical
        width: 100,
        height: 100,
        transform: emOrbita ? 'scale(1.0)' : 'scale(1.1)',  // Efeito de orbita
        transition: 'transform 0.2s ease'  // Suavização da transição
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

