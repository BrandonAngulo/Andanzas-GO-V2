import React, { useState, useEffect } from 'react';
import { Ruta, Site } from '../../types';
import { SITES } from '../../constants';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { X, ArrowLeft, ArrowRight, Lightbulb, Swords, Check, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';
import { useI18n } from '../../i18n';
import { getTranslated } from '../../lib/utils';

interface GuidedRouteModalProps {
  route: Ruta;
  currentStep: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

const GuidedRouteModal: React.FC<GuidedRouteModalProps> = ({ route, currentStep, onClose, onNext, onPrev, onComplete }) => {
  const { t, language } = useI18n();
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const currentPointId = route.puntos[currentStep];
  const currentPoint = SITES.find(site => site.id === currentPointId);
  const gamificationData = route.gamificacion ? route.gamificacion[currentStep] : null;

  useEffect(() => {
    // Reset state when step changes
    setUserAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [currentStep]);

  const handleCheckAnswer = () => {
    if (!userAnswer || !gamificationData) return;
    setIsAnswered(true);
    if (userAnswer === getTranslated(gamificationData, 'respuestaCorrecta', language)) {
      setIsCorrect(true);
    }
  };

  const isLastStep = currentStep === route.puntos.length - 1;

  if (!currentPoint || !gamificationData) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>{t('guidedRoute.error')}</DialogContent>
      </Dialog>
    );
  }

  const opciones = getTranslated(gamificationData, 'opciones', language) as string[];
  const respuestaCorrecta = getTranslated(gamificationData, 'respuestaCorrecta', language);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold">{getTranslated(route, 'nombre', language)}</h2>
            <p className="text-sm text-muted-foreground">{t('guidedRoute.point')} {currentStep + 1} {t('guidedRoute.of')} {route.puntos.length}: {getTranslated(currentPoint, 'nombre', language)}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-6 grid md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center">
              <img src={currentPoint.logoUrl} alt={getTranslated(currentPoint, 'nombre', language) as string} className="w-full h-64 object-cover rounded-lg mb-4 bg-white"/>
            </div>
            
            <div className="space-y-4">
              {!isCorrect ? (
                // --- Question Phase ---
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t('guidedRoute.testYourKnowledge')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium mb-4">{getTranslated(gamificationData, 'pregunta', language)}</p>
                    <div className="space-y-2">
                      {opciones.map(opcion => {
                        const isSelected = userAnswer === opcion;
                        let variant: 'outline' | 'default' | 'secondary' | 'destructive' = 'outline';
                        if (isAnswered) {
                          if (opcion === respuestaCorrecta) variant = 'default';
                          else if (isSelected) variant = 'destructive';
                          else variant = 'secondary';
                        } else if (isSelected) {
                            variant = 'secondary';
                        }
                        
                        return (
                          <Button 
                            key={opcion}
                            variant={variant}
                            className="w-full justify-start text-left h-auto py-2"
                            onClick={() => setUserAnswer(opcion)}
                            disabled={isAnswered}
                          >
                            {opcion}
                          </Button>
                        );
                      })}
                    </div>
                    <Button onClick={handleCheckAnswer} disabled={!userAnswer || isAnswered} className="mt-4 w-full">
                      {t('guidedRoute.checkAnswer')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                // --- Reward Phase ---
                <div className="space-y-4 animate-in fade-in-50">
                    <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                           <CardTitle className="text-base text-green-800 flex items-center gap-2"><Check className="h-5 w-5"/> {t('guidedRoute.correct')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-1"><Lightbulb className="h-4 w-4 text-yellow-500" /> {t('guidedRoute.funFact')}</h4>
                                <p className="text-sm text-muted-foreground">{getTranslated(gamificationData, 'datoCurioso', language)}</p>
                             </div>
                             <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-1"><Swords className="h-4 w-4 text-blue-500" /> {t('guidedRoute.explorerChallenge')}</h4>
                                <p className="text-sm text-muted-foreground">{getTranslated(gamificationData, 'reto', language)}</p>
                             </div>
                        </CardContent>
                    </Card>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between p-4 border-t bg-background flex-shrink-0">
          <Button variant="outline" onClick={onPrev} disabled={currentStep === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('guidedRoute.previous')}
          </Button>
          {isLastStep ? (
            <Button onClick={onComplete} disabled={!isCorrect}>{t('fullView.completeRoute')}</Button>
          ) : (
            <Button onClick={onNext} disabled={!isCorrect}>
              {t('guidedRoute.next')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuidedRouteModal;