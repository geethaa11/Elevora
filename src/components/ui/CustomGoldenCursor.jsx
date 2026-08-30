import React, { useEffect, useRef } from "react";

export function CustomGoldenCursor() {
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100, visible: false });

  useEffect(() => {
    // Check coarse pointer / touch preference
    const isTouchOnly = window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(pointer: fine)").matches;

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

    // Particle arrays
    const particles = [];
    const ripples = [];

    // Helper for random in range
    const random = (min, max) => Math.random() * (max - min) + min;

    // Colors: #FFD700 (bright gold), #D4AF37 (metallic gold), #B8860B (dark gold)
    const goldColors = ["#FFD700", "#FFC72C", "#D4AF37", "#E6C200", "#B8860B"];

    const createSpark = (x, y, vx, vy, size, maxLife) => {
      particles.push({
        x,
        y,
        vx,
        vy,
        size,
        maxLife,
        life: 0,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        alpha: 1,
      });
    };

    const createBurst = (x, y) => {
      // 6 to 10 spark particles radiating outward
      const count = Math.floor(random(6, 11));
      for (let i = 0; i < count; i++) {
        const angle = random(0, Math.PI * 2);
        const speed = random(1.5, 4.5);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const size = random(2, 4.5);
        const maxLife = random(400, 600);
        createSpark(x, y, vx, vy, size, maxLife);
      }

      // Expanding ripple ring
      ripples.push({
        x,
        y,
        radius: 4,
        maxRadius: random(35, 55),
        life: 0,
        maxLife: 450,
      });
    };

    let lastSparkX = -100;
    let lastSparkY = -100;
    let lastSparkTime = 0;

    const handlePointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const cursor = cursorRef.current;
      cursor.targetX = x;
      cursor.targetY = y;
      cursor.visible = true;

      // Throttle spark creation based on distance moved and time
      const now = performance.now();
      const dist = Math.hypot(x - lastSparkX, y - lastSparkY);

      if (dist > 6 && now - lastSparkTime > 16) {
        lastSparkX = x;
        lastSparkY = y;
        lastSparkTime = now;

        // Emit 2 to 4 tiny golden spark particles per movement
        const sparkCount = Math.floor(random(2, 5));
        for (let i = 0; i < sparkCount; i++) {
          const angle = random(0, Math.PI * 2);
          const speed = random(0.3, 1.2);
          const vx = Math.cos(angle) * speed - (x - cursor.x) * 0.05;
          const vy = Math.sin(angle) * speed - (y - cursor.y) * 0.05;
          const size = random(1.5, 3);
          const maxLife = random(400, 600);
          createSpark(x + random(-3, 3), y + random(-3, 3), vx, vy, size, maxLife);
        }
      }
    };

    const handlePointerDown = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      cursorRef.current.targetX = x;
      cursorRef.current.targetY = y;
      cursorRef.current.visible = true;
      createBurst(x, y);
    };

    const handleMouseLeave = () => {
      cursorRef.current.visible = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    let lastTime = performance.now();

    const render = (now) => {
      const dt = Math.min(now - lastTime, 32); // cap frame delta
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const cursor = cursorRef.current;

      // Smooth cursor lerp
      cursor.x += (cursor.targetX - cursor.x) * 0.35;
      cursor.y += (cursor.targetY - cursor.y) * 0.35;

      // 1. Draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.life += dt;
        const progress = r.life / r.maxLife;

        if (progress >= 1) {
          ripples.splice(i, 1);
          continue;
        }

        const currentRadius = r.radius + (r.maxRadius - r.radius) * Math.sin((progress * Math.PI) / 2);
        const alpha = 0.25 * (1 - progress);

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw spark particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        const progress = p.life / p.maxLife;

        if (progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // soft gravity effect
        p.vx *= 0.96; // drag

        const alpha = Math.max(0, 1 - progress);
        const currentSize = Math.max(0.5, p.size * (1 - progress * 0.6));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw Custom Cursor Ring and Dot if active/visible and fine pointer
      if (cursor.visible && !isTouchOnly && cursor.x > 0 && cursor.y > 0) {
        ctx.save();
        // Outer glowing ring
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.75)";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#D4AF37";
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Inner glowing solid dot
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[99999] pointer-events-none w-full h-full"
      style={{ willChange: "transform, opacity" }}
    />
  );
}

export default CustomGoldenCursor;
