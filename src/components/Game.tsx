import React, { useEffect, useState, useRef } from 'react';
import Planeta from './Planeta';
import Satelite from './Satelite';
import Hud from './Hud';
import Creditos from './Creditos';
import Estrela from './Estrela';

interface GameProps {
  dificuldade: string;
  voltarMenu: () => void;
  encerrar: (tempoRestante: number, saltos: number, gameOver: boolean) => void;
}

const PLANETAS = [
  { nome: 'Mercúrio', x: 200, y: 250, raio: 15, cor: '#b0b0b0', anel: false },
  { nome: 'Vênus', x: 400, y: 400, raio: 25, cor: '#e0c07c', anel: false },
  { nome: 'Terra', x: 650, y: 200, raio: 28, cor: '#4e9cff', anel: false },
  { nome: 'Marte', x: 850, y: 450, raio: 22, cor: '#c1440e', anel: false },
  { nome: 'Júpiter', x: 1100, y: 300, raio: 45, cor: '#d2b48c', anel: false },
  { nome: 'Saturno', x: 1400, y: 150, raio: 40, cor: '#f5deb3', anel: true },
  { nome: 'Urano', x: 1700, y: 360, raio: 35, cor: '#afeeee', anel: true },
  { nome: 'Netuno', x: 2000, y: 220, raio: 35, cor: '#4169e1', anel: false },
  { nome: 'Plutão', x: 2250, y: 420, raio: 18, cor: '#ccc1b7', anel: false },
  { nome: 'Zorion', x: 2600, y: 300, raio: 50, cor: '#ffcc00', anel: false },
];

const Game: React.FC<GameProps> = ({ dificuldade, voltarMenu, encerrar }) => {
  const [emOrbita, setEmOrbita] = useState(true);
  const [planetaAtual, setPlanetaAtual] = useState(0);
  const [angulo, setAngulo] = useState(0);
  const [pos, setPos] = useState({ x: PLANETAS[0].x + PLANETAS[0].raio + 10, y: PLANETAS[0].y });
  const [vel, setVel] = useState({ x: 0, y: 0 });
  const [saltos, setSaltos] = useState(0);
  const [tempo, setTempo] = useState(dificuldade === 'Fácil' ? 180 : dificuldade === 'Médio' ? 120 : 60);
  const [gameOver, setGameOver] = useState(false);
  const [vitoria, setVitoria] = useState(false);
  const [cameraX, setCameraX] = useState(0);

  const contextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Record<string, AudioBuffer>>({});
  const loopedSounds = useRef<Record<string, AudioBufferSourceNode | null>>({ ambient: null, vitoria: null });

  const playSound = (name: string, volume = 1, loop = false) => {
    const context = contextRef.current;
    const buffer = buffersRef.current[name];
    if (!context || !buffer) return;

    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = loop;
    gain.gain.value = volume;

    source.connect(gain);
    gain.connect(context.destination);
    source.start(0);

    if (loop) {
      loopedSounds.current[name]?.stop();
      loopedSounds.current[name] = source;
    }
  };

  const resetarAudioContext = () => {
    const context = contextRef.current;
    if (context && context.state !== 'closed') {
      context.close();
    }
    contextRef.current = null;
    loopedSounds.current = { ambient: null, vitoria: null };
  };

  useEffect(() => {
    const loadAllSounds = async () => {
      if (!contextRef.current || contextRef.current.state === 'closed') {
        contextRef.current = new AudioContext();
      }
      const context = contextRef.current;

      const loadSound = async (name: string, url: string) => {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = await context.decodeAudioData(arrayBuffer);
        buffersRef.current[name] = buffer;
      };

      await Promise.all([
        loadSound('jump', '/sounds/jump.mp3'),
        loadSound('gameover', '/sounds/gameover.mp3'),
        loadSound('ambient', '/sounds/space.mp3'),
        loadSound('vitoria', '/sounds/vitoria.mp3')
      ]);

      playSound('ambient', 0.3, true);
    };

    loadAllSounds();
    return () => {
      resetarAudioContext();
    };
  }, []);

  useEffect(() => {
    if (vitoria && !gameOver) playSound('vitoria', 0.7, true);
  }, [vitoria, gameOver]);

  const handleDisparo = () => {
    if (emOrbita && !gameOver && !vitoria) {
      playSound('jump', 0.9);
      const velocidade = 5;
      const vx = -Math.sin(angulo) * velocidade;
      const vy = Math.cos(angulo) * velocidade;
      setVel({ x: vx, y: vy });
      setEmOrbita(false);
      setSaltos(s => s + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') handleDisparo();
    };
    const handleMouseDown = () => handleDisparo();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [angulo, emOrbita, gameOver, vitoria]);

  useEffect(() => {
    if (gameOver || vitoria) return;
    const intervalo = setInterval(() => {
      setTempo(prev => {
        if (prev <= 1) {
          clearInterval(intervalo);
          playSound('gameover');
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [gameOver, vitoria]);

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
            if (p.nome === 'Zorion') {
              setVitoria(true);
            }
            break;
          }
        }

        if (!colidiu) {
          setPos({ x: novaX, y: novaY });
          if (novaX < 0 || novaY < 0 || novaY > 580) {
            playSound('gameover');
            setGameOver(true);
          }
        }
      }

      setCameraX(pos.x - 100);
      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [emOrbita, pos, vel, angulo, planetaAtual, gameOver, vitoria]);

  useEffect(() => {
    if (vitoria || gameOver) {
      const timeout = setTimeout(() => encerrar(tempo, saltos, gameOver), 6000);
      return () => clearTimeout(timeout);
    }
  }, [vitoria, gameOver]);

  const mostrarCreditos = vitoria || gameOver;

  return (
    <div
      style={{
        position: 'relative',
        width: '99vw',
        height: '97.7vh',
        overflow: 'hidden',
        background: 'black',
        fontFamily: 'sans-serif'
      }}
    >
      {!mostrarCreditos && (
        <>
          <div
            style={{
              transform: `translateX(${-cameraX}px)`,
              position: 'absolute',
              width: '3000px',
              height: '97.7vh',
            }}
          >
            <Estrela quantidade={160} />
            {PLANETAS.map((p, index) => (
              <Planeta
                key={index}
                x={p.x}
                y={p.y}
                raio={p.raio}
                cor={p.cor}
                nome={p.nome}
                anel={p.anel}
                visivel={true}
              />
            ))}
            <Satelite
              x={pos.x}
              y={pos.y}
              angulo={angulo}
              emOrbita={emOrbita}
              onColidir={() => {
                playSound('gameover');
                setGameOver(true);
              }}
              emMovimento={!emOrbita}
            />
          </div>

          <Hud tempo={tempo} saltos={saltos} gameOver={gameOver} vitoria={vitoria} />
        </>
      )}

      {mostrarCreditos && (
        <Creditos
          voltar={() => {
            resetarAudioContext();
            setTimeout(() => voltarMenu(), 100);
          }}
          tempoRestante={tempo}
          saltos={saltos}
          gameOver={gameOver}
        />
      )}
    </div>
  );
};

export default Game;
