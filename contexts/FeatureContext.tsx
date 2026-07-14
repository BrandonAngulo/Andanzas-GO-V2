import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppFeature } from '../types';
import { dictionaryService, isFeaturePublic } from '../services/dictionary.service';

interface FeatureContextValue {
  dictionaryFeature: AppFeature | null;
  dictionaryVisible: boolean;
  loadingFeatures: boolean;
  refreshDictionaryFeature: () => Promise<void>;
}

const FeatureContext = createContext<FeatureContextValue | undefined>(undefined);

export function FeatureProvider({ children }: React.PropsWithChildren): JSX.Element {
  const [dictionaryFeature, setDictionaryFeature] = useState<AppFeature | null>(null);
  const [loadingFeatures, setLoadingFeatures] = useState(true);

  const refreshDictionaryFeature = useCallback(async () => {
    try {
      setDictionaryFeature(await dictionaryService.getFeature());
    } catch (error) {
      console.error('No se pudo consultar la función del diccionario:', error);
      setDictionaryFeature(null);
    } finally {
      setLoadingFeatures(false);
    }
  }, []);

  useEffect(() => { void refreshDictionaryFeature(); }, [refreshDictionaryFeature]);

  const value = useMemo(() => ({
    dictionaryFeature,
    dictionaryVisible: isFeaturePublic(dictionaryFeature),
    loadingFeatures,
    refreshDictionaryFeature,
  }), [dictionaryFeature, loadingFeatures, refreshDictionaryFeature]);

  return <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>;
}

export function useFeatures(): FeatureContextValue {
  const value = useContext(FeatureContext);
  if (!value) throw new Error('useFeatures must be used within a FeatureProvider');
  return value;
}
