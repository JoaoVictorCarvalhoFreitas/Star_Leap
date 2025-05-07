export default function Satelite({ x, y, angulo, emOrbita }: SateliteProps) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x - 20}px`,
        top: `${y - 20}px`,
        width: 40,
        height: 40,
        transform: `rotate(${angulo}rad) scale(${emOrbita ? 1 : 1.1})`,
        transition: "transform 0.2s ease",
        zIndex: 10,
      }}
    >
      <img
        src="/assets/lua.png"
        alt="Satélite"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
