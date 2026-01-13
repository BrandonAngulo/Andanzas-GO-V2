import React from 'react';

const Logo = () => (
  <div className="flex items-center gap-1.5 select-none" aria-label="Logo de Andanzas GO">
    <svg
      width="34"
      height="40"
      viewBox="0 0 32 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 38C16 38 0 25.3333 0 15.8333C0 7.08832 7.16344 0 16 0C24.8366 0 32 7.08832 32 15.8333C32 25.3333 16 38 16 38ZM16 20.8C19.5 17.5 23 14 23 11.2C23 8.8 21.2 7 18.8 7C17.4 7 16.5 7.8 16 8.5C15.5 7.8 14.6 7 13.2 7C10.8 7 9 8.8 9 11.2C9 14 12.5 17.5 16 20.8Z"
        fill="#2A9D8F" 
      />
    </svg>
    <span
      className="font-extrabold text-3xl tracking-wide"
      style={{ color: '#EA580C', fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      GO
    </span>
  </div>
);

export default Logo;