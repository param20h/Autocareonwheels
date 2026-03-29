import React from 'react';
import './SpeedLines.css';

const SpeedLinesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="speed-lines-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="speed-line" style={{
            '--delay': `${Math.random() * 5}s`,
            '--duration': `${0.8 + Math.random() * 1.5}s`,
            '--top': `${Math.random() * 100}%`,
            '--height': `${1 + Math.random() * 4}px`,
            '--opacity': `${0.15 + Math.random() * 0.5}`,
            '--color': Math.random() > 0.7 ? 'var(--color-silver)' : 'var(--color-accent)'
          }}></div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none"></div>
    </div>
  );
};

export default SpeedLinesBackground;
