import { supabase } from '../lib/supabaseClient';
import type { AppFeature, DictionaryAdminEntry, DictionaryEntry, DictionaryEntryInput, DictionaryFacets, DictionarySearchParams, DictionarySource, DictionaryTag, DictionaryTagOption } from '../types';

export const DICTIONARY_FEATURE_KEY = 'dictionary_caleno';

/** Turns a term into a URL-friendly slug (lowercase, accent-free, hyphenated). */
export const slugifyTerm = (term: string): string =>
  term
    .normalize('NFD')
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeFacet = (item: unknown): { value: string; count?: number } | null => {
  if (typeof item === 'string') return { value: item };
  if (!item || typeof item !== 'object') return null;
  const record = item as Record<string, unknown>;
  const value = String(record.value ?? record.key ?? record.letter ?? record.status ?? record.name ?? '');
  return value ? { value, count: typeof record.count === 'number' ? record.count : undefined } : null;
};

const normalizeTag = (item: unknown): DictionaryTag | null => {
  if (typeof item === 'string') return { name: item, slug: item };
  if (!item || typeof item !== 'object') return null;
  const record = item as Record<string, unknown>;
  const name = String(record.name ?? record.label ?? record.slug ?? record.key ?? record.value ?? '');
  return name ? {
    id: record.id ? String(record.id) : undefined,
    name,
    slug: record.slug || record.key ? String(record.slug ?? record.key) : undefined,
    count: typeof record.count === 'number' ? record.count : undefined,
  } : null;
};

export const isFeaturePublic = (feature: AppFeature | null | undefined): boolean => {
  if (!feature || feature.status !== 'published' || !feature.is_enabled || !feature.show_in_menu) return false;
  return !feature.release_at || new Date(feature.release_at).getTime() <= Date.now();
};

