import { supabase } from '../lib/supabaseClient';
import type { AppFeature, DictionaryEntry, DictionaryFacets, DictionarySearchParams, DictionarySource, DictionaryTag } from '../types';

export const DICTIONARY_FEATURE_KEY = 'dictionary_caleno';

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
};
