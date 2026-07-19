import { useId } from 'react';

const PIN_PATH =
  'M16 38C16 38 0 25.333 0 15.833 0 7.088 7.163 0 16 0s16 7.088 16 15.833C32 25.333 16 38 16 38Zm0-17.2c3.5-3.3 7-6.8 7-9.6C23 8.8 21.2 7 18.8 7c-1.4 0-2.3.8-2.8 1.5C15.5 7.8 14.6 7 13.2 7 10.8 7 9 8.8 9 11.2c0 2.8 3.5 6.3 7 9.6Z';

const PIN_DEPTH = Array.from({ length: 17 }, (_, index) => index - 8);

interface BrandPinProps {
  animated?: boolean;
  className?: string;
}

export function BrandPin({ animated = false, className = '' }: BrandPinProps) {
  const gradientPrefix = useId().replace(/:/g, '');

  if (!animated) {
    const gradientId = `${gradientPrefix}-static`;

    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 32 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="5" y1="2" x2="27" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#35C987" />
            <stop offset="0.55" stopColor="#16A36D" />
            <stop offset="1" stopColor="#087858" />
          </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={PIN_PATH}
          fill={`url(#${gradientId})`}
          stroke="#087858"
          strokeWidth="0.65"
        />
        <path
          d="M5.1 14.7C5.7 7.7 10.2 3.2 16.1 3.2c3.7 0 6.9 1.7 8.9 4.5"
          stroke="white"
          strokeOpacity="0.34"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <div className={`brand-pin-perspective ${className}`} aria-hidden="true">
      <style>{`
        @keyframes brand-pin-turn {
          0% { transform: rotateX(-7deg) rotateY(0deg); }
          50% { transform: rotateX(-7deg) rotateY(180deg); }
          100% { transform: rotateX(-7deg) rotateY(360deg); }
        }
        .brand-pin-perspective {
          perspective: 760px;
          transform-style: preserve-3d;
        }
        .brand-pin-solid {
          animation: brand-pin-turn 7s linear infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .brand-pin-solid { animation: none; }
        }
      `}</style>
      <div className="brand-pin-solid relative h-full w-full">
        {PIN_DEPTH.map((depth) => {
          const isSurface = Math.abs(depth) === 8;
          const gradientId = `${gradientPrefix}-${depth + 8}`;

          return (
            <svg
              key={depth}
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 32 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: `translateZ(${depth}px)`,
                filter: depth === 8 ? 'drop-shadow(0 8px 7px rgba(5, 72, 55, 0.24))' : undefined,
              }}
            >
              {isSurface && (
                <defs>
                  <linearGradient
                    id={gradientId}
                    x1="5"
                    y1="2"
                    x2="27"
                    y2="36"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#49D99A" />
                    <stop offset="0.52" stopColor="#17AA72" />
                    <stop offset="1" stopColor="#087858" />
                  </linearGradient>
                </defs>
              )}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d={PIN_PATH}
                fill={isSurface ? `url(#${gradientId})` : '#07634F'}
                stroke={isSurface ? '#075E4B' : '#064F43'}
                strokeWidth={isSurface ? '0.65' : '0.45'}
              />
              {isSurface && (
                <path
                  d="M5.1 14.7C5.7 7.7 10.2 3.2 16.1 3.2c3.7 0 6.9 1.7 8.9 4.5"
                  stroke="white"
                  strokeOpacity="0.36"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                />
              )}
            </svg>
          );
        })}
      </div>
    </div>
  );
}
