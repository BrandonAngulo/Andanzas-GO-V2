
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
  accessibility_features?: string[]; // e.g. ['wheelchair', 'audio_guide']
  fotos?: string[];
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
  siteId?: string;
  lat?: number;
  lng?: number;
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

export type ChallengeType = 'TRIVIA' | 'CHECKIN' | 'PHOTO';

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  title_en?: string;
  instruction: string;
  instruction_en?: string;
  points_reward: number;
  completed_message: string;
  completed_message_en?: string;

  // Hybrid Validation Options
  allow_manual_trivia?: boolean; // If true, allows fallback to a specific trivia question if GPS fails
  manual_trivia_data?: {
    question: string;
    question_en?: string;
    options: string[];
    options_en?: string[];
    correct_answer: string;
    correct_answer_en?: string;
  };

  // Data for TRIVIA
  quiz_data?: {
    question: string;
    question_en?: string;
    options: string[];
    options_en?: string[];
    correct_answer: string;
    correct_answer_en?: string;
    fun_fact?: string;
    fun_fact_en?: string;
  };

  // Data for CHECKIN
  checkin_data?: {
    latitude?: number;
    longitude?: number;
    radius_meters?: number; // 50m default
  };
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
  intro_story?: string;
  intro_story_en?: string;
  justificaciones: string[];
  justificaciones_en?: string[];
  publico?: boolean;
  recomendaciones?: RecomendacionRuta[];
  gamificacion?: Challenge[];
  reward_badge_id?: string;
  mensajeCierre?: string;
  mensajeCierre_en?: string;
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
  level?: number;
  interests: string[];
  travel_style?: string;
  accessibility_needs?: string[];
}

