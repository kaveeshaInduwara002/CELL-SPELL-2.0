import React, { useMemo } from 'react';

export default function Particles() {
  const particles = useMemo(() => {
    const items = [];
    for (let i = 0; i < 35; i++) {
      const sizes = ['small', 'medium', 'large'];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const left = Math.random() * 100;
      const duration = 8 + Math.random() * 16;
      const delay = Math.random() * 12;
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
