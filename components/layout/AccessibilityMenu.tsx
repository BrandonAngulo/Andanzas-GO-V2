import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Type, Rows, Contrast, Palette, RefreshCcw, Languages } from 'lucide-react';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';

interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  highContrast: boolean;
  grayscale: boolean;
}

interface AccessibilityMenuProps {
  settings: AccessibilitySettings;
  onSettingsChange: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  onReset: () => void;
}

const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ settings, onSettingsChange, onReset }) => {
  const { language, setLanguage, t } = useI18n();

  const handleSettingChange = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    onSettingsChange(prev => ({ ...prev, [key]: value }));
  };
  
  const increaseFontSize = () => handleSettingChange('fontSize', Math.min(settings.fontSize + 0.1, 1.5));
  const decreaseFontSize = () => handleSettingChange('fontSize', Math.max(settings.fontSize - 0.1, 0.8));
  
  const increaseLineHeight = () => handleSettingChange('lineHeight', Math.min(settings.lineHeight + 0.1, 1.5));
  const decreaseLineHeight = () => handleSettingChange('lineHeight', Math.max(settings.lineHeight - 0.1, 0.9));
  
  const getLabel = (value: number) => {
      if (value < 0.95) return t('fontLabels.small');
      if (value > 1.05) return t('fontLabels.large');
      return t('fontLabels.normal');
  }

  return (
    <Card className="absolute top-12 right-0 w-72 z-[1200] shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t('accessibilityOptions')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Language */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-muted-foreground"/>
                <span className="text-sm font-medium">{t('language')}</span>
            </div>
            <div className="flex items-center gap-1 p-0.5 bg-muted rounded-md">
                <Button variant={language === 'es' ? 'default' : 'ghost'} size="sm" className="h-7 px-2 text-xs" onClick={() => setLanguage('es')}>Español</Button>
                <Button variant={language === 'en' ? 'default' : 'ghost'} size="sm" className="h-7 px-2 text-xs" onClick={() => setLanguage('en')}>English</Button>
            </div>
        </div>

        {/* Font Size */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground"/>
                <span className="text-sm font-medium">{t('fontSize')}</span>
            </div>
            <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={decreaseFontSize} aria-label="Disminuir tamaño de fuente">-</Button>
                <span className="text-xs w-12 text-center text-muted-foreground">{getLabel(settings.fontSize)}</span>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={increaseFontSize} aria-label="Aumentar tamaño de fuente">+</Button>
            </div>
        </div>

        {/* Line Height */}
        <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Rows className="h-4 w-4 text-muted-foreground"/>
                <span className="text-sm font-medium">{t('lineHeight')}</span>
            </div>
            <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={decreaseLineHeight} aria-label="Disminuir interlineado">-</Button>
                <span className="text-xs w-12 text-center text-muted-foreground">{getLabel(settings.lineHeight)}</span>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={increaseLineHeight} aria-label="Aumentar interlineado">+</Button>
            </div>
        </div>
        
        {/* High Contrast */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                 <Contrast className="h-4 w-4 text-muted-foreground"/>
                 <label htmlFor="high-contrast-switch" className="text-sm font-medium">{t('highContrast')}</label>
            </div>
            <Switch 
                id="high-contrast-switch" 
                checked={settings.highContrast} 
                onChange={(e) => handleSettingChange('highContrast', e.target.checked)} 
            />
        </div>

        {/* Grayscale */}
        <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground"/>
                <label htmlFor="grayscale-switch" className="text-sm font-medium">{t('grayscale')}</label>
            </div>
            <Switch 
                id="grayscale-switch" 
                checked={settings.grayscale} 
                onChange={(e) => handleSettingChange('grayscale', e.target.checked)}
            />
        </div>

        {/* Reset Button */}
        <div className="border-t pt-2">
             <Button variant="ghost" size="sm" className="w-full" onClick={onReset}>
                <RefreshCcw className="h-4 w-4 mr-2"/>
                {t('resetOptions')}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityMenu;