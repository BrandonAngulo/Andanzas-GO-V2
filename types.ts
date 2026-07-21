import React from 'react';

export interface InstitutionalContent {
  id: string; // 'mission', 'what_is', 'who_is', 'website', 'instagram', 'facebook'
  title?: string;
  content_text: string;
}

export interface AvatarPreset {
  id: string;
  name: string;
  type: 'animal' | 'person' | 'symbol' | 'object' | 'hybrid';
  image_url: string;
  personality_title?: string;
  personality_description?: string;
  phrase?: string;
  active?: boolean;
  order_index?: number;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  description?: string;
  type: 'trivia' | 'quiz' | 'daily' | 'guess' | 'visual' | 'matching' | 'ordering';
  status: 'draft' | 'ready' | 'coming_soon' | 'scheduled' | 'published' | 'paused' | 'archived';
  cover_title?: string;
  cover_subtitle?: string;
  cover_image_url?: string;
  cover_theme?: string;
  release_at?: string;
  show_countdown?: boolean;
  featured?: boolean;
  time_limit_seconds?: number;
  points_per_correct_answer?: number;
  leaderboard_enabled?: boolean;
  rating_average?: number | null;
  rating_count?: number;
}

export interface GameQuestion {
  id: string;
  game_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'guess_by_clue' | 'matching' | 'ordering';
  level: number;
  options: any; // jsonb
  correct_answer: any; // jsonb
  explanation?: string;
  category?: string;
  version?: number;
  status?: string;
}

export interface GameSession {
  id: string;
  user_id: string;
  game_id: string;
  status: 'started' | 'completed' | 'abandoned' | 'expired';
  started_at?: string;
  completed_at?: string;
  score?: number;
  correct_answers?: number;
  points_earned?: number;
}

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
  illustration_url?: string;
  illustration_alt?: string;
  illustration_style?: string;
  color_theme?: string;
  created_at?: string;
  // Legacy fields kept for a smooth transition if needed:
  content_simple?: string;
  content_deep?: string;
  curiosity?: string;
  // Editorial status
  status?: 'draft' | 'review' | 'ready' | 'scheduled' | 'published' | 'archived';
  publish_at?: string | null;
  visibility_flags?: {
    show_in_home?: boolean;
    show_as_notification?: boolean;
    is_premium?: boolean;
  };
}

export interface CuriousFact {
  id: string;
  title?: string;
  text: string;
  city: string;
  category: string;
  tags?: string[];
  
  related_entry_id?: string;
  related_route_id?: string;
  related_game_id?: string;
  series_id?: string;

  status: 'draft' | 'review' | 'ready' | 'scheduled' | 'published' | 'archived';

  publish_at?: string;
  published_at?: string;
  archived_at?: string;

  show_in_home?: boolean;
  show_in_pa_que_sepas?: boolean;
  show_as_notification?: boolean;
  show_as_news?: boolean;

  notification_title?: string;
  notification_body?: string;

  created_by?: string;
  updated_by?: string;
  published_by?: string;

  created_at?: string;
  updated_at?: string;
}


export interface Site {
  id: string;
  nombre: string;
  nombre_en?: string;
  tipo: string;
  tipo_en?: string;
  lat: number;
  lng: number;
  rating: number; // legacy
  rating_average?: number | null;
  rating_count?: number;
  visitas: number;
  logoUrl: string;
  descripcion: string;
  descripcion_en?: string;
  status?: 'draft' | 'published' | 'archived';
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
  status?: 'draft' | 'published' | 'archived';
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
  organizer?: 'Andanzas GO' | 'Andanzas Centro Cultural';
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
  image_url?: string;
  puntos: string[];
  duracionMin: number;
  // New rich content fields
  descripcion: string;
  descripcion_en?: string;
  intro_story?: string;
  intro_story_en?: string;
  justificaciones: string[] | Record<string, string>;
  justificaciones_en?: string[] | Record<string, string>;
  recomendaciones: RecomendacionRuta[];
  gamificacion?: any[];
  gamification_level?: 'none' | 'light' | 'medium' | 'full'; // New field for Phase 5
  publico: boolean;
  status?: 'draft' | 'published' | 'archived';
  fully_playable?: boolean;
  content_only?: boolean;
  reward_badge_id?: string;
  mensajeCierre?: string;
  mensajeCierre_en?: string;
  coverUrl?: string;
  emoji?: string;

