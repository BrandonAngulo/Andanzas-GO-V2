import { useMemo, useState } from 'react';
import { Award, CheckCircle2, Compass, LockKeyhole, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import type { Insignia } from '../../types';
import { BadgeCard } from '../shared/BadgeCard';
import { BadgeDetailDialog } from '../shared/BadgeDetailDialog';
import { getBadgeVisual, sortBadges, type BadgeGroup } from '../../lib/badge-system';

interface InsigniasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  earnedInsigniaIds: string[];
  allInsignias: Insignia[];
  badgeProgress?: Record<string, number>;
}

type Filter = 'all' | 'earned' | 'locked';

const GROUP_TITLES: Record<BadgeGroup, { title: string; description: string }> = {
  progress: {
    title: 'Tu trayectoria',
    description: 'Evolucionan con tus acciones: explorar, aportar y completar recorridos.',
  },
  route: {
    title: 'Recuerdos de ruta',
    description: 'Cada una conserva el símbolo de una experiencia cultural completada.',
  },
  knowledge: {
    title: 'Cultura y lenguaje',
    description: 'Reconocen lo que aprendes y descubres sobre los territorios.',
  },
  special: {
    title: 'Logros especiales',
    description: 'Reconocimientos únicos vinculados a experiencias y campañas.',
  },
};

export default function InsigniasModal({
  open,
  onOpenChange,
  earnedInsigniaIds,
  allInsignias,
  badgeProgress = {},
}: InsigniasModalProps): JSX.Element {
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedBadge, setSelectedBadge] = useState<Insignia | null>(null);
  const earnedSet = useMemo(() => new Set(earnedInsigniaIds), [earnedInsigniaIds]);
  const earnedCount = allInsignias.filter((badge) => earnedSet.has(badge.id)).length;
  const totalCount = allInsignias.length;
  const percentage = totalCount ? Math.round((earnedCount / totalCount) * 100) : 0;

  const grouped = useMemo(() => {
    const visible = [...allInsignias]
      .sort(sortBadges)
      .filter((badge) => filter === 'all' || (filter === 'earned' ? earnedSet.has(badge.id) : !earnedSet.has(badge.id)));
    return visible.reduce((result, badge) => {
      const group = getBadgeVisual(badge).group;
      (result[group] ||= []).push(badge);
      return result;
    }, {} as Partial<Record<BadgeGroup, Insignia[]>>);
  }, [allInsignias, earnedSet, filter]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[92vh] max-w-6xl flex-col overflow-hidden rounded-[2rem] border-0 p-0 shadow-2xl">
        <DialogHeader className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#064e43] via-[#08775c] to-[#10a66a] px-5 pb-5 pt-6 text-left text-white sm:px-7">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute right-20 top-4 h-32 w-32 rounded-full bg-orange-300/15 blur-3xl" />
          <img
            src="/brand/andi/andi-frontal-512-transparent-v2.png"
            alt=""
            className="pointer-events-none absolute -bottom-5 right-4 hidden h-40 object-contain sm:block"
            aria-hidden="true"
          />

          <div className="relative max-w-3xl pr-0 sm:pr-32">
            <p className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-orange-200">
              <Sparkles className="h-4 w-4" />
              Pasaporte de logros
            </p>
            <DialogTitle className="flex items-center gap-2 font-heading text-2xl font-black text-white sm:text-3xl">
              <Award className="h-7 w-7 text-orange-300" />
              Tus insignias cuentan por dónde has andado
            </DialogTitle>
            <DialogDescription className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-50/80">
              Cada insignia está vinculada a una acción real. Consulta el objetivo, sigue tu avance y conserva los símbolos de las rutas que completas.
            </DialogDescription>

            <div className="mt-4 max-w-xl">
              <div className="mb-1.5 flex justify-between text-xs font-bold text-white/80">
                <span>Colección descubierta</span>
                <span>{earnedCount} de {totalCount} · {percentage}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-300 to-yellow-200 transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex shrink-0 gap-2 overflow-x-auto border-b bg-background px-4 py-3 scrollbar-none sm:px-6">
          <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className="shrink-0 rounded-full">
            <Compass className="mr-1.5 h-4 w-4" /> Todas
          </Button>
          <Button size="sm" variant={filter === 'earned' ? 'default' : 'outline'} onClick={() => setFilter('earned')} className="shrink-0 rounded-full">
            <CheckCircle2 className="mr-1.5 h-4 w-4" /> Conseguidas · {earnedCount}
          </Button>
          <Button size="sm" variant={filter === 'locked' ? 'default' : 'outline'} onClick={() => setFilter('locked')} className="shrink-0 rounded-full">
            <LockKeyhole className="mr-1.5 h-4 w-4" /> Por descubrir · {Math.max(0, totalCount - earnedCount)}
          </Button>
        </div>

        <ScrollArea className="min-h-0 flex-1 bg-muted/20">
          <div className="space-y-5 p-3.5 sm:p-4">
            {(Object.keys(GROUP_TITLES) as BadgeGroup[]).map((group) => {
              const badges = grouped[group];
              if (!badges?.length) return null;
              const copy = GROUP_TITLES[group];
              return (
                <section key={group} aria-labelledby={`badge-group-${group}`}>
                  <div className="mb-3">
                    <h2 id={`badge-group-${group}`} className="font-heading text-xl font-black">{copy.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{copy.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {badges.map((badge) => (
                      <BadgeCard
                        key={badge.id}
                        insignia={badge}
                        obtenida={earnedSet.has(badge.id)}
                        onSelect={setSelectedBadge}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {Object.keys(grouped).length === 0 && (
              <div className="rounded-2xl border border-dashed bg-card p-6 text-center">
                <Award className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-bold">Todavía no hay insignias en esta vista.</p>
              </div>
            )}
          </div>
        </ScrollArea>
        </DialogContent>
      </Dialog>

      <BadgeDetailDialog
        insignia={selectedBadge}
        open={selectedBadge !== null}
        onOpenChange={(detailOpen) => {
          if (!detailOpen) setSelectedBadge(null);
        }}
        obtenida={selectedBadge ? earnedSet.has(selectedBadge.id) : false}
        progress={selectedBadge?.family_key ? badgeProgress[selectedBadge.family_key] : undefined}
      />
    </>
  );
}