export const dictionaryService = {
  async getFeature(): Promise<AppFeature | null> {
    const { data, error } = await supabase.from('app_features').select('*').eq('feature_key', DICTIONARY_FEATURE_KEY).maybeSingle();
    if (error) throw error;
    return data as AppFeature | null;
  },

  async search(params: DictionarySearchParams = {}): Promise<{ entries: DictionaryEntry[]; total: number }> {
    const { data, error } = await supabase.rpc('search_dictionary_cards', {
      p_query: params.query?.trim() || null,
      p_letter: params.letter || null,
      p_tag: params.tag || null,
      p_temporal_status: params.temporalStatus || null,
      p_limit: params.limit ?? 24,
      p_offset: params.offset ?? 0,
    });
    if (error) throw error;
    const entries = ((data ?? []) as DictionaryEntry[]).map((entry) => ({
      ...entry,
      tags: Array.isArray(entry.tags) ? entry.tags.map(normalizeTag).filter(Boolean) as DictionaryTag[] : [],
    }));
    return { entries, total: Number(entries[0]?.total_count ?? entries.length) };
  },

  async getFacets(): Promise<DictionaryFacets> {
    const { data, error } = await supabase.rpc('get_dictionary_facets');
    if (error) throw error;
    const record = (Array.isArray(data) ? data[0] : data ?? {}) as Record<string, unknown>;
    const letters = ((record.letters ?? record.first_letters ?? []) as unknown[]).map(normalizeFacet).filter(Boolean) as DictionaryFacets['letters'];
    const tags = ((record.tags ?? record.categories ?? []) as unknown[]).map(normalizeTag).filter(Boolean) as DictionaryTag[];
    const temporalStatuses = ((record.temporal_statuses ?? record.temporalStatus ?? record.vigencias ?? []) as unknown[]).map(normalizeFacet).filter(Boolean) as DictionaryFacets['temporalStatuses'];
    return { letters, tags, temporalStatuses };
  },

  async getSources(entryId: string): Promise<DictionarySource[]> {
    const { data, error } = await supabase
      .from('dictionary_entry_sources')
      .select('dictionary_sources(*)')
      .eq('entry_id', entryId);
    if (error) throw error;
    return (data ?? []).flatMap((row: any) => row.dictionary_sources ? [row.dictionary_sources as DictionarySource] : []);
  },

  async getEntryCount(): Promise<number> {
    const { count, error } = await supabase.from('dictionary_entries').select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count ?? 0;
  },

  async setEnabled(enabled: boolean): Promise<AppFeature> {
    const values = enabled
      ? { status: 'published', is_enabled: true, show_in_menu: true }
      : { status: 'ready', is_enabled: false, show_in_menu: false };
    const { data, error } = await supabase.from('app_features').update(values).eq('feature_key', DICTIONARY_FEATURE_KEY).select().single();
    if (error) throw error;
    return data as AppFeature;
  },

  async setMenuVisibility(showInMenu: boolean): Promise<AppFeature> {
    const { data, error } = await supabase.from('app_features').update({ show_in_menu: showInMenu }).eq('feature_key', DICTIONARY_FEATURE_KEY).select().single();
    if (error) throw error;
    return data as AppFeature;
  },

  // --- Admin CRUD (requires an authenticated admin/editor session; enforced by RLS) ---

  async listTags(): Promise<DictionaryTagOption[]> {
    const { data, error } = await supabase.from('dictionary_tags').select('id, key, label').order('label');
    if (error) throw error;
    return (data ?? []) as DictionaryTagOption[];
  },

  async listEntries(params: { query?: string; limit?: number; offset?: number } = {}): Promise<{ entries: DictionaryAdminEntry[]; total: number }> {
    const limit = params.limit ?? 20;
    const offset = params.offset ?? 0;
    let builder = supabase
      .from('dictionary_entries')
      .select('*, dictionary_entry_tags(tag_id)', { count: 'exact' })
      .order('term', { ascending: true })
      .range(offset, offset + limit - 1);
    const query = params.query?.trim();
    if (query) {
      const escaped = query.replace(/[%,()]/g, ' ');
      builder = builder.or(`term.ilike.%${escaped}%,short_definition.ilike.%${escaped}%,full_definition.ilike.%${escaped}%`);
    }
    const { data, error, count } = await builder;
    if (error) throw error;
    const entries = ((data ?? []) as any[]).map((row) => ({
      ...row,
      variants: row.variants ?? [],
      geographic_scope: row.geographic_scope ?? [],
      social_register: row.social_register ?? [],
      tag_ids: Array.isArray(row.dictionary_entry_tags) ? row.dictionary_entry_tags.map((t: any) => t.tag_id as string) : [],
    })) as DictionaryAdminEntry[];
    return { entries, total: count ?? entries.length };
  },

  async createEntry(input: DictionaryEntryInput, tagIds: string[], userId?: string | null): Promise<DictionaryAdminEntry> {
    const { data, error } = await supabase
      .from('dictionary_entries')
      .insert({ ...input, created_by: userId ?? null, updated_by: userId ?? null })
      .select('id')
      .single();
    if (error) throw error;
    const entryId = (data as { id: string }).id;
    await this.replaceEntryTags(entryId, tagIds);
    return { ...(input as unknown as DictionaryAdminEntry), id: entryId, tag_ids: tagIds };
  },

  async updateEntry(id: string, input: DictionaryEntryInput, tagIds: string[], userId?: string | null): Promise<DictionaryAdminEntry> {
    const { error } = await supabase
      .from('dictionary_entries')
      .update({ ...input, updated_by: userId ?? null })
      .eq('id', id);
    if (error) throw error;
    await this.replaceEntryTags(id, tagIds);
    return { ...(input as unknown as DictionaryAdminEntry), id, tag_ids: tagIds };
  },

  async replaceEntryTags(entryId: string, tagIds: string[]): Promise<void> {
    const { error: deleteError } = await supabase.from('dictionary_entry_tags').delete().eq('entry_id', entryId);
    if (deleteError) throw deleteError;
    if (tagIds.length) {
      const rows = tagIds.map((tagId) => ({ entry_id: entryId, tag_id: tagId }));
      const { error: insertError } = await supabase.from('dictionary_entry_tags').insert(rows);
      if (insertError) throw insertError;
    }
  },

  async deleteEntry(id: string): Promise<void> {
    // dictionary_entry_tags / _sources cascade on delete of the parent entry.
    const { error } = await supabase.from('dictionary_entries').delete().eq('id', id);
    if (error) throw error;
  },

  async bulkSetStatus(ids: string[], status: 'published' | 'draft', userId?: string | null): Promise<void> {
    if (!ids.length) return;
    const { error } = await supabase.from('dictionary_entries').update({ status, updated_by: userId ?? null }).in('id', ids);
    if (error) throw error;
  },

  async bulkDelete(ids: string[]): Promise<void> {
    if (!ids.length) return;
    const { error } = await supabase.from('dictionary_entries').delete().in('id', ids);
    if (error) throw error;
  },

  // --- Palabra del día ---

  /** Devuelve la palabra del día: cualquier entrada publicada del diccionario, misma para todos y rotando a diario. */
  async getWordOfTheDay(): Promise<DictionaryEntry | null> {
    const { data, error } = await supabase
      .from('dictionary_entries')
      .select('*')
      .eq('status', 'published')
      .order('id', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return null;
    const dayNumber = Math.floor(Date.now() / 86_400_000); // día UTC desde epoch
    const row = data[dayNumber % data.length] as any;
    return {
      ...row,
      variants: Array.isArray(row.variants) ? row.variants : [],
      geographic_scope: Array.isArray(row.geographic_scope) ? row.geographic_scope.join(', ') : row.geographic_scope,
      social_register: Array.isArray(row.social_register) ? row.social_register.join(', ') : row.social_register,
    } as DictionaryEntry;
  },

  /** Todas las entradas publicadas (para auto-enlazar términos en textos como las trivias). */
  async listPublishedForLinking(): Promise<DictionaryEntry[]> {
    const { data, error } = await supabase
      .from('dictionary_entries')
      .select('*')
      .eq('status', 'published')
      .order('term', { ascending: true });
    if (error) { console.error('No se pudieron cargar términos del diccionario:', error); return []; }
    return ((data ?? []) as any[]).map((row) => ({
      ...row,
      variants: Array.isArray(row.variants) ? row.variants : [],
      geographic_scope: Array.isArray(row.geographic_scope) ? row.geographic_scope.join(', ') : row.geographic_scope,
      social_register: Array.isArray(row.social_register) ? row.social_register.join(', ') : row.social_register,
    })) as DictionaryEntry[];
  },

  /** Reclama la palabra del día (una vez por día): otorga puntos y actualiza la racha. */
  async claimWordOfTheDay(): Promise<{ ok: boolean; alreadyClaimed: boolean; awardedPoints: number; streak: number; bestStreak: number }> {
    const { data, error } = await supabase.rpc('claim_word_of_the_day');
    if (error) throw error;
    const r = (data ?? {}) as Record<string, unknown>;
    return {
      ok: Boolean(r.ok),
      alreadyClaimed: Boolean(r.already_claimed),
      awardedPoints: Number(r.awarded_points ?? 0),
      streak: Number(r.streak ?? 0),
      bestStreak: Number(r.best_streak ?? 0),
    };
  },

  /** Racha actual del usuario para la palabra del día (para mostrarla en la tarjeta). */
  async getWordStreak(userId: string): Promise<{ currentStreak: number; bestStreak: number; claimedToday: boolean } | null> {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('user_word_of_day')
      .select('current_streak, best_streak, last_claim_date')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) { console.error('No se pudo leer la racha:', error); return null; }
    if (!data) return { currentStreak: 0, bestStreak: 0, claimedToday: false };
    const today = new Date().toISOString().slice(0, 10);
    return {
      currentStreak: data.current_streak ?? 0,
      bestStreak: data.best_streak ?? 0,
      claimedToday: data.last_claim_date === today,
    };
  },
};
