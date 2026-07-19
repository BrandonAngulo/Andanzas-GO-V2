import React from 'react';

interface LogoProps {
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ animated = false }) => (
  <div className="flex select-none items-center gap-2" aria-label="Andanzas GO">
    <div
      className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-[0.9rem] border border-emerald-900/10 bg-emerald-700 shadow-md ${
        animated ? 'animate-[andi-breathe_2.8s_ease-in-out_infinite]' : ''
      }`}
    >
      <style>{`
        @keyframes andi-breathe {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-2px) rotate(1deg); }
        }
      `}</style>
      <img
        src="/brand/andi/andi-app-mark-512.png"
        alt=""
        className="h-full w-full object-cover"
        decoding="async"
      />
    </div>
    <span className="ml-0.5 bg-gradient-to-r from-orange-500 to-primary bg-clip-text pr-1 font-heading text-2xl font-black tracking-tighter text-transparent">
      GO
    </span>
  </div>
);

export default Logo;
