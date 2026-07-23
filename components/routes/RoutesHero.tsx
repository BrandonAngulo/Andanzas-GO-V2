import { ArrowDown, Clock3, Footprints, MapPinned, Route, Sparkles } from 'lucide-react';

interface RoutesHeroProps {
  language: 'es' | 'en';
  routeCount: number;
  stopCount: number;
}

const PREVIEW_STOPS = [
  { left: '8%', top: '67%', label: '1', tone: 'bg-orange-400 text-orange-950' },
  { left: '29%', top: '31%', label: '2', tone: 'bg-emerald-600 text-white' },
  { left: '56%', top: '57%', label: '3', tone: 'bg-emerald-600 text-white' },
  { left: '83%', top: '12%', label: '4', tone: 'bg-emerald-600 text-white' },
] as const;

export function RoutesHero({ language, routeCount, stopCount }: RoutesHeroProps) {
  const copy = language === 'es'
    ? {
        eyebrow: 'Andi te acompaña',
        title: 'La ciudad se entiende mejor cuando la recorres',
        description: 'Elige una ruta, anticipa sus paradas y convierte cada recorrido en una historia para recordar.',
        explore: 'Descubrir rutas',
        routes: 'rutas disponibles',
        stops: 'paradas por descubrir',
        preview: 'Tu próxima andanza',
        previewTitle: 'Cultura, sabores y ciudad',
        duration: 'A tu ritmo',
      }
    : {
        eyebrow: 'Andi travels with you',
        title: 'The best way to understand a city is to walk through it',
        description: 'Choose a route, preview its stops, and turn every journey into a story worth remembering.',
        explore: 'Discover routes',
        routes: 'available routes',
        stops: 'stops to discover',
        preview: 'Your next journey',
        previewTitle: 'Culture, flavors and city',
        duration: 'At your pace',
      };

  return (
    <section className="relative isolate mb-5 min-h-[18rem] overflow-hidden rounded-[1.75rem] bg-[#063f38] text-white shadow-[0_26px_75px_-44px_rgba(6,78,59,0.95)] sm:min-h-[20rem] sm:rounded-[2rem] lg:min-h-[21rem]">
      <img
        src="/images/banners/unified/rutas-v2.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#043d38] via-[#064b43]/94 to-[#043d38]/35 lg:via-[#064b43]/84 lg:to-[#032d2a]/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(251,191,36,0.2),transparent_23%)]" />
      <div className="absolute -left-14 -top-20 h-52 w-52 rounded-full border border-white/10" />
      <div className="absolute -left-4 -top-8 h-36 w-36 rounded-full border border-orange-300/15" />

      <div className="relative z-10 grid min-h-[18rem] grid-cols-1 items-center px-5 py-6 sm:min-h-[20rem] sm:px-8 sm:py-8 lg:min-h-[21rem] lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:px-10">
        <div className="max-w-2xl lg:pr-8">
          <p className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-orange-300 sm:text-xs">
            <Sparkles className="h-4 w-4" />
            {copy.eyebrow}
          </p>
          <h1 className="max-w-xl font-heading text-[2rem] font-black leading-[1.02] text-balance sm:text-[2.75rem] lg:text-[3.35rem]">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed text-white/82 sm:text-base">
            {copy.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <a
              href="#route-discovery"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-orange-400 px-4 text-sm font-black text-orange-950 shadow-lg shadow-black/15 transition-colors hover:bg-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {copy.explore}
              <ArrowDown className="h-4 w-4" />
            </a>
            <div className="hidden h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 text-xs font-bold backdrop-blur-md min-[430px]:inline-flex">
              <Route className="h-4 w-4 text-emerald-200" />
              <span>{routeCount} {copy.routes}</span>
            </div>
            <div className="hidden h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 text-xs font-bold backdrop-blur-md min-[430px]:inline-flex">
              <MapPinned className="h-4 w-4 text-orange-300" />
              <span>{stopCount} {copy.stops}</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-1 z-20 sm:right-4 lg:right-[21rem]">
          <img
            src="/brand/andi/andi-frontal-512-transparent-v2.png"
            alt=""
            className="h-28 w-auto object-contain object-bottom drop-shadow-[0_18px_24px_rgba(0,0,0,0.32)] sm:h-44 lg:h-52"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 hidden justify-self-end lg:block">
          <div className="w-[21rem] rotate-[1.5deg] rounded-[1.65rem] border border-white/25 bg-[#f9f3e8]/95 p-4 text-slate-900 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">{copy.preview}</p>
                <p className="mt-0.5 text-sm font-black">{copy.previewTitle}</p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <Route className="h-4 w-4" />
              </span>
            </div>

            <div className="relative h-36 overflow-hidden rounded-2xl bg-[#dce8d4]">
              <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(35deg,transparent_47%,rgba(255,255,255,0.75)_48%,rgba(255,255,255,0.75)_52%,transparent_53%),linear-gradient(120deg,transparent_46%,rgba(14,116,144,0.16)_47%,rgba(14,116,144,0.16)_52%,transparent_53%)] [background-size:68px_68px,92px_92px]" />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 144" fill="none" aria-hidden="true">
                <path d="M34 112C73 110 62 54 110 60C149 65 146 111 190 98C223 88 213 39 281 32" stroke="white" strokeWidth="10" strokeLinecap="round" />
                <path d="M34 112C73 110 62 54 110 60C149 65 146 111 190 98C223 88 213 39 281 32" stroke="#0f9f6e" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 7" />
              </svg>
              {PREVIEW_STOPS.map((stop) => (
                <span
                  key={stop.label}
                  className={`absolute grid h-8 w-8 place-items-center rounded-full border-2 border-white text-xs font-black shadow-lg ${stop.tone}`}
                  style={{ left: stop.left, top: stop.top }}
                >
                  {stop.label}
                </span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
                <Clock3 className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-[10px] text-slate-500">{copy.duration}</p>
                  <p className="text-xs font-black">60–90 min</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
                <Footprints className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-[10px] text-slate-500">{copy.stops}</p>
                  <p className="text-xs font-black">4–6</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
