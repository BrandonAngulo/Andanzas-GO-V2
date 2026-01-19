import React from 'react';

interface LogoProps {
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ animated = false }) => (
  <div className="flex items-center gap-2 select-none" aria-label="Logo de Andanzas GO">
    <div className="relative w-[34px] h-[40px] flex items-center justify-center [perspective:1000px]">
      {/* 3D Container */}
      <div
        className={`relative w-full h-full [transform-style:preserve-3d] ${animated ? 'animate-[spin-y-axis_6s_linear_infinite]' : ''}`}
      >
        <style>{`
            @keyframes spin-y-axis {
              0% { transform: rotateY(0deg); }
              100% { transform: rotateY(360deg); }
            }
          `}</style>

        {/* Front Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] z-[2]">
          <svg width="34" height="40" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
            <path fillRule="evenodd" clipRule="evenodd" d="M16 38C16 38 0 25.3333 0 15.8333C0 7.08832 7.16344 0 16 0C24.8366 0 32 7.08832 32 15.8333C32 25.3333 16 38 16 38ZM16 20.8C19.5 17.5 23 14 23 11.2C23 8.8 21.2 7 18.8 7C17.4 7 16.5 7.8 16 8.5C15.5 7.8 14.6 7 13.2 7C10.8 7 9 8.8 9 11.2C9 14 12.5 17.5 16 20.8Z" fill="#2A9D8F" />
            {/* Shiny gradient overlay for "premium" feel */}
            <path fillRule="evenodd" clipRule="evenodd" d="M16 38C16 38 0 25.3333 0 15.8333C0 7.08832 7.16344 0 16 0C24.8366 0 32 7.08832 32 15.8333C32 25.3333 16 38 16 38ZM16 20.8C19.5 17.5 23 14 23 11.2C23 8.8 21.2 7 18.8 7C17.4 7 16.5 7.8 16 8.5C15.5 7.8 14.6 7 13.2 7C10.8 7 9 8.8 9 11.2C9 14 12.5 17.5 16 20.8Z" fill="url(#shine)" fillOpacity="0.2" style={{ mixBlendMode: 'overlay' }} />
            <defs>
              <linearGradient id="shine" x1="0" y1="0" x2="32" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" stopOpacity="0" />
                <stop offset="0.5" stopColor="white" stopOpacity="0.8" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Simulated Thickness (multiple layers pushed back) - Simplified "Extrusion" */}
        {animated && (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: `translateZ(-${i}px)` }}>
                <svg width="34" height="40" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16 38C16 38 0 25.3333 0 15.8333C0 7.08832 7.16344 0 16 0C24.8366 0 32 7.08832 32 15.8333C32 25.3333 16 38 16 38ZM16 20.8C19.5 17.5 23 14 23 11.2C23 8.8 21.2 7 18.8 7C17.4 7 16.5 7.8 16 8.5C15.5 7.8 14.6 7 13.2 7C10.8 7 9 8.8 9 11.2C9 14 12.5 17.5 16 20.8Z" fill="#1F756B" />
                </svg>
              </div>
            ))}

            {/* Back Face (Mirrored) */}
            <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: 'rotateY(180deg) translateZ(4px)' }}>
              <svg width="34" height="40" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 38C16 38 0 25.3333 0 15.8333C0 7.08832 7.16344 0 16 0C24.8366 0 32 7.08832 32 15.8333C32 25.3333 16 38 16 38ZM16 20.8C19.5 17.5 23 14 23 11.2C23 8.8 21.2 7 18.8 7C17.4 7 16.5 7.8 16 8.5C15.5 7.8 14.6 7 13.2 7C10.8 7 9 8.8 9 11.2C9 14 12.5 17.5 16 20.8Z" fill="#2A9D8F" />
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
    <span
      className="font-extrabold text-3xl tracking-wide select-none"
      style={{ color: '#EA580C', fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      GO
    </span>
  </div>
);

export default Logo;