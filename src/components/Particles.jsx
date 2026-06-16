import React, { useMemo } from 'react';

// Simple seeded PRNG for deterministic output
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function Particles() {
  const particles = useMemo(() => {
    const rand = seededRandom(42);
    const items = [];
    for (let i = 0; i < 35; i++) {
      const sizes = ['small', 'medium', 'large'];
      const size = sizes[Math.floor(rand() * sizes.length)];
      const left = rand() * 100;
      const duration = 8 + rand() * 16;
      const delay = rand() * 12;
      items.push({ id: i, size, left, duration, delay });
    }
    return items;
  }, []);

  return (
    <div className="particles-bg" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`particle ${p.size}`}
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
