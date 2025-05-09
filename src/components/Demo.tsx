import { useEffect, useRef, useState } from "react";
import Planeta from "./Planeta";
import Satelite from "./Satelite";

export default function Demo({ onFim }: { onFim: () => void }) {
  const fase = [
    {
      id: 0,
      x: 200,
      y: 300,
      raio: 30,
      cor: "#4e9cff",
      anel: false,
      nome: "Terra",
    },
    {
      id: 1,
      x: 500,
      y: 350,
      raio: 35,
      cor: "#e0c07c",
      anel: false,
      nome: "Vênus",
    },
    {
      id: 2,
      x: 800,
      y: 250,
      raio: 40,
      cor: "#ffcc00",
      anel: true,
      nome: "Paraguai",
    },
  ];

  const [estado, setEstado] = useState<"orbitando" | "pulando">("orbitando");
  const [planetaAtual, setPlanetaAtual] = useState(0);
  const [angulo, setAngulo] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [vel, setVel] = useState({ x: 0, y: 0 });
  const [espaco, setEspaco] = useState(false);

  const animRef = useRef(0);

  //   const getProximoPlaneta = (idAtual: number) => {
  //     return fase.find((p) => p.id === idAtual + 1) || null;
  //   };
  const mostraEspaco = () => {
    setEspaco(true);
    setTimeout(() => {
      setEspaco(false);
    }, 500);
  };
  const handleDisparo = () => {
    if (estado === "orbitando") {
      mostraEspaco();
      const planeta = fase[planetaAtual];
      console.log(planeta.x, planeta.y);
      const velocidade = 3.2;
      const vx = Math.cos(angulo + Math.PI) * velocidade;
      const vy = Math.sin(angulo + Math.PI) * velocidade;
      console.log(vx, vy);
      setVel({ x: vx, y: vy });
      setEstado("pulando");
    }
  };

  if (pos.x >= 248 && pos.x <= 249 && pos.y >= 310 && pos.y <= 311) {
    console.log(pos.x, pos.y);
    handleDisparo();
  }
  if (pos.x >= 550 && pos.x <= 551 && pos.y >= 325 && pos.y <= 328) {
    handleDisparo();
  }

  useEffect(() => {
    const update = () => {
      const planeta = fase[planetaAtual];
      if (!planeta) return;

      if (estado === "orbitando") {
        const novoAngulo = angulo + 0.015;
        const raioOrbita = planeta.raio + 20;
        const x = planeta.x + Math.cos(novoAngulo + Math.PI) * raioOrbita;
        const y = planeta.y + Math.sin(novoAngulo + Math.PI) * raioOrbita;

        setAngulo(novoAngulo);
        setPos({ x, y });
      }

      if (estado === "pulando") {
        const novaX = pos.x + vel.x;
        const novaY = pos.y + vel.y;

        const planetaColidido = fase.find((p) => {
          const dx = novaX - p.x;
          const dy = novaY - p.y;
          return Math.sqrt(dx * dx + dy * dy) < p.raio + 10;
        });

        if (planetaColidido) {
          const id = planetaColidido.id;
          setPlanetaAtual(id);
          setAngulo(
            Math.atan2(novaY - planetaColidido.y, novaX - planetaColidido.x)
          );

          if (id === 2) {
            setTimeout(onFim, 1200);
          } else {
            setTimeout(() => {
              setEstado("orbitando");
            }, 600);
          }
        } else {
          setPos({ x: novaX, y: novaY });
        }
      }

      animRef.current = requestAnimationFrame(update);
    };

    animRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animRef.current);
  }, [estado, pos, vel, angulo, planetaAtual]);

  return (
    <div
      style={{
        position: "relative",
        width: "99vw",
        height: "97vh",
        background: "black",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: 0,
          right: 0,
          textAlign: "center",
          color: "blue",
          fontSize: "1.5rem",
          fontWeight: 500,
          zIndex: 20,
          fontFamily: "sans-serif",
        }}
      >
        Tente chegar no ate o fim do caminho mas cuidado para nao sair de orbita
      </div>

      {espaco && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "blue",
            fontSize: "1.5rem",
            fontWeight: 500,
            zIndex: 20,
            fontFamily: "sans-serif",
          }}
        >
          Espaco
        </div>
      )}
      {fase.map((p, index) => (
        <Planeta key={index} {...p} visivel />
      ))}
      {estado === "orbitando" && (
        <div
          style={{
            position: "absolute",
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: `rotate(${angulo - Math.PI / 2}rad)`,
            transformOrigin: "bottom center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "16px solid #ffffffaa",
              transform: "translate(-8px, -30px)",
            }}
          />
        </div>
      )}
      <Satelite
        x={pos.x}
        y={pos.y}
        angulo={angulo}
        emOrbita={estado === "orbitando"}
        emMovimento={estado === "pulando"}
        onColidir={() => {}}
      />
    </div>
  );
}
