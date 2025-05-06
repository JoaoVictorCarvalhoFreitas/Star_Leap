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

    const aumento = 1.4;
    const novoRaio = raio * aumento;

    canvas.width = novoRaio * 4;
    canvas.height = novoRaio * 4;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // brilho realista
    const gradient = ctx.createRadialGradient(0, 0, novoRaio * 0.3, 0, 0, novoRaio);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.2, cor);
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, novoRaio, 0, Math.PI * 2);
    ctx.fill();

    // anel (se tiver)
    if (anel) {
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, novoRaio * 1.6, novoRaio * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // nome
    ctx.fillStyle = '#ffffffcc';
    ctx.font = 'bold 13px Courier';
    ctx.textAlign = 'center';
    ctx.fillText(nome, 0, -novoRaio - 14);

    ctx.restore();
  }, [x, y, raio, cor, anel, nome, visivel]);

  if (!visivel) return null;

  const aumento = 1.4;
  const novoRaio = raio * aumento;

  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: `${x - novoRaio * 2}px`,
        top: `${y - novoRaio * 2}px`,
        width: novoRaio * 4,
        height: novoRaio * 4,
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
