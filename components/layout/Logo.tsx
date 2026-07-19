import { BrandPin } from './BrandPin';

interface LogoProps {
  animated?: boolean;
  variant?: 'header' | 'hero';
}

function Logo({ animated = false, variant = 'header' }: LogoProps) {
  const isHero = variant === 'hero';

  return (
    <div
      className={`flex select-none items-center ${isHero ? 'gap-6 py-3' : 'gap-2'}`}
      aria-label="Andanzas GO"
    >
      <BrandPin
        animated={animated}
        className={isHero ? 'h-[5.4rem] w-[4.55rem] shrink-0' : 'h-11 w-[2.35rem] shrink-0'}
      />
      <span
        className={`bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-600 bg-clip-text pr-1 font-heading font-black tracking-tighter text-transparent ${
          isHero ? 'text-6xl' : 'text-2xl'
        }`}
      >
      GO
      </span>
    </div>
  );
}

export default Logo;
