import React from "react";
import { cn } from "../../lib/utils";

export interface SparklesCoreProps extends React.HTMLAttributes<HTMLCanvasElement> {
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  velocityX: number;
  velocityY: number;
}

export const SparklesCore: React.FC<SparklesCoreProps> = ({
  background = "transparent",
  minSize = 0.5,
  maxSize = 1.2,
  particleDensity = 120,
  className,
  particleColor = "#ffffff",
  ...props
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const particles = React.useRef<Particle[]>([]);
  const animationRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const initParticles = () => {
      particles.current = Array.from({ length: particleDensity }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (maxSize - minSize) + minSize,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
      }));
    };

    const updateParticles = () => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      particles.current.forEach((p) => {
        p.x += p.velocityX;
        p.y += p.velocityY;

        if (p.x < 0 || p.x > width) p.velocityX *= -1;
        if (p.y < 0 || p.y > height) p.velocityY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(updateParticles);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    initParticles();
    updateParticles();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [background, minSize, maxSize, particleDensity, particleColor]);

  return (
    <canvas
      {...props}
      className={cn("absolute inset-0 w-full h-full", className)}
      style={{ background }}
      ref={canvasRef}
    />
  );
};
