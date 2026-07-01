/**
 * Supabase Client Configuration
 *
 * Dokumentasi: https://supabase.com/docs/guides/client
 */

import { createClient } from '@supabase/supabase-js'

// Supabase URL dan Anonymous Key
// Dapatkan dari Supabase Dashboard → Project Settings → API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Create Supabase client
 * Gunakan ini untuk browser (client-side)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

/**
 * Get Supabase URL
 */
export function getSupabaseUrl(): string {
  return supabaseUrl
}

/**
 * Get Supabase Anon Key
 */
export function getSupabaseAnonKey(): string {
  return supabaseAnonKey
}

// Re-export createClient for convenience
export { createClient }
