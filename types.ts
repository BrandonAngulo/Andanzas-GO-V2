import React from 'react';

export interface LearnEntry {
  id: string;
  title: string;
  title_en?: string;
  content_full?: string;
  sabias_que?: string[];
  trivia?: { question: string, options: string[], correct_index: number, feedback_fail: string };
  cta?: string;
  fuentes?: string;
  city: string;
  tags?: string[];
  site_ids?: string[];
  route_ids?: string[];
  image_url?: string;
  created_at: string;
  // Legacy fields kept for a smooth transition if needed:
  content_simple?: string;
  content_deep?: string;
  curiosity?: string;
}

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
  // Capa Breve de Decisión (Activación de Experiencia)
  gancho_emocional?: string;
  gancho_emocional_en?: string;
  por_que_ir?: string[];
  por_que_ir_en?: string[];
  que_hacer?: string;
  que_hacer_en?: string;
  mejor_momento?: string;
  mejor_momento_en?: string;
  ideal_para?: string[];
  ideal_para_en?: string[];
  duracion_sugerida?: string;
  duracion_sugerida_en?: string;
  micro_reto?: string;
  micro_reto_en?: string;
  image_credit?: string;
  accessibility_features?: string[]; // e.g. ['wheelchair', 'audio_guide']
  horario?: string;
  horario_en?: string;
  tarifa?: string;
  tarifa_en?: string;
  direccion?: string;
  direccion_en?: string;
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
  // Rich event fields
  quienes_lideran?: string;
  quienes_lideran_en?: string;
  que_permiten?: string;
  que_permiten_en?: string;
  curiosidades?: string;
  curiosidades_en?: string;
  como_participar?: string;
  como_participar_en?: string;
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
  siteId?: string;
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

  // Connection stories for the WALK to this point
  connection_story?: string;
  connection_story_en?: string;

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
  coverUrl?: string;
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
  icono: React.ElementType; // Fallback
  image_url?: string; // High quality illustration
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
  ciudades_visitadas?: string[];
  language?: string;
  avatar_url?: string;
  points: number;
  level?: number;
  interests: string[];
  travel_style?: string;
  accessibility_needs?: string[];
}
