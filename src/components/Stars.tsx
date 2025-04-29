'use client';

import { useState, useEffect } from 'react';
import seedrandom from 'seedrandom';

interface Star {
  width: number;
  height: number;
  top: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
}

const roundToFixed = (num: number, decimals: number = 4): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

const generateStars = (count: number, seed: string): Star[] => {
  const rng = seedrandom(seed);
  
  return Array.from({ length: count }, () => ({
    width: roundToFixed(1 + rng() * 3),
    height: roundToFixed(1 + rng() * 3),
    top: roundToFixed(rng() * 100),
    left: roundToFixed(rng() * 100),
    animationDuration: roundToFixed(3 + rng() * 5),
    animationDelay: roundToFixed(rng() * 5)
  }));
};

export const Stars = ({ count = 40 }: { count?: number }) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(generateStars(count, 'client-only'));
  }, [count]);

  // No renderizar nada durante SSR
  if (!stars.length) return null;

  return (
    <>
      {stars.map((star, i) => (
        <div
          key={`star-${i}`}
          style={{
            width: `${star.width}px`,
            height: `${star.height}px`,
            top: `${star.top}%`,
            left: `${star.left}%`,
            animation: `twinkle ${star.animationDuration}s infinite ${star.animationDelay}s`
          }}
          className="absolute rounded-full bg-white opacity-70"
        />
      ))}
    </>
  );
}; 