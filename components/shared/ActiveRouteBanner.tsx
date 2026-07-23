import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import {
  X,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Navigation,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Clock,
  Award,
  HelpCircle,
  Compass,
  Trophy
} from 'lucide-react';
import { useI18n } from '../../i18n';
import { cn, getTranslated } from '../../lib/utils';
import { Site, Ruta, Challenge } from '../../types';
import { gamificationService } from '../../services/gamification.service';
import { useAuth } from '../../contexts/AuthContext';
import { BADGES } from '../../data/badges';
import { toast } from 'sonner';

interface ActiveRouteBannerProps {
  route: Ruta;
  currentStep: number;
  sites: Site[];
  onCancel: () => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  visitedPoints: string[];
  onPointVisited: (siteId: string) => void;
  onSetStep?: (step: number) => void;
  onOpenSiteDetails?: (site: Site) => void;
}

const ActiveRouteBanner: React.FC<ActiveRouteBannerProps> = ({
  route,
  currentStep,
  sites,
  onCancel,
  onNext,
  onPrev,
  onComplete,
  visitedPoints,
  onPointVisited,
  onSetStep,
  onOpenSiteDetails
}) => {
  const { t, language } = useI18n();
  const { user } = useAuth();

  // Bottom Sheet State
  const [isExpanded, setIsExpanded] = useState(false);

  // Challenge / Geolocation State
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [showManualCheckin, setShowManualCheckin] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  // Active step points
  const currentPointId = route.puntos[currentStep];
  const currentPoint = sites.find(s => s.id === currentPointId);
  const challenge: Challenge | undefined = route.gamificacion ? route.gamificacion[currentStep] : undefined;

  const isFirst = currentStep === 0;
  const isLast = currentStep === route.puntos.length - 1;
  const isCurrentPointVisited = currentPoint ? visitedPoints.includes(currentPoint.id) : false;

  // Reset challenge UI states when currentStep changes
  useEffect(() => {
    setGpsError(null);
    setShowManualCheckin(false);
    setUserAnswer(null);
    setWrongAnswers([]);
    setIsCorrect(false);
  }, [currentStep]);

  if (!route || !currentPoint) return null;

  // Haversine Distance Formula
  const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Verify GPS Check-In
  const verifyCheckIn = () => {
    if (!currentPoint) return;
    setCheckingLocation(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setCheckingLocation(false);
      setGpsError(
        language === 'es'
          ? 'La geolocalización no está soportada por tu navegador.'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const targetLat = currentPoint.lat;
        const targetLng = currentPoint.lng;

        const distance = getDistanceInMeters(userLat, userLng, targetLat, targetLng);
        const requiredRadius = challenge?.checkin_data?.radius_meters || 100; // strictly 100m

        if (distance <= requiredRadius) {
          setCheckingLocation(false);
          setIsCorrect(true);
          onPointVisited(currentPoint.id);
          if (user && challenge) {
            await gamificationService.claimActionPoints('route_challenge', route.id, currentPoint.id);
          }
          toast.success(language === 'es' ? '¡Llegaste al punto!' : 'You have arrived!');
        } else {
          setCheckingLocation(false);
          const distanceStr =
            distance >= 1000
              ? `${(distance / 1000).toFixed(1)} km`
              : `${Math.round(distance)} m`;

          const errorMsg =
            language === 'es'
              ? `Estás a ${distanceStr} de distancia. Debes estar a menos de ${requiredRadius}m para registrar tu visita.`
              : `You are ${distanceStr} away. You must be within ${requiredRadius}m to register your visit.`;

          setGpsError(errorMsg);
          if (challenge?.allow_manual_trivia) {
            setShowManualCheckin(true);
          }
        }
      },
      (error) => {
        console.error('GPS error:', error);
        setCheckingLocation(false);
        const errorMsg =
          language === 'es'
            ? 'No pudimos obtener tu ubicación. Por favor activa el GPS o usa la validación manual.'
            : 'Could not obtain location. Please enable GPS or use manual validation.';
        setGpsError(errorMsg);
        if (challenge?.allow_manual_trivia) {
          setShowManualCheckin(true);
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Verify Trivia
  const verifyTriviaLogic = async (data: any, actionType: 'route_challenge' | 'route_challenge_manual') => {
    if (!userAnswer || !data) return;

    const correct = getTranslated(data, 'correct_answer', language);

    if (userAnswer === correct) {
      setIsCorrect(true);
      onPointVisited(currentPoint.id);
      if (user) {
        await gamificationService.claimActionPoints(actionType, route.id, currentPoint.id);
      }
      toast.success(language === 'es' ? '¡Respuesta correcta!' : 'Correct answer!');
    } else {
      setWrongAnswers(prev => [...prev, userAnswer]);
      setUserAnswer(null);
    }
  };

  const handleVerifyTrivia = () =>
    verifyTriviaLogic(challenge?.quiz_data, 'route_challenge');

  const handleVerifyManualTrivia = () =>
    verifyTriviaLogic(challenge?.manual_trivia_data, 'route_challenge_manual');

  const handleNextStep = () => {
    if (isLast) {
      onComplete();
    } else {
      onNext();
    }
  };

  // Recommendations mapping
  const badge = BADGES.find(b => b.id === route.reward_badge_id);
  const BadgeIcon = badge?.icono || Award;
  const routeProgress = Math.round(((currentStep + (isCurrentPointVisited ? 1 : 0)) / route.puntos.length) * 100);
  const currentImage = currentPoint.fotos?.[0] || currentPoint.logoUrl;

  return (
    <div
      className={cn(
        "absolute bottom-[calc(5.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-[90] transition-all duration-300 ease-in-out md:bottom-6 md:left-1/2 md:right-auto md:w-[95%] md:max-w-xl md:-translate-x-1/2",
        isExpanded ? "h-[min(76dvh,42rem)]" : "h-auto"
      )}
    >
      <Card className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border-emerald-600/20 bg-background/96 shadow-[0_24px_80px_-30px_rgba(6,78,59,0.8)] ring-1 ring-emerald-500/5 backdrop-blur-xl">
        {/* Slider drag indicator */}
        <button
          type="button"
          className="flex w-full shrink-0 flex-col items-center pb-1 pt-2 transition-colors hover:bg-muted/30"
          onClick={() => setIsExpanded(prev => !prev)}
          aria-label={isExpanded
            ? (language === 'es' ? 'Contraer información de la parada' : 'Collapse stop information')
            : (language === 'es' ? 'Ampliar información de la parada' : 'Expand stop information')}
        >
          <span className="mb-1 h-1 w-12 rounded-full bg-muted-foreground/30" />
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground/60" />
          )}
        </button>

        {/* Collapsed Header Info */}
        <div className="shrink-0 border-b border-border/40 px-4 pb-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="h-6 cursor-pointer rounded-full border-emerald-500/30 bg-emerald-500/10 px-2 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
                onClick={() => setIsExpanded(prev => !prev)}
              >
                {t('guidedRoute.activeRoute') || "En Ruta"}
              </Badge>
              
              <div className="flex items-center gap-1 rounded-full bg-muted/80 px-1 py-0.5 shadow-sm">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full p-0 hover:bg-background"
                  onClick={onPrev} 
                  disabled={isFirst}
                  title={language === 'es' ? "Anterior" : "Previous"}
                >
                  <ChevronLeft className="h-3.5 w-3.5 text-foreground/75" />
                </Button>
                <span className="select-none px-1 font-mono text-[10px] font-bold text-muted-foreground">
                  {currentStep + 1} / {route.puntos.length}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full p-0 hover:bg-background"
                  onClick={onNext} 
                  disabled={isLast}
                  title={language === 'es' ? "Siguiente" : "Next"}
                >
                  <ChevronRight className="h-3.5 w-3.5 text-foreground/75" />
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-full px-2 text-[10px] font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={onCancel}
            >
              {language === 'es' ? "SALIR DE RUTA" : "QUIT ROUTE"}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-emerald-100 text-left shadow-sm ring-1 ring-emerald-950/10 dark:bg-emerald-950"
              onClick={() => onOpenSiteDetails?.(currentPoint)}
              aria-label={language === 'es' ? 'Ver detalles de la parada' : 'View stop details'}
            >
              {currentImage ? (
                <img src={currentImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <MapPin className="m-4 h-6 w-6 text-emerald-600" />
              )}
              <span className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-orange-400 text-[10px] font-black text-orange-950 shadow">
                {currentStep + 1}
              </span>
            </button>

            <div className="min-w-0 flex-1">
              <button type="button" className="flex items-center gap-1 text-left" onClick={() => setIsExpanded(prev => !prev)}>
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-[10px] font-black uppercase leading-none tracking-widest text-emerald-700 dark:text-emerald-300">
                  {isCurrentPointVisited ? (language === 'es' ? "Parada completada" : "Stop completed") : (language === 'es' ? "Tu próxima parada" : "Your next stop")}
                </span>
              </button>
              <div className="group mt-1 flex select-none items-center gap-1.5">
                <h4 
                  className="flex-1 cursor-pointer truncate text-base font-extrabold leading-tight text-foreground hover:text-primary md:text-lg"
                  onClick={() => onOpenSiteDetails && onOpenSiteDetails(currentPoint)}
                  title={language === 'es' ? "Ver detalles de la parada" : "View stop details"}
                >
                  {getTranslated(currentPoint, 'nombre', language)}
                </h4>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 p-0 text-muted-foreground transition-opacity hover:bg-muted"
                  onClick={() => onOpenSiteDetails && onOpenSiteDetails(currentPoint)}
                  title={language === 'es' ? "Ver detalles" : "View details"}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-emerald-500 transition-[width] duration-500" style={{ width: `${routeProgress}%` }} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const queryName = currentPoint.nombre;
                  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryName + ", Cali")}`;
                  window.open(url, '_blank');
                }}
                className="h-10 rounded-xl border-emerald-600/20 bg-background/50 px-3 text-xs font-bold text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
              >
                <Navigation className="mr-1.5 h-4 w-4" /> {language === 'es' ? "Cómo llegar" : "Directions"}
              </Button>

              {isCurrentPointVisited || isCorrect ? (
                <Button
                  size="sm"
                  onClick={handleNextStep}
                  className="h-10 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  {isLast ? (language === 'es' ? 'Finalizar' : 'Finish') : (language === 'es' ? 'Siguiente' : 'Next')}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="h-10 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  {language === 'es' ? "Explorar parada" : "Explore stop"}
                </Button>
              )}
          </div>
        </div>

        {/* Scrollable Expanded Content */}
        {isExpanded && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6 pb-6">
              {/* Route Progress Stepper */}
              <div className="bg-muted/30 p-3.5 rounded-xl border border-border/40">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Progreso del Recorrido
                </h5>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {route.puntos.map((puntoId, idx) => {
                    const isVisited = visitedPoints.includes(puntoId);
                    const isActive = idx === currentStep;
                    const site = sites.find(s => s.id === puntoId);
                    return (
                      <div
                        key={puntoId}
                        className={cn(
                          "flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full border text-xs font-semibold select-none cursor-pointer",
                          isActive
                            ? "bg-primary/15 border-primary text-primary"
                            : isVisited
                            ? "bg-green-500/10 border-green-500/30 text-green-600"
                            : "bg-background border-border text-muted-foreground opacity-60"
                        )}
                        onClick={() => {
                          onSetStep && onSetStep(idx);
                        }}
                      >
                        <span className="w-4 h-4 rounded-full bg-black/5 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="max-w-[80px] truncate">{site ? getTranslated(site, 'nombre', language) : 'Sitio'}</span>
                        {isVisited && <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tramo Narrativo / Walk Story */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Relato del Camino
                </h3>
                {challenge?.connection_story ? (
                  <div className="pl-4 border-l-4 border-primary">
                    <p className="text-sm md:text-base text-foreground/90 font-medium leading-relaxed italic">
                      "{getTranslated(challenge, 'connection_story', language)}"
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Camina hacia el sitio y prepárate para explorar sus rincones más significativos.
                  </p>
                )}
              </div>

              {/* Recommendations Section */}
              {(() => {
                const stepRecs = route.recomendaciones?.filter(rec => !rec.siteId || rec.siteId === currentPoint?.id) || [];
                if (stepRecs.length === 0) return null;
                
                return (
                  <div className="space-y-2.5 pt-2 border-t border-border/40">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Consejos de Exploración
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {stepRecs.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2.5 bg-primary/5 p-3 rounded-lg border border-primary/10">
                          <span className="text-lg leading-none mt-0.5">💡</span>
                          <div>
                            <strong className="text-xs font-bold text-primary block leading-none mb-1">
                              {getTranslated(rec, 'titulo', language)}
                            </strong>
                            <p className="text-xs text-muted-foreground leading-normal">
                              {getTranslated(rec, 'descripcion', language)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Active Challenge (Verification) */}
              <div className="pt-4 border-t border-border/40 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Verificar Parada
                </h4>

                {isCurrentPointVisited || isCorrect ? (
                  /* Success State */
                  <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-green-700 dark:text-green-400">
                        ¡Parada Conquistada!
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Has desbloqueado este hito de la ruta.
                      </p>
                    </div>

                    {challenge?.quiz_data?.fun_fact && (
                      <div className="bg-card/80 p-3 rounded-lg text-xs text-foreground/80 text-left border border-border/30">
                        <strong>Dato Curioso:</strong> {getTranslated(challenge.quiz_data, 'fun_fact', language)}
                      </div>
                    )}

                    <Button
                      onClick={handleNextStep}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11 rounded-lg"
                    >
                      {isLast ? 'Finalizar Recorrido' : 'Siguiente Parada'}
                    </Button>
                  </div>
                ) : (
                  /* Pending Challenge State */
                  <div className="bg-background border rounded-xl p-4 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                        <Award className="h-4 w-4" />
                      </div>
                      <h5 className="font-extrabold text-sm">
                        {getTranslated(challenge!, 'title', language) || "Desafío de Parada"}
                      </h5>
                      <span className="ml-auto text-xs font-bold text-yellow-600 dark:text-yellow-500 font-mono">
                        +{challenge?.points_reward} pts
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-normal">
                      {getTranslated(challenge!, 'instruction', language)}
                    </p>

                    {/* GPS CHECKIN VIEW */}
                    {challenge?.type === 'CHECKIN' && (
                      <>
                        {!showManualCheckin ? (
                          <div className="space-y-3">
                            <Button
                              onClick={verifyCheckIn}
                              disabled={checkingLocation}
                              className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11 rounded-lg"
                            >
                              {checkingLocation ? "Verificando GPS..." : "Registrar Visita (GPS)"}
                            </Button>
                            {gpsError && (
                              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg text-center font-medium">
                                {gpsError}
                              </div>
                            )}
                            {challenge.allow_manual_trivia && (
                              <Button
                                variant="link"
                                className="w-full text-xs text-muted-foreground"
                                onClick={() => {
                                  setShowManualCheckin(true);
                                  setUserAnswer(null);
                                  setWrongAnswers([]);
                                }}
                              >
                                ¿Problemas con el GPS? Responder pregunta del lugar
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3 pt-2 border-t border-dashed">
                            <div className="bg-orange-500/10 border border-orange-500/20 p-2.5 rounded-lg text-xs text-orange-600 font-medium">
                              <strong>Modo Manual:</strong> Responde esta pregunta de observación para validar tu visita.
                            </div>
                            {challenge.manual_trivia_data && (
                              <div className="space-y-2">
                                <p className="font-bold text-xs text-foreground mb-1">
                                  {getTranslated(challenge.manual_trivia_data, 'question', language)}
                                </p>
                                {(getTranslated(challenge.manual_trivia_data, 'options', language) as string[])?.map(opt => {
                                  const isWrong = wrongAnswers.includes(opt);
                                  const isSelected = userAnswer === opt;
                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => !isWrong && setUserAnswer(opt)}
                                      disabled={isWrong}
                                      className={cn(
                                        "w-full text-left p-3 rounded-lg border text-xs font-semibold transition-all flex items-center justify-between",
                                        isSelected
                                          ? "border-primary bg-primary/10 text-primary"
                                          : isWrong
                                          ? "border-destructive/30 bg-destructive/5 text-destructive/60 opacity-60 cursor-not-allowed"
                                          : "border-border bg-card hover:bg-muted/40"
                                      )}
                                    >
                                      <span>{opt}</span>
                                      {isWrong && <span className="text-[10px] font-bold text-destructive">Incorrecto</span>}
                                    </button>
                                  );
                                })}

                                <Button
                                  onClick={handleVerifyManualTrivia}
                                  disabled={!userAnswer}
                                  className="w-full h-10 mt-2 font-bold"
                                >
                                  Confirmar Respuesta
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="w-full h-9 text-xs"
                                  onClick={() => setShowManualCheckin(false)}
                                >
                                  Volver a intentar con GPS
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* TRIVIA VIEW */}
                    {challenge?.type === 'TRIVIA' && challenge.quiz_data && (
                      <div className="space-y-2.5">
                        <p className="font-bold text-xs text-foreground mb-2">
                          {getTranslated(challenge.quiz_data, 'question', language)}
                        </p>
                        {(getTranslated(challenge.quiz_data, 'options', language) as string[])?.map(opt => {
                          const isWrong = wrongAnswers.includes(opt);
                          const isSelected = userAnswer === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => !isWrong && setUserAnswer(opt)}
                              disabled={isWrong}
                              className={cn(
                                "w-full text-left p-3 rounded-lg border text-xs font-semibold transition-all flex items-center justify-between",
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary"
                                  : isWrong
                                  ? "border-destructive/30 bg-destructive/5 text-destructive/60 opacity-60 cursor-not-allowed"
                                  : "border-border bg-card hover:bg-muted/40"
                              )}
                            >
                              <span>{opt}</span>
                              {isWrong && <span className="text-[10px] font-bold text-destructive">Incorrecto</span>}
                            </button>
                          );
                        })}

                        <Button
                          onClick={handleVerifyTrivia}
                          disabled={!userAnswer}
                          className="w-full h-10 mt-2 font-bold bg-primary hover:bg-primary/95 text-white"
                        >
                          Confirmar Respuesta
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
};

export default ActiveRouteBanner;
