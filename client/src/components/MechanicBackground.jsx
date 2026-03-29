import React from 'react';
import { Settings, Hexagon } from 'lucide-react';

const MechanicBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top Left Giant Gear */}
      <div
        className="absolute -top-40 -left-40 text-black opacity-[0.05]"
        style={{ animation: 'spin 70s linear infinite' }}
      >
        <Settings size={700} strokeWidth={1} />
      </div>

      {/* Bottom Right Gear */}
      <div
        className="absolute -bottom-32 left-[60%] text-accent opacity-[0.05]"
        style={{ animation: 'spin 50s linear infinite reverse' }}
      >
        <Settings size={500} strokeWidth={1} />
      </div>
      {/* Bottom left Gear */}
      <div
        className="absolute -bottom-32 right-[60%] text-accent opacity-[0.05]"
        style={{ animation: 'spin 50s linear infinite' }}
      >
        <Settings size={500} strokeWidth={1} />
      </div>

      {/* Middle Right Hexagon (Bolt shape) */}
      <div
        className="absolute top-0/4 right-[5%] text-black opacity-[0.04]"
        style={{ animation: 'spin 90s linear infinite' }}
      >
        <Hexagon size={350} strokeWidth={0.5} />
      </div>

      {/* Gradient overlay to fade it neatly into the section below */}
      <div className="absolute inset-0 bg-gradient-to-b via-background/40 to-background pointer-events-none"></div>
    </div>
  );
};

export default MechanicBackground;
