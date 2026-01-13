
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Filter, Loader2, Navigation, MapPin, Scan, AlertTriangle, X } from 'lucide-react';
import { Site } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { useI18n } from '../../i18n';
import { getTranslated, cn } from '../../lib/utils';

// TypeScript declaration for the global Leaflet object
declare const L: any;

interface MapaLeafletProps {
  sites: Site[];
  onSelect: (site: Site) => void;
  allCategories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
  onClearCategories: () => void;
  isFiltered: boolean;
  onResetFilter: () => void;
  isLoading?: boolean;
}

const getCategoryIcon = (category: string) => {
  const emojiMap: { [key: string]: string } = {
    "Museo": "🏛️",
    "Museum": "🏛️",
    "Teatro": "🎭",
    "Theater": "🎭",
    "Espacio público": "🌳",
    "Public Space": "🌳",
    "Espacio de Arte": "🎨",
    "Art Space": "🎨",
    "Monumento": "🗿",
    "Monument": "🗿",
    "Centro Cultural": "🏛️",
    "Cultural Center": "🏛️",
    "Centro Cultural Comunitario": "🏘️",
    "Community Cultural Center": "🏘️",
    "Música en Vivo": "🎵",
    "Live Music": "🎵",
    "Escultura": "🗿",
    "Sculpture": "🗿",
    "Gastronomía": "🍽️",
    "Gastronomy": "🍽️",
    "Biblioteca": "📚",
    "Library": "📚",
    "Artesanías": "🏺",
    "Crafts": "🏺",
    "Taller Artesanal": "🛠️",
    "Artisanal Workshop": "🛠️",
    "Muralismo": "🖌️",
    "Muralism": "🖌️",
    "Parque Natural": "🏞️",
    "Natural Park": "🏞️",
    "Parque Natural/Cultural": "🏞️",
    "Natural/Cultural Park": "🏞️",
    "Librería": "📖",
    "Bookstore": "📖",
    "Teatro Experimental": "🎭",
    "Experimental Theater": "🎭",
    "Teatro Comunitario": "🎭",
    "Community Theater": "🎭",
    "Parque Temático": "🎡",
    "Theme Park": "🎡",
    "Zona Gastronómica": "🍴",
    "Gastronomic Zone": "🍴",
    "Universidad": "🎓",
    "University": "🎓",
    "Estadio": "🏟️",
    "Stadium": "🏟️",
    "Iglesia": "⛪",
    "Church": "⛪",
    "Escuela de Salsa": "💃",
    "Salsa School": "💃",
    "Espectáculo de Salsa": "💃",
    "Salsa Show": "💃",
    "Danza": "🩰",
    "Dance": "🩰",
    "Casa Museo": "🏡",
    "House Museum": "🏡",
    "Jardín Botánico": "🌸",
    "Botanical Garden": "🌸",
    "Música": "🎶",
    "Music": "🎶",
    "Hacienda Histórica": "🏰",
    "Historic Estate": "🏰",
    "Museo de Arte": "🖼️",
    "Art Museum": "🖼️",
    "Museo de Ciencias": "🔬",
    "Science Museum": "🔬",
    "Café Cultural": "☕",
    "Cultural Café": "☕",
    "Archivo Cultural": "🎞️",
    "Cultural Archive": "🎞️",
  };
  return emojiMap[category] || "📍";
};

