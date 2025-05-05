import { useEffect, useRef, useState } from 'react';

interface Planeta {
  nome: string;
  cor: string;
  anel: boolean;
  x: number;
  y: number;
  raio: number;
}

interface GameProps {
  voltarMenu: () => void;
}

const planetasData = [
  { nome: 'Mercury', cor: '#a8a8a8', anel: false },
  { nome: 'Venus', cor: '#ffcc66', anel: false },
  { nome: 'Earth', cor: '#64b5f6', anel: false },
  { nome: 'Mars', cor: '#f66', anel: false },
  { nome: 'Jupiter', cor: '#e0b084', anel: true },
  { nome: 'Saturn', cor: '#eddc8b', anel: true },
  { nome: 'Uranus', cor: '#96d6ff', anel: true },
  { nome: 'Neptune', cor: '#6495ed', anel: true },
  { nome: 'Pluto', cor: '#ccc', anel: false },
];

export default function Game({ voltarMenu }: GameProps) {
  const [planetas, setPlanetas] = useState<Planeta[]>([]);
  const [tempo, setTempo] = useState(180);
  const [saltos, setSaltos] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [satellitePos, setSatellitePos] = useState({ x: 100, y: 100 });
  const [angulo, setAngulo] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    gerarPlanetas();
    const loop = setInterval(() => setTempo((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(loop);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;

    function desenhar() {
      if (!ctx || !canvas) return;

      // Limpando o canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenhando fundo
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhando planetas
      planetas.forEach((p) => desenharPlaneta(ctx, p));

      // Desenhando o HUD
      desenharHUD(ctx);

      // Desenhando game over
      if (gameOver) desenharGameOver(ctx);

      requestAnimationFrame(desenhar);
    }

    desenhar();
  }, [planetas, tempo, saltos, gameOver]);

  function desenharPlaneta(ctx: CanvasRenderingContext2D, p: Planeta) {
    ctx.beginPath();
    ctx.fillStyle = p.cor;
    ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2);
    ctx.fill();
    if (p.anel) {
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.raio * 1.5, p.raio * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#fff';
    ctx.font = '12px Courier';
    ctx.textAlign = 'center';
    ctx.fillText(p.nome, p.x, p.y - p.raio - 10);
  }

  function desenharHUD(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#fff';
    ctx.font = '18px Courier';
    ctx.textAlign = 'left';
    ctx.fillText(`🛰 Saltos: ${saltos}`, 20, 30);
    ctx.fillText(`⏱ Tempo: ${tempo}s`, 20, 60);
  }

  function desenharGameOver(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '32px Courier';
    ctx.fillText('🚀 Fim de Jogo 🚀', 400, 250);
    ctx.font = '20px Courier';
    ctx.fillText(`Saltos: ${saltos}`, 400, 300);
    ctx.fillText(`Tempo Restante: ${tempo}s`, 400, 340);
    ctx.fillText('Pressione Enter para voltar ao menu', 400, 400);
  }

  function gerarPlanetas() {
    const lista: Planeta[] = [];
    let x = 150;
    for (let i = 0; i < planetasData.length; i++) {
      const info = planetasData[i];
      const y = Math.random() * 300 + 150;
      const raio = 40 + i * 2;
      lista.push({ ...info, x, y, raio });
      x += 180;
    }
    setPlanetas(lista);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && gameOver) voltarMenu(); // Volta para o menu ao pressionar Enter
    if (e.key === ' ') realizarPulo();
  }

  function realizarPulo() {
    if (gameOver) return;
    setSaltos((prev) => prev + 1);
    if (saltos + 1 >= planetas.length) {
      setGameOver(true);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saltos, gameOver]);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} width={800} height={600} className="rounded-xl shadow-xl" />
    </div>
  );
}
