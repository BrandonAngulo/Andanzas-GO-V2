
import React from 'react';

export interface Site {
  id: string;
  nombre: string;
  nombre_en?: string;
  tipo: string;
  tipo_en?: string;
  lat: number;
  lng: number;
  rating: number;
  visitas: number;
  logoUrl: string;
  descripcion: string;
  descripcion_en?: string;
  // New rich content fields
  importancia?: string;
  importancia_en?: string;
  datosHistoricos?: string;
  datosHistoricos_en?: string;
  reconocimientos?: string[];
  reconocimientos_en?: string[];
  datosCuriosos?: string[];
  datosCuriosos_en?: string[];
  image_credit?: string;
}

export interface Evento {
  id: string;
  titulo: string;
  titulo_en?: string;
  fecha: string;
  lugar: string;
  lugar_en?: string;
  resumen: string;
  resumen_en?: string;
  img: string;
  descripcion: string;
  descripcion_en?: string;
}

export type RecomendacionTipo = 'Música' | 'Sabores' | 'Experiencia' | 'Vestuario' | 'Bebida' | 'Mejor Hora' | 'Snack' | 'Seguridad' | 'Sabor' | 'Foto' | 'Transporte' | 'Salud' | 'Horario' | 'Planificación' | 'Ubicación';
export type RecomendacionTipo_en = 'Music' | 'Flavors' | 'Experience' | 'Attire' | 'Drink' | 'Best Time' | 'Snack' | 'Safety' | 'Flavor' | 'Photo' | 'Transport' | 'Health' | 'Schedule' | 'Planning' | 'Location';


export interface RecomendacionRuta {
  tipo: RecomendacionTipo;
  tipo_en?: RecomendacionTipo_en;
  titulo: string;
  titulo_en?: string;
  descripcion: string;
  descripcion_en?: string;
}

export interface GamificacionPunto {
  pregunta: string;
  pregunta_en?: string;
  opciones: string[];
  opciones_en?: string[];
  respuestaCorrecta: string;
  respuestaCorrecta_en?: string;
  datoCurioso: string;
  datoCurioso_en?: string;
  reto: string;
  reto_en?: string;
}

export interface Ruta {
  id: string;
  nombre: string;
  nombre_en?: string;
  puntos: string[];
  duracionMin: number;
  // New rich content fields
  descripcion: string;
  descripcion_en?: string;
  justificaciones: string[];
  justificaciones_en?: string[];
  publico?: boolean;
  recomendaciones?: RecomendacionRuta[];
  gamificacion?: GamificacionPunto[];
}

export interface Review {
  id: string;
  siteId: string;
  text: string;
  rating: number;
  fotos: string[];
  createdAt: string;
}

export interface Notificacion {
  id: string;
  titulo: string;
  titulo_en?: string;
  descripcion: string;
  descripcion_en?: string;
  fecha: string;
  leida: boolean;
  icono: React.ElementType;
}

export interface Insignia {
  id: string;
  nombre: string;
  nombre_en?: string;
  descripcion: string;
  descripcion_en?: string;
  icono: React.ElementType; // Changed from string to ElementType
  obtenida?: boolean;
}

export type FeedItemType = 'anuncio' | 'publicacion_sitio' | 'reseña_usuario';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  fecha: string;
  // For 'anuncio'
  titulo?: string;
  titulo_en?: string;
  contenido?: string;
  contenido_en?: string;
  icono?: React.ElementType;
  // For 'publicacion_sitio'
  siteId?: string;
  // For 'reseña_usuario'
  review?: Review;
}

export type ActivePanelType =
  | 'mapa'
  | 'explorar'
  | 'rutas'
  | 'eventos'
  | 'tendencias'
  | 'favoritos'
  | 'reseñas'
  | 'perfil'
  | 'configuracion'
  | 'sobre'
  | 'soporte'
  | 'noticias';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  city?: string;
  language?: string;
  avatar_url?: string;
  points: number;
  interests: string[];
}