  // Registration & Capacity
  requires_registration?: boolean;
  max_capacity?: number | null;
  current_registrations?: number;
  registration_status?: 'open' | 'closed' | 'invite_only';
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
  /** Enrutamiento del clic en la bandeja: 'daily_question' | 'badge_earned' | 'broadcast' | ... */
  tipo?: string;
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
  // Insignias progresivas: varias insignias comparten family_key y se ordenan por tier
  // (1=bronce, 2=plata, 3=oro). Insignias de campaña/comportamiento puntual dejan ambos undefined.
  family_key?: string;
  tier?: number;
}

export type FeedItemType = 'anuncio' | 'publicacion_sitio' | 'reseña_usuario';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  fecha: string;
  status?: 'draft' | 'published' | 'archived';
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
  | 'noticias'
  | 'paquesepas'
  | 'juegos'
  | 'diccionario'
  | 'admin';

export interface AppFeature {
  id?: string;
  feature_key: string;
  status: string;
  is_enabled: boolean;
  show_in_menu: boolean;
  release_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DictionaryTag {
  id?: string;
  name: string;
  slug?: string;
  count?: number;
}

export interface DictionarySource {
  id?: string;
  title?: string;
  name?: string;
  author?: string;
  author_or_organization?: string;
  url?: string;
  citation?: string;
}

export interface DictionaryEntry {
  id: string;
  term: string;
  slug: string;
  variants?: string[] | null;
  word_class?: string | null;
  short_definition?: string | null;
  full_definition?: string | null;
  usage_example?: string | null;
  usage_context?: string | null;
  geographic_scope?: string | null;
  social_register?: string | null;
  temporal_status?: string | null;
  etymology?: string | null;
  notes?: string | null;
  image_url?: string | null;
  audio_url?: string | null;
  is_featured?: boolean;
  first_letter?: string | null;
  tags?: DictionaryTag[] | string[] | null;
  sources?: DictionarySource[];
  total_count?: number;
}

export interface DictionaryFacets {
  letters: Array<{ value: string; count?: number }>;
  tags: DictionaryTag[];
  temporalStatuses: Array<{ value: string; count?: number }>;
}

export interface DictionarySearchParams {
  query?: string;
  letter?: string;
  tag?: string;
  temporalStatus?: string;
  limit?: number;
  offset?: number;
}

export interface DictionaryTagOption {
  id: string;
  key: string;
  label: string;
}

/** Full row shape of `dictionary_entries` as used by the admin editor (base table, not the public search RPC). */
export interface DictionaryAdminEntry {
  id: string;
  term: string;
  slug: string;
  variants: string[];
  pronunciation: string | null;
  word_class: string | null;
  short_definition: string | null;
  full_definition: string | null;
  usage_example: string | null;
  usage_context: string | null;
  geographic_scope: string[];
  social_register: string[];
  temporal_status: string;
  etymology: string | null;
  notes: string | null;
  audio_url: string | null;
  image_url: string | null;
  status: string;
  is_featured: boolean;
  publish_at: string | null;
  created_at?: string;
  updated_at?: string;
  tag_ids: string[];
}

/** Writable payload for creating/updating a dictionary entry. */
export interface DictionaryEntryInput {
  term: string;
  slug: string;
  variants: string[];
  pronunciation: string | null;
  word_class: string | null;
  short_definition: string | null;
  full_definition: string | null;
  usage_example: string | null;
  usage_context: string | null;
  geographic_scope: string[];
  social_register: string[];
  temporal_status: string;
  etymology: string | null;
  notes: string | null;
  audio_url: string | null;
  image_url: string | null;
  status: string;
  is_featured: boolean;
  publish_at: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  role?: string;
  full_name?: string;
  city?: string;
  ciudades_visitadas?: string[];
  language?: string;
  avatar_url?: string;
  points: number;
  experience_points?: number;
  lifetime_points?: number;
  level?: number;
  interests: string[];
  travel_style?: string;
  accessibility_needs?: string[];
  accessibility_preferences?: Record<string, boolean>;
  selected_avatar_id?: string;
  leaderboard_opt_in?: boolean;
  public_display_name?: string;
  status?: string; // e.g. 'active' or 'banned'
  created_at?: string;
  legal_accepted_at?: string;
  legal_accepted_version?: string;
  profile_completed?: boolean;
  unlocked_banners?: string[];
  selected_banner_id?: string;
  banner_position?: { x: number; y: number; zoom: number } | null;
  saved_routes?: string[];
  admin_tutorial_version?: string | null;
  admin_tutorial_completed_at?: string | null;
}

// === Phase 5: Gamification & Trivia Models ===

export interface GameChallenge {
  id: string;
  game_id: string;
  challenger_id: string;
  challenged_id: string;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  challenger_score: number;
  challenged_score: number;
  questions_snapshot: GameQuestion[];
  created_at?: string;
  updated_at?: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  session_id?: string;
  event_name: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: any;
  created_at?: string;
}

export interface UserSession {
  id: string;
  user_id?: string;
  session_id: string;
  started_at?: string;
  ended_at?: string;
  duration_seconds?: number;
  device_type?: string;
  city_context?: string;
}

export interface PassportStamp {
  id: string;
  user_id: string;
  stamp_type: 'city' | 'route' | 'game' | 'campaign' | 'event' | 'special';
  entity_id?: string;
  title: string;
  subtitle?: string;
  city?: string;
  icon?: string;
  image_url?: string;
  color_theme?: string;
  unlocked_at?: string;
  created_at?: string;
}

export interface GameAnswer {
  id: string;
  session_id: string;
  question_id: string;
  selected_index: number;
  is_correct: boolean;
  time_taken_sec: number;
  points_earned: number;
}

export interface CustomRouteRequest {
  id: string;
  user_id: string;
  category: string;
  themes: string[];
  cultural_approach: string[];
  group_type: string;
  group_size: number;
  status: 'requested' | 'under_review' | 'accepted' | 'rejected' | 'quote_sent' | 'design_sent' | 'client_approved' | 'scheduled' | 'completed' | 'canceled' | 'rescheduled';
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  preferred_contact_method?: string;
  institution_name?: string;
  age_range?: string;
  difficulty?: string;
  duration_minutes?: number;
  mobility_needs?: string;
  accessibility_needs?: string;
  details?: string;
  preferred_date?: string;
  preferred_start_time?: string;
  date_flexibility?: string;
  meeting_area?: string;
  budget_range?: string;
  additional_notes?: string;
  rules_accepted_at?: string;
  internal_notes?: string;
  quote_amount?: number;
  quote_currency?: string;
  scheduled_at?: string;
  rejection_reason?: string;
  assigned_to?: string;
  updated_at?: string;
  created_at: string;
}

export type AllianceType = 'colaboracion' | 'institucional' | 'creacion' | 'investigacion' | 'otra';
export type AllianceStatus = 'new' | 'in_review' | 'contacted' | 'accepted' | 'declined' | 'archived';

export interface AllianceRequest {
  id: string;
  user_id?: string | null;
  alliance_type: AllianceType;
  contact_name: string;
  organization?: string;
  contact_email: string;
  contact_phone?: string;
  message: string;
  status: AllianceStatus;
  internal_notes?: string;
  created_at: string;
  updated_at?: string;
}
