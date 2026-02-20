import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function TechField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let reduced = reduceMotion.matches;
    let interactive = finePointer.matches && !reduced && window.innerWidth >= 1024;
    let lowPower = window.innerWidth < 768 || !interactive;

    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let pointerRaf = 0;

    let particles: Particle[] = [];

    const buildParticles = () => {
      const count = lowPower ? 24 : 48;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (lowPower ? 0.15 : 0.24),
        vy: (Math.random() - 0.5) * (lowPower ? 0.12 : 0.2),
        r: Math.random() * 1.25 + 0.7,
      }));
    };

    const resize = () => {
      width = Math.max(window.innerWidth, 320);
      height = Math.max(window.innerHeight, 320);
      dpr = clamp(window.devicePixelRatio || 1, 1, 1.5);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      lowPower = window.innerWidth < 768 || !interactive;
      buildParticles();
    };

    const onPointerMove = (event: PointerEvent) => {
      const nextX = clamp(event.clientX / width, 0, 1);
      const nextY = clamp(event.clientY / height, 0, 1);
      if (pointerRaf) return;
      pointerRaf = window.requestAnimationFrame(() => {
        targetX = nextX;
        targetY = nextY;
        pointerRaf = 0;
      });
    };

    const updateMode = () => {
      reduced = reduceMotion.matches;
      interactive = finePointer.matches && !reduced && window.innerWidth >= 1024;
      lowPower = window.innerWidth < 768 || !interactive;
      buildParticles();
    };

    const draw = (tick: number) => {
      pointerX += (targetX - pointerX) * 0.06;
      pointerY += (targetY - pointerY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const shiftX = (pointerX - 0.5) * 26;
      const shiftY = (pointerY - 0.5) * 20;
      const step = lowPower ? 76 : 62;

      ctx.strokeStyle = "rgba(132, 196, 255, 0.08)";
      ctx.lineWidth = 1;

      for (let x = -step; x < width + step; x += step) {
        const xx = x + shiftX;
        ctx.beginPath();
        ctx.moveTo(xx, 0);
        ctx.lineTo(xx, height);
        ctx.stroke();
      }
      for (let y = -step; y < height + step; y += step) {
        const yy = y + shiftY;
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(width, yy);
        ctx.stroke();
      }

      const glow = ctx.createRadialGradient(
        pointerX * width,
        pointerY * height,
        0,
        pointerX * width,
        pointerY * height,
        lowPower ? 140 : 240,
      );
      glow.addColorStop(0, "rgba(138, 218, 255, 0.12)");
      glow.addColorStop(1, "rgba(138, 218, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(202, 232, 255, 0.6)";
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;
        if (p.y < -8) p.y = height + 8;
        if (p.y > height + 8) p.y = -8;

        ctx.beginPath();
        ctx.arc(p.x + shiftX * 0.25, p.y + shiftY * 0.25, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) {
        frame = window.requestAnimationFrame(draw);
      } else if (tick === 0) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw(0);

    window.addEventListener("resize", resize, { passive: true });
    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const watchReduce = () => {
      updateMode();
      if (interactive) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
      } else {
        window.removeEventListener("pointermove", onPointerMove);
      }
    };

    reduceMotion.addEventListener("change", watchReduce);
    finePointer.addEventListener("change", watchReduce);

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(pointerRaf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      reduceMotion.removeEventListener("change", watchReduce);
      finePointer.removeEventListener("change", watchReduce);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] opacity-85"
    />
  );
}
