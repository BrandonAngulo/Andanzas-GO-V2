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

type MissionState = 'CHALLENGE' | 'SUCCESS';

const GuidedRouteModal: React.FC<GuidedRouteModalProps> = ({ route, currentStep, onClose, onNext, onComplete, sites }) => {
  const { t, language } = useI18n();
  const { user } = useAuth();

  // State
  const [missionState, setMissionState] = useState<MissionState>('CHALLENGE');
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const [showManualCheckin, setShowManualCheckin] = useState(false);

  const currentPointId = route.puntos[currentStep];
  const currentPoint = sites.find(site => site.id === currentPointId);
  // Safe access to challenge
  const challenge: Challenge | undefined = route.gamificacion ? route.gamificacion[currentStep] : undefined;



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

  const verifyTriviaLogic = async (data: any, points: number, typeLabel: string) => {
    if (!userAnswer || !data) return;

    const correct = getTranslated(data, 'correct_answer', language);

    if (userAnswer === correct) {
      setIsCorrect(true);
      if (user) {
        await gamificationService.awardPoints(points, `${typeLabel}: ${currentPoint?.nombre}`);
      }
      setTimeout(() => setMissionState('SUCCESS'), 1000);
    } else {
      // Wrong answer
      setWrongAnswers(prev => [...prev, userAnswer]);
      setUserAnswer(null); // Reset selection to allow picking another
    }
  };

  const verifyTrivia = () => verifyTriviaLogic(challenge?.quiz_data, challenge?.points_reward || 0, 'Trivia');
  const verifyManualTrivia = () => verifyTriviaLogic(challenge?.manual_trivia_data, (challenge?.points_reward || 0) / 2, 'Manual Check-in'); // Halve points for manual? Maybe not for MVP. Let's keep full points or logic specific desires. Audit suggested Silver/Gold but implementation might be simpler for now.


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

  // --- HELPERS ---


  const renderChallenge = () => (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <div className="p-4 border-b bg-background/95 backdrop-blur sticky top-0 z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div>
            <h4 className="font-bold text-lg leading-none">{t('mission.activeChallenge')}</h4>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
            <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">+{challenge?.points_reward}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-6">

          {/* Instruction Card */}
          <div className="bg-background border rounded-2xl p-6 shadow-sm text-center space-y-3">
            <Swords className="w-10 h-10 text-primary mx-auto mb-2" />
            <h2 className="text-xl font-bold">{getTranslated(challenge!, 'title', language)}</h2>
            <p className="text-muted-foreground">{getTranslated(challenge!, 'instruction', language)}</p>
          </div>

          {/* CHECKIN & HYBRID LOGIC */}
          {challenge?.type === 'CHECKIN' && (
            <>
              {!showManualCheckin ? (
                <div className="flex flex-col items-center py-8">
                  <div className={cn("relative w-40 h-40 flex items-center justify-center rounded-full mb-6 transition-all", checkingLocation ? "bg-primary/5" : "bg-primary/10")}>
                    {checkingLocation && <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-20" />}
                    <MapPin className={cn("w-16 h-16 text-primary transition-all", checkingLocation && "animate-bounce")} />
                  </div>
                  <Button onClick={verifyCheckIn} disabled={checkingLocation} size="lg" className="w-full rounded-xl">
                    {checkingLocation ? t('mission.verifying') : t('mission.checkLocation')}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4 text-center">{t('mission.gpsHint')}</p>

                  {challenge.allow_manual_trivia && (
                    <Button variant="link" className="mt-4 text-muted-foreground" onClick={() => {
                      setShowManualCheckin(true);
                      setWrongAnswers([]);
                      setUserAnswer(null);
                    }}>
                      ¿Problemas con el GPS? Validar manualmente
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-5">
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-900 text-sm text-orange-800 dark:text-orange-200 mb-4">
                    <p className="font-semibold mb-1">Modo Manual</p>
                    Responde esta pregunta sobre el lugar para validar tu visita.
                  </div>

                  {challenge.manual_trivia_data && (
                    <>
                      <p className="font-medium text-lg mb-4">{getTranslated(challenge.manual_trivia_data, 'question', language)}</p>
                      {(getTranslated(challenge.manual_trivia_data, 'options', language) as string[])?.map((option: string) => {
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

                      <Button
                        onClick={verifyManualTrivia}
                        disabled={!userAnswer || isCorrect}
                        className="w-full mt-4 h-12"
                        size="lg"
                      >
                        {t('mission.confirmAnswer')}
                      </Button>

                      <Button variant="ghost" className="w-full mt-2" onClick={() => setShowManualCheckin(false)}>
                        Cancelar y probar GPS
                      </Button>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {/* TRIVIA LOGIC */}
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

      {/* Minimize Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button variant="ghost" size="icon" className="rounded-full text-white/70 hover:current-color hover:bg-white/20" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

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
        {missionState === 'CHALLENGE' && renderChallenge()}
        {missionState === 'SUCCESS' && renderSuccess()}
      </DialogContent>
    </Dialog>
  );
};

export default GuidedRouteModal;