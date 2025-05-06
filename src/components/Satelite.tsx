import { useEffect, useRef } from 'react';

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

    canvas.width = 40;
    canvas.height = 40;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(20, 20); // centro do canvas
    ctx.rotate(angulo);

    // Corpo do satélite
    ctx.fillStyle = '#aaa';
    ctx.fillRect(-5, -8, 10, 16);

    // Painéis solares
    ctx.fillStyle = '#3399ff';
    ctx.fillRect(-15, -7, 10, 14); // esquerdo
    ctx.fillRect(5, -7, 10, 14);   // direito

    // Conectores
    ctx.strokeStyle = '#ffffffaa';
    ctx.beginPath();
    ctx.moveTo(-5, -7);
    ctx.lineTo(-5, 7);
    ctx.moveTo(5, -7);
    ctx.lineTo(5, 7);
    ctx.stroke();

    // Sensor superior
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, -10, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    if ((x < 0 || y < 0 || y > 600) && emMovimento) {
      onColidir();
    }
  }, [x, y, angulo, emOrbita, emMovimento, onColidir]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x - 20}px`,
        top: `${y - 20}px`,
        width: 40,
        height: 40,
        transform: emOrbita ? 'scale(1)' : 'scale(1.1)',
        transition: 'transform 0.2s ease',
        zIndex: 10,
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
