import { useEffect, useState } from 'react';
import { BookOpen, ChevronRight, Flame, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { dictionaryService } from '../../services/dictionary.service';
import { useAuth } from '../../contexts/AuthContext';
import type { DictionaryEntry } from '../../types';

interface WordOfTheDayCardProps {
  onOpen: (entry: DictionaryEntry) => void;
}

export function WordOfTheDayCard({ onOpen }: WordOfTheDayCardProps): JSX.Element | null {
  const { user } = useAuth();
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [claimedToday, setClaimedToday] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    dictionaryService.getWordOfTheDay()
      .then((value) => { if (active) setEntry(value); })
      .catch(() => { if (active) setEntry(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!user?.id) { setStreak(0); setClaimedToday(false); return; }
    let active = true;
    dictionaryService.getWordStreak(user.id).then((s) => {
      if (active && s) { setStreak(s.currentStreak); setClaimedToday(s.claimedToday); }
    });
    return () => { active = false; };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex min-h-28 items-center justify-center rounded-2xl border bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!entry) return null;

  const discover = async () => {
    if (user?.id && !claimedToday) {
      setBusy(true);
      try {
        const result = await dictionaryService.claimWordOfTheDay();
        if (result.ok && !result.alreadyClaimed) {
          setClaimedToday(true);
          setStreak(result.streak);
          toast.success(`+${result.awardedPoints} puntos · Racha de ${result.streak} día${result.streak === 1 ? '' : 's'} 🔥`);
          if (result.badgeUnlocked) {
            toast.success(`¡Insignia desbloqueada: ${result.badgeName ?? 'Caleñólogo'}! 🏅`);
          }
        } else if (result.alreadyClaimed) {
          setClaimedToday(true);
          setStreak(result.streak);
        }
      } catch (error) {
        console.error('No se pudo reclamar la palabra del día:', error);
      } finally {
        setBusy(false);
      }
    }
    onOpen(entry);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white shadow-xl shadow-emerald-900/10">
      <div className="pointer-events-none absolute -right-10 -top-16 font-serif text-[14rem] font-black leading-none text-white/5" aria-hidden="true">{entry.term.charAt(0)}</div>
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-50 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Palabra del día
            </span>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2.5 py-1 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                <Flame className="h-3.5 w-3.5" /> {streak} día{streak === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <h2 className="truncate font-serif text-4xl font-black tracking-tight text-white">{entry.term}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {entry.word_class && <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/15">{entry.word_class}</Badge>}
          </div>
          {claimedToday && entry.short_definition && (
            <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-emerald-50/85">{entry.short_definition}</p>
          )}
        </div>
        <Button onClick={() => void discover()} disabled={busy} className="shrink-0 rounded-full !bg-white !text-emerald-950 hover:!bg-emerald-50 shadow-lg">
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!busy && <BookOpen className="mr-2 h-4 w-4" />}
          {claimedToday ? 'Explorar la palabra' : 'Descubrir la palabra'}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      {!user && (
        <p className="relative mt-3 text-xs text-emerald-50/75">La palabra es pública. Inicia sesión para ganar puntos y mantener tu racha.</p>
      )}
    </div>
  );
}
