import React, { useState, useEffect } from 'react';
import { Ruta, Site, Challenge } from '../../types';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { X, ArrowRight, MapPin, Swords, Check, HelpCircle, Award, Target, Navigation, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn, getTranslated } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { LazyImage } from '../ui/lazy-image';
import { useAuth } from '../../contexts/AuthContext';
import { gamificationService } from '../../services/gamification.service';

interface GuidedRouteModalProps {
  route: Ruta;
  currentStep: number;
  onClose: () => void;
  onNext: () => void;
  onComplete: () => void;
  sites: Site[];
}

type MissionState = 'BRIEFING' | 'NAVIGATING' | 'CHALLENGE' | 'SUCCESS';

const GuidedRouteModal: React.FC<GuidedRouteModalProps> = ({ route, currentStep, onClose, onNext, onComplete, sites }) => {
  const { t, language } = useI18n();
  const { user } = useAuth();

  // State
  const [missionState, setMissionState] = useState<MissionState>(currentStep === 0 ? 'BRIEFING' : 'NAVIGATING');
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentPointId = route.puntos[currentStep];
  const currentPoint = sites.find(site => site.id === currentPointId);
  // Safe access to challenge
  const challenge: Challenge | undefined = route.gamificacion ? route.gamificacion[currentStep] : undefined;

  // Reset state when step changes
  useEffect(() => {
    if (currentStep > 0) {
      setMissionState('NAVIGATING');
    }
    setUserAnswer(null);
    setWrongAnswers([]);
    setIsCorrect(false);
  }, [currentStep]);

  // Handlers
  const startMission = () => setMissionState('NAVIGATING');

  const verifyCheckIn = () => {
    setCheckingLocation(true);
    // Simulate GPS check delay
    setTimeout(() => {
      setCheckingLocation(false);
      setMissionState('SUCCESS');
      if (user && challenge) {
        gamificationService.awardPoints(challenge.points_reward, `Check-in: ${currentPoint?.nombre}`);
      }
    }, 2000);
  };

  const verifyTrivia = async () => {
    if (!userAnswer || !challenge?.quiz_data) return;

    const correct = getTranslated(challenge.quiz_data, 'correct_answer', language);

    if (userAnswer === correct) {
      setIsCorrect(true);
      if (user) {
        await gamificationService.awardPoints(challenge.points_reward, `Trivia: ${currentPoint?.nombre}`);
      }
      setTimeout(() => setMissionState('SUCCESS'), 1000);
    } else {
      // Wrong answer
      setWrongAnswers(prev => [...prev, userAnswer]);
      setUserAnswer(null); // Reset selection to allow picking another
    }
  };

  const handleNextStep = () => {
    if (currentStep === route.puntos.length - 1) {
      // Complete Route
      if (user) {
        gamificationService.awardPoints(100, `Misión Cumplida: ${route.nombre}`);
        if (route.reward_badge_id) {
          gamificationService.unlockBadge(user.id, route.reward_badge_id);
        }
      }
      onComplete();
    } else {
      onNext();
    }
  };

  if (!currentPoint) return null;

  // --- RENDERERS ---

  const renderBriefing = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {currentPoint.logoUrl && (
          <LazyImage src={currentPoint.logoUrl} className="w-full h-full object-cover opacity-40 blur-sm" alt="Background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
      </div>

      <div className="relative z-10 p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
        <div className="bg-primary/20 p-4 rounded-full ring-4 ring-primary/10 mb-4 animate-pulse">
          <Target className="w-12 h-12 text-primary" />
        </div>

        <div className="space-y-2 max-w-lg">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {getTranslated(route, 'nombre', language)}
          </h2>
          <p className="text-slate-300 font-light text-lg">
            {getTranslated(route, 'descripcion', language)?.toString().slice(0, 150)}...
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-4 rounded-2xl flex flex-col items-center">
            <Clock className="w-6 h-6 text-blue-400 mb-2" />
            <span className="text-2xl font-bold">{route.duracionMin} m</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest">{t('mission.time')}</span>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-4 rounded-2xl flex flex-col items-center">
            <Award className="w-6 h-6 text-yellow-400 mb-2" />
            <span className="text-2xl font-bold">{route.gamificacion?.length || 0}</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest">{t('mission.challenges')}</span>
          </div>
        </div>

        <Button onClick={startMission} size="lg" className="w-full max-w-sm text-lg font-bold h-14 rounded-full shadow-xl shadow-primary/25 mt-8 hover:scale-105 transition-transform bg-primary text-white">
          {t('mission.start')}
        </Button>
      </div>
    </div>
  );

  const renderNavigating = () => (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <div className="relative h-2/5 shrink-0">
        <LazyImage src={currentPoint.logoUrl} className="w-full h-full object-cover" alt="Location" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent p-6 flex items-start justify-between">
          <Button variant="secondary" size="icon" className="rounded-full bg-black/40 text-white hover:bg-black/60 border-none" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <div className="bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5 border border-white/10">
            <Navigation className="w-3 h-3 text-primary" />
            Punto {currentStep + 1} / {route.puntos.length}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col -mt-10 relative z-10 bg-background rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)]">
        <div className="w-16 h-1 bg-border/50 rounded-full mx-auto mb-6" />

        <div className="text-center space-y-2 mb-8">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-widest">{t('mission.nextObjective')}</h3>
          <h2 className="text-3xl font-bold text-foreground leading-tight">{getTranslated(currentPoint, 'nombre', language)}</h2>
          <p className="text-muted-foreground">{getTranslated(currentPoint, 'descripcion', language)?.toString().slice(0, 100)}...</p>
        </div>

        <div className="mt-auto space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl flex gap-3 text-sm text-blue-800 dark:text-blue-300">
            <HelpCircle className="w-5 h-5 shrink-0" />
            <p>{t('mission.goTo')}</p>
          </div>

          <Button onClick={() => setMissionState('CHALLENGE')} className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20" size="lg">
            <MapPin className="mr-2 w-5 h-5" />
            {challenge?.type === 'CHECKIN' ? t('mission.verifyGps') : t('mission.imHere')}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderChallenge = () => (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <div className="p-6 border-b bg-background/50 backdrop-blur sticky top-0 z-10 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setMissionState('NAVIGATING')}><ArrowRight className="w-5 h-5 rotate-180" /></Button>
        <div>
          <h4 className="font-bold text-lg leading-none">{t('mission.activeChallenge')}</h4>
          <span className="text-xs text-muted-foreground">{t('mission.earn').replace('{{points}}', String(challenge?.points_reward))}</span>
        </div>
        <Award className="ml-auto w-8 h-8 text-yellow-500" />
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-6">

          {/* Instruction Card */}
          <div className="bg-background border rounded-2xl p-6 shadow-sm text-center space-y-3">
            <Swords className="w-10 h-10 text-primary mx-auto mb-2" />
            <h2 className="text-xl font-bold">{getTranslated(challenge!, 'title', language)}</h2>
            <p className="text-muted-foreground">{getTranslated(challenge!, 'instruction', language)}</p>
          </div>

          {/* Challenge Logic */}
          {challenge?.type === 'CHECKIN' && (
            <div className="flex flex-col items-center py-8">
              <div className={cn("relative w-40 h-40 flex items-center justify-center rounded-full mb-6 transition-all", checkingLocation ? "bg-primary/5" : "bg-primary/10")}>
                {checkingLocation && <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-20" />}
                <MapPin className={cn("w-16 h-16 text-primary transition-all", checkingLocation && "animate-bounce")} />
              </div>
              <Button onClick={verifyCheckIn} disabled={checkingLocation} size="lg" className="w-full rounded-xl">
                {checkingLocation ? t('mission.verifying') : t('mission.checkLocation')}
              </Button>
              <p className="text-xs text-muted-foreground mt-4 text-center">{t('mission.gpsHint')}</p>
            </div>
          )}

          {challenge?.type === 'TRIVIA' && challenge.quiz_data && (
            <div className="space-y-3">
              <p className="font-medium text-lg mb-4">{getTranslated(challenge.quiz_data, 'question', language)}</p>
              {(getTranslated(challenge.quiz_data, 'options', language) as string[])?.map((option: string) => {
                const isWrong = wrongAnswers.includes(option);
                const isSelected = userAnswer === option;

                return (
                  <Button
                    key={option}
                    variant={isSelected ? 'default' : (isWrong ? 'destructive' : 'outline')}
                    className={cn(
                      "w-full justify-start h-auto py-4 px-5 text-left text-base rounded-xl transition-all",
                      isWrong && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => !isWrong && setUserAnswer(option)}
                    disabled={isWrong || isCorrect}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option}</span>
                      {isWrong && <X className="w-4 h-4" />}
                      {isSelected && !isWrong && <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                  </Button>
                );
              })}

              <div className="min-h-[20px] text-center mt-2">
                {wrongAnswers.length > 0 && !userAnswer && (
                  <p className="text-red-500 text-sm animate-pulse">Respuesta incorrecta, intenta de nuevo.</p>
                )}
              </div>

              <Button
                onClick={verifyTrivia}
                disabled={!userAnswer || isCorrect}
                className="w-full mt-4 h-12"
                size="lg"
              >
                {t('mission.confirmAnswer')}
              </Button>
            </div>
          )}

        </div>
      </ScrollArea>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col h-full bg-green-600 text-white items-center justify-center p-8 relative overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-4 animate-in bounce-in duration-700">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-2">{t('mission.completed')}</h2>
          <p className="text-green-100 text-lg font-medium">+{challenge?.points_reward} {t('mission.pointsWon')}</p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 max-w-sm border border-white/20">
          <p className="italic">"{getTranslated(challenge!, 'completed_message', language)}"</p>
          {challenge?.quiz_data?.fun_fact && (
            <div className="mt-4 pt-4 border-t border-white/10 text-sm opacity-90">
              <strong>{t('guidedRoute.funFact')}</strong> {getTranslated(challenge.quiz_data, 'fun_fact', language)}
            </div>
          )}
        </div>

        <Button onClick={handleNextStep} size="lg" className="w-full max-w-xs h-14 bg-white text-green-700 hover:bg-green-50 font-bold rounded-full shadow-xl mt-8">
          {currentStep === route.puntos.length - 1 ? t('mission.finishRoute') : t('mission.nextPoint')} <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  // Wrapper Dialog
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[95vh] md:h-[85vh] p-0 border-none shadow-2xl overflow-hidden rounded-none md:rounded-3xl bg-background">
        {missionState === 'BRIEFING' && renderBriefing()}
        {missionState === 'NAVIGATING' && renderNavigating()}
        {missionState === 'CHALLENGE' && renderChallenge()}
        {missionState === 'SUCCESS' && renderSuccess()}
      </DialogContent>
    </Dialog>
  );
};

export default GuidedRouteModal;