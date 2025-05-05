import { useEffect, useRef } from 'react';

interface PlanetaProps {
  x: number;
  y: number;
  raio: number;
  cor: string;
  anel?: boolean;
  nome?: string;
  visivel: boolean;
}

export default function Planeta({ x, y, raio, cor, anel = false, nome = '', visivel }: PlanetaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visivel) return;

    canvas.width = raio * 4;
    canvas.height = raio * 4;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // planeta principal
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.arc(0, 0, raio, 0, Math.PI * 2);
    ctx.fill();

    // anel
    if (anel) {
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 0, raio * 1.5, raio * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // nome
    ctx.fillStyle = '#ffffffcc';
    ctx.font = '12px Courier';
    ctx.textAlign = 'center';
    ctx.fillText(nome, 0, -raio - 10);

    ctx.restore();
  }, [x, y, raio, cor, anel, nome, visivel]);

  if (!visivel) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x - raio * 2}px`,
        top: `${y - raio * 2}px`,
        width: raio * 4,
        height: raio * 4,
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