const MapaLeaflet: React.FC<MapaLeafletProps> = ({ sites, onSelect, allCategories, selectedCategories, onCategoryChange, onClearCategories, isFiltered, onResetFilter, isLoading = false }) => {
  const { t, language } = useI18n();
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // L.Map
  const markersRef = useRef<any>(null); // L.LayerGroup
  const userLocationLayerRef = useRef<any>(null); // L.LayerGroup para ubicación usuario
  const watchIdRef = useRef<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof L !== 'undefined') {
        setIsLeafletReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLeafletReady || mapRef.current || !mapDivRef.current) return;

    const map = L.map(mapDivRef.current, { center: [3.4516, -76.532], zoom: 13, scrollWheelZoom: true, zoomControl: false }); // Disable default zoom control

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 20,
    }).addTo(map);

    map.createPane('appPopupPane');
    const appPopupPane = map.getPane('appPopupPane');
    if (appPopupPane) {
      appPopupPane.style.zIndex = 800; // Adjusted to be higher than markers (600)
    }

    // Add zoom control to bottom left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    L.control.scale({ metric: true, imperial: false, position: 'bottomright' }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    userLocationLayerRef.current = L.layerGroup().addTo(map); // Capa dedicada para ubicación
    mapRef.current = map;

    setTimeout(() => map.invalidateSize(), 0);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isLeafletReady]);

  // Limpiar watchPosition al desmontar
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLeafletReady || !mapRef.current || !markersRef.current) return;
    const group = markersRef.current;
    group.clearLayers();

    const bounds = L.latLngBounds([]);
    sites.forEach((s) => {
      const siteName = getTranslated(s, 'nombre', language) as string;
      const siteType = getTranslated(s, 'tipo', language) as string;
      const emoji = getCategoryIcon(siteType);

      const icon = L.divIcon({
        html: `<span class="emoji-marker">${emoji}</span>`,
        className: '', // Leaflet adds its own default, so we clear it
        iconSize: [32, 32],
        iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
      });

      const marker = L.marker([s.lat, s.lng], { icon });
      marker.addTo(group);

      const html = `
        <div class="min-w-44 text-card-foreground">
          <div class="font-medium leading-tight">${siteName}</div>
          <div class="text-xs text-muted-foreground">${siteType}</div>
          <div class="mt-2 flex items-center gap-2">
            <button data-siteid="${s.id}" class="px-2 py-1 rounded-lg border text-sm hover:bg-muted/60 text-card-foreground bg-primary text-primary-foreground font-medium w-full">${t('seeMore')}</button>
          </div>
        </div>`;
      marker.bindPopup(html, { pane: 'appPopupPane' });

      marker.on("popupopen", (e: any) => {
        const btn = e.popup.getElement().querySelector("button[data-siteid]");
        if (btn) {
          btn.addEventListener("click", () => {
            const site = sites.find((x) => x.id === s.id);
            if (site) onSelect(site);
          }, { once: true });
        }
      });
      bounds.extend([s.lat, s.lng]);
    });

    if (sites.length > 0 && bounds.isValid()) {
      // Only auto-fit if not locating
      if (!locating) {
        mapRef.current.fitBounds(bounds, { padding: [40, 40] });
      }
    } else if (sites.length === 0) {
      mapRef.current.setView([3.4516, -76.532], 13);
    }

  }, [sites, onSelect, isLeafletReady, language, t]);

  const toggleLocation = () => {
    if (!isLeafletReady) return;

    // Si ya estamos rastreando, detenemos el rastreo pero dejamos el marcador
    if (locating) {
      setLocating(false);
      setGpsAccuracy(null);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      // Limpiar capa de usuario
      if (userLocationLayerRef.current) {
        userLocationLayerRef.current.clearLayers();
      }
      return;
    }

    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada por tu navegador.");
      return;
    }

    setLocating(true);
    let isFirstUpdate = true;

    const handleLocationError = (error: GeolocationPositionError) => {
      setLocating(false);
      setGpsAccuracy(null);
      let message = "No se pudo obtener tu ubicación.";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = "Permiso de ubicación denegado. Habilita la ubicación en tu navegador.";
          break;
        case error.POSITION_UNAVAILABLE:
          message = "La señal GPS es débil o no está disponible.";
          break;
        case error.TIMEOUT:
          message = "Tiempo de espera agotado. Intenta moverte a un lugar con mejor señal.";
          break;
      }
      alert(message);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };

    const handleLocationSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = pos.coords;
      setGpsAccuracy(Math.round(accuracy));
      const layerGroup = userLocationLayerRef.current;

      if (!mapRef.current || !layerGroup) return;

      layerGroup.clearLayers();

      // Círculo de precisión
      const accuracyCircle = L.circle([latitude, longitude], {
        radius: accuracy,
        color: '#4285F4',
        fillColor: '#4285F4',
        fillOpacity: 0.15,
        weight: 1,
        opacity: 0.4
      });
      accuracyCircle.addTo(layerGroup);

      // Marcador de usuario pulsante
      const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: '<div class="user-location-pulse"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const userMarker = L.marker([latitude, longitude], { icon: userIcon });
      userMarker.addTo(layerGroup);

      // Comportamiento de Zoom Inteligente
      if (isFirstUpdate) {
        // Si la precisión es baja (> 100m), ajustamos el mapa para mostrar todo el círculo de incertidumbre
        if (accuracy > 100) {
          mapRef.current.fitBounds(accuracyCircle.getBounds(), { padding: [50, 50] });
        } else {
          // Si la precisión es buena, volamos cerca
          mapRef.current.flyTo([latitude, longitude], 17, { duration: 1.5 });
        }
        isFirstUpdate = false;
      }
    };

    const geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 30000, // Aumentado a 30s para dar tiempo al GPS
      maximumAge: 0 // No usar caché
    };

    watchIdRef.current = navigator.geolocation.watchPosition(handleLocationSuccess, handleLocationError, geolocationOptions);
  };

  const adjustToResults = () => {
    if (!isLeafletReady || !mapRef.current || !markersRef.current) return;
    const layers = markersRef.current.getLayers();
    if (layers.length === 0) return;
    const b = L.latLngBounds(layers.map((l: any) => l.getLatLng()));
    if (b.isValid()) mapRef.current.fitBounds(b, { padding: [40, 40] });
  };

  return (
    <div className="relative h-[66vh] md:h-[72vh] rounded-b-xl overflow-hidden group">
      <style>
        {`
          .user-location-pulse {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #4285F4;
            border: 3px solid white;
            box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7);
            animation: pulse-blue 2s infinite;
          }
          
          @keyframes pulse-blue {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 15px rgba(66, 133, 244, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
            }
          }
        `}
      </style>
      <div ref={mapDivRef} className="h-full w-full z-[1]" />

      {isLeafletReady && (
        <div className="absolute inset-0 z-[400] pointer-events-none p-3">
          {/* Badge moved to Top-Left for better visibility on mobile */}
          <div className="absolute top-3 left-3 pointer-events-auto flex flex-col gap-2 items-start">
            <Badge variant="secondary" className="shadow-md bg-background/90 backdrop-blur border-none px-3 py-1.5 text-sm font-medium flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="hidden xs:inline">{t('mappedSites', { count: sites.length })}</span>
              <span className="xs:hidden font-bold">{sites.length}</span>
            </Badge>

            {/* Indicador de precisión GPS */}
            {locating && gpsAccuracy !== null && (
              <Badge
                variant={gpsAccuracy > 100 ? "destructive" : "default"}
                className={cn(
                  "shadow-md backdrop-blur border-none px-3 py-1 text-xs font-medium flex items-center gap-1.5 animate-in slide-in-from-left-2",
                  gpsAccuracy > 100 ? "bg-orange-500/90 text-white" : "bg-blue-500/90 text-white"
                )}
              >
                {gpsAccuracy > 100 ? <AlertTriangle className="h-3 w-3" /> : <Navigation className="h-3 w-3" />}
                <span>GPS: ±{gpsAccuracy}m</span>
              </Badge>
            )}
          </div>

          {/* Controls moved to Right side, optimized for mobile as icon-buttons */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 pointer-events-auto">

            {/* Botón para resetear filtros (aparece si hay filtro activo) */}
            {isFiltered && (
              <Button
                onClick={onResetFilter}
                size="sm"
                variant="secondary"
                className="shadow-md h-10 w-auto px-3 rounded-full md:rounded-md animate-in fade-in slide-in-from-top-1 bg-white/90 text-primary border border-primary/20 hover:bg-white"
                aria-label={t('showAll')}
              >
                <X className="h-4 w-4 mr-1" />
                <span className="text-xs font-semibold">{t('showAll')}</span>
              </Button>
            )}

            <Button
              onClick={toggleLocation}
              size="sm"
              className={cn(
                "shadow-md transition-all",
                locating ? "bg-blue-600 animate-pulse text-white border-blue-500" : "bg-background/90 text-foreground hover:bg-background",
                "h-10 w-10 p-0 md:h-9 md:w-auto md:px-3 rounded-full md:rounded-md"
              )}
              variant={locating ? 'default' : 'outline'}
              aria-label={t('myLocation')}
            >
              {locating ? <Loader2 className="h-5 w-5 md:h-4 md:w-4 animate-spin md:mr-2" /> : <Navigation className="h-5 w-5 md:h-4 md:w-4 md:mr-2" />}
              <span className="hidden md:inline">{locating ? t('locating') : t('myLocation')}</span>
            </Button>

            <Button
              onClick={adjustToResults}
              size="sm"
              variant="outline"
              className="bg-background/90 backdrop-blur shadow-md h-10 w-10 p-0 md:h-9 md:w-auto md:px-3 rounded-full md:rounded-md"
              aria-label={t('adjustToResults')}
            >
              <Scan className="h-5 w-5 md:hidden" />
              <span className="hidden md:inline">{t('adjustToResults')}</span>
            </Button>

            <div className="relative">
              <Button
                variant={selectedCategories.length > 0 ? "default" : "outline"}
                size="sm"
                className={cn(
                  "bg-background/90 backdrop-blur shadow-md h-10 w-10 p-0 md:h-9 md:w-auto md:px-3 rounded-full md:rounded-md"
                )}
                onClick={() => setShowFilterPanel(s => !s)}
                aria-label={t('filter')}
              >
                <Filter className="h-5 w-5 md:h-4 md:w-4 md:mr-2" />
                <span className="hidden md:inline">{t('filter')}</span>
                {selectedCategories.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground md:static md:ml-1 md:bg-transparent md:text-inherit md:h-auto md:w-auto md:p-0 ring-2 ring-background md:ring-0">
                    {selectedCategories.length}
                  </span>
                )}
              </Button>
              {showFilterPanel && (
                <Card className="absolute top-full right-0 mt-2 w-64 shadow-xl border-input z-[1000] animate-in fade-in zoom-in-95 origin-top-right">
                  <CardHeader className="p-3 border-b flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">{t('categories')}</CardTitle>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary" onClick={() => { onClearCategories(); setShowFilterPanel(false); }} disabled={selectedCategories.length === 0}>{t('clear')}</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-64">
                      <div className="p-3 space-y-2">
                        {allCategories.map(category => (
                          <div key={category} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`cat-${category}`}
                              checked={selectedCategories.includes(category)}
                              onChange={(e) => onCategoryChange(category, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                            />
                            <label htmlFor={`cat-${category}`} className="text-sm text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 z-[300] grid place-items-center bg-background/50 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Cargando mapa...</p>
          </div>
        </div>
      )}

      {!isLoading && sites.length === 0 && (
        <div className="absolute inset-0 z-[300] grid place-items-center bg-background/70 text-sm backdrop-blur-[1px]">
          <div className="bg-background p-4 rounded-lg shadow-lg text-center">
            <p>{t('noPlacesFound')}</p>
            <div className="flex gap-2 justify-center mt-2">
              <Button variant="link" onClick={onClearCategories}>{t('clear')}</Button>
              {isFiltered && <Button variant="outline" size="sm" onClick={onResetFilter}>{t('showAll')}</Button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaLeaflet;
