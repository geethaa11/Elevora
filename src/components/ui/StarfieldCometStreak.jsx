import React, { useEffect, useRef } from "react";

export function StarfieldCometStreak() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // 1. Create Starfield (tiny twinkling stars)
    const numStars = Math.min(80, Math.floor((width * height) / 15000));
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.6 + 0.15,
      alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
    }));

    // 2. Create Floating Dust Particles (gold/purple ambient specs)
    const numParticles = 25;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.25 - 0.05,
      color: Math.random() > 0.4 ? "rgba(212, 175, 55, " : "rgba(139, 92, 246, ",
    }));

    // 3. Comet Streak System
    const comets = [];

    const spawnComet = () => {
      const startX = Math.random() * width * 0.8 + width * 0.2;
      const startY = Math.random() * (height * 0.3);
      const angle = Math.PI * 0.75 + (Math.random() - 0.5) * 0.2; // roughly diagonal down-left
      const speed = Math.random() * 8 + 10;
      const length = Math.random() * 120 + 80;

      comets.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 40 + 35,
        color: Math.random() > 0.3 ? "#FFD700" : "#E2E8F0",
      });
    };

    let lastCometTime = performance.now();
    let nextCometDelay = Math.random() * 5000 + 4000; // spawn every 4-9s

    let lastTime = performance.now();

    const render = (now) => {
      const dt = Math.min(now - lastTime, 32);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Render Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.alphaSpeed;
        if (star.alpha > 0.75 || star.alpha < 0.1) {
          star.alphaSpeed = -star.alphaSpeed;
        }

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
        ctx.restore();
      }

      // Render Floating Space Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = "#D4AF37";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }

      // Spawn Comet check
      if (now - lastCometTime > nextCometDelay) {
        spawnComet();
        lastCometTime = now;
        nextCometDelay = Math.random() * 6000 + 5000;
      }

      // Render Comet Streaks
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.life += 1;
        c.x += c.vx;
        c.y += c.vy;

        const progress = c.life / c.maxLife;
        c.alpha = Math.sin(progress * Math.PI) * 0.85;

        if (progress >= 1 || c.x < -100 || c.y > height + 100) {
          comets.splice(i, 1);
          continue;
        }

        const tailX = c.x - (c.vx / Math.hypot(c.vx, c.vy)) * c.length;
        const tailY = c.y - (c.vy / Math.hypot(c.vx, c.vy)) * c.length;

        ctx.save();
        const gradient = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        gradient.addColorStop(0, c.color);
        gradient.addColorStop(0.3, "rgba(212, 175, 55, 0.6)");
        gradient.addColorStop(0.7, "rgba(139, 92, 246, 0.2)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.globalAlpha = c.alpha;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Tiny bright head dot
        ctx.beginPath();
        ctx.arc(c.x, c.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
      style={{ willChange: "transform, opacity" }}
    />
  );
}

export default StarfieldCometStreak;
