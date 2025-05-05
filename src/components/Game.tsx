import React, { useEffect, useState } from 'react';
import Planeta from './Planeta';

const PLANETAS = [
  { nome: 'Planeta 1', x: 300, y: 300, raio: 50 },
  { nome: 'Planeta 2', x: 700, y: 200, raio: 60 },
  { nome: 'Planeta 3', x: 500, y: 500, raio: 70 },
  { nome: 'Final', x: 900, y: 300, raio: 80 },
];

const Game: React.FC = () => {
  const [emOrbita, setEmOrbita] = useState(true);
  const [planetaAtual, setPlanetaAtual] = useState(0);
  const [angulo, setAngulo] = useState(0);
  const [pos, setPos] = useState({ x: PLANETAS[0].x + PLANETAS[0].raio + 10, y: PLANETAS[0].y });
  const [vel, setVel] = useState({ x: 0, y: 0 });
  const [saltos, setSaltos] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [vitoria, setVitoria] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && emOrbita && !gameOver && !vitoria) {
        const velocidade = 5;
        const vx = -Math.sin(angulo) * velocidade;
        const vy = Math.cos(angulo) * velocidade;
        setVel({ x: vx, y: vy });
        setEmOrbita(false);
        setSaltos(s => s + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [angulo, emOrbita, gameOver, vitoria]);

  useEffect(() => {
    let animationId: number;

    const update = () => {
      const planeta = PLANETAS[planetaAtual];

      if (emOrbita) {
        const novoAngulo = angulo + 0.02;
        const raioOrbita = planeta.raio + 10;
        const x = planeta.x + Math.cos(novoAngulo) * raioOrbita;
        const y = planeta.y + Math.sin(novoAngulo) * raioOrbita;
        setAngulo(novoAngulo);
        setPos({ x, y });
      } else {
        const novaX = pos.x + vel.x;
        const novaY = pos.y + vel.y;
        let colidiu = false;

        for (let i = 0; i < PLANETAS.length; i++) {
          const p = PLANETAS[i];
          const dx = novaX - p.x;
          const dy = novaY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < p.raio + 5) {
            setPlanetaAtual(i);
            setEmOrbita(true);
            setAngulo(0);
            colidiu = true;
            if (p.nome === 'Final') setVitoria(true);
            break;
          }
        }

        if (!colidiu) {
          setPos({ x: novaX, y: novaY });
          if (novaX < 0 || novaX > 1000 || novaY < 0 || novaY > 600) {
            setGameOver(true);
          }
        }
      }

      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [emOrbita, pos, vel, angulo, planetaAtual, gameOver, vitoria]);

  return (
    <div style={{ position: 'relative', width: 1000, height: 600, background: 'black', overflow: 'hidden' }}>
      {/* Fundo de estrelas */}
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: Math.random() * 600,
            left: Math.random() * 1000,
            width: 2,
            height: 2,
            backgroundColor: 'white',
          }}
        />
      ))}

      {/* Planetass */}
      {PLANETAS.map((p, index) => (
        <Planeta key={index} planeta={p} />
      ))}

      {/* Satélite */}
      <div
        style={{
          position: 'absolute',
          top: pos.y - 5,
          left: pos.x - 5,
          width: 10,
          height: 10,
          backgroundColor: 'white',
          borderRadius: '50%',
        }}
      />

      {/* HUD */}
      <div style={{ color: 'white', position: 'absolute', top: 10, left: 10 }}>
        Saltos: {saltos} {gameOver && ' | GAME OVER'} {vitoria && ' | CHEGOU AO FINAL!'}
      </div>
    </div>
  );
};

export default Game;