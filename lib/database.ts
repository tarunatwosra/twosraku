/**
 * Database Helper Utilities
 *
 * Helper functions untuk operasi database yang umum digunakan.
 * Dokumentasi lengkap ada di: database/schema.md
 */

import { supabase } from './supabase'

// ============================================
// TYPE DEFINITIONS
// ============================================

export type TableName =
  | 'academic_years'
  | 'semesters'
  | 'majors'
  | 'classes'
  | 'students'
  | 'student_classes'
  | 'parents'
  | 'attendances'
  | 'assessment_categories'
  | 'assessment_templates'
  | 'assessment_items'
  | 'assessment_sessions'
  | 'assessment_participants'
  | 'student_scores'
  | 'character_categories'
  | 'behavior_types'
  | 'character_events'
  | 'character_records'
  | 'notifications'
  | 'settings'
  | 'audit_logs'

export interface PaginationParams {
  page?: number
  perPage?: number
}

export interface SortParams {
  field: string
  ascending?: boolean
}

export interface FilterParams {
  field: string
  value: string | number | boolean | string[]
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in'
}

export interface QueryOptions {
  filters?: FilterParams[]
  sort?: SortParams
  pagination?: PaginationParams
  select?: string
}

// ============================================
// GENERIC CRUD OPERATIONS
// ============================================

/**
 * Get all records from a table
 */
export async function getAll<T>(
  table: TableName,
  options: QueryOptions = {}
): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    let query = supabase.from(table).select(options.select || '*')

    // Apply filters
    if (options.filters) {
      for (const filter of options.filters) {
        const { field, value, operator = 'eq' } = filter
        switch (operator) {
          case 'eq':
            query = query.eq(field, value)
            break
          case 'neq':
            query = query.neq(field, value)
            break
          case 'gt':
            query = query.gt(field, value)
            break
          case 'gte':
            query = query.gte(field, value)
            break
          case 'lt':
            query = query.lt(field, value)
            break
          case 'lte':
            query = query.lte(field, value)
            break
          case 'like':
            query = query.like(field, String(value))
            break
          case 'ilike':
            query = query.ilike(field, String(value))
            break
          case 'in':
            query = query.in(field, Array.isArray(value) ? value : [value])
            break
        }
      }
    }

    // Apply sorting
    if (options.sort) {
      const { field, ascending = true } = options.sort
      query = query.order(field, { ascending })
    }

    // Apply pagination
    if (options.pagination) {
      const { page = 1, perPage = 25 } = options.pagination
      const from = (page - 1) * perPage
      const to = from + perPage - 1
      query = query.range(from, to)
    }

    const { data, error } = await query

    if (error) throw error

    return { data: data as T[], error: null }
  } catch (error) {
    console.error(`Error fetching ${table}:`, error)
    return { data: null, error: error as Error }
  }
}

/**
 * Get a single record by ID
 */
export async function getById<T>(
  table: TableName,
  id: string,
  select: string = '*'
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.from(table).select(select).eq('id', id).single()

    if (error) throw error

    return { data: data as T, error: null }
  } catch (error) {
    console.error(`Error fetching ${table}/${id}:`, error)
    return { data: null, error: error as Error }
  }
}

/**
 * Create a new record
 */
export async function create<T>(
  table: TableName,
  data: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data: result, error } = await supabase.from(table).insert(data).select().single()

    if (error) throw error

    return { data: result as T, error: null }
  } catch (error) {
    console.error(`Error creating ${table}:`, error)
    return { data: null, error: error as Error }
  }
}

/**
 * Update a record
 */
export async function update<T>(
  table: TableName,
  id: string,
  data: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { data: result as T, error: null }
  } catch (error) {
    console.error(`Error updating ${table}/${id}:`, error)
    return { data: null, error: error as Error }
  }
}

/**
 * Delete a record (soft delete by setting status)
 */
export async function softDelete(
  table: TableName,
  id: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from(table)
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    console.error(`Error soft deleting ${table}/${id}:`, error)
    return { success: false, error: error as Error }
  }
}

/**
 * Hard delete a record (use with caution!)
 */
export async function hardDelete(
  table: TableName,
  id: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.from(table).delete().eq('id', id)

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    console.error(`Error hard deleting ${table}/${id}:`, error)
    return { success: false, error: error as Error }
  }
}

// ============================================
// SPECIALIZED QUERIES
// ============================================

/**
 * Get students with class information
 */
export async function getStudentsWithClass(
  academicYearId?: string,
  options?: QueryOptions
) {
  let query = supabase
    .from('students')
    .select(`
      *,
      student_classes (
        *,
        classes (
          *,
          majors (*)
        )
      )
    `)

  if (academicYearId) {
    query = query.eq('student_classes.academic_year_id', academicYearId)
  }

  if (options?.pagination) {
    const { page = 1, perPage = 25 } = options.pagination
    const from = (page - 1) * perPage
    const to = from + perPage - 1
    query = query.range(from, to)
  }

  const { data, error } = await query

  return { data, error }
}

/**
 * Get attendance statistics for a class
 */
export async function getAttendanceStats(classId: string, semesterId: string) {
  const { data, error } = await supabase
    .from('attendances')
    .select('status')
    .eq('class_id', classId)
    .eq('semester_id', semesterId)

  if (error) return { data: null, error }

  const stats = {
    total: data?.length || 0,
    present: data?.filter((a) => a.status === 'present').length || 0,
    late: data?.filter((a) => a.status === 'late').length || 0,
    permission: data?.filter((a) => a.status === 'permission').length || 0,
    sick: data?.filter((a) => a.status === 'sick').length || 0,
    absent: data?.filter((a) => a.status === 'absent').length || 0,
  }

  return { data: stats, error: null }
}

/**
 * Get active academic year
 */
export async function getActiveAcademicYear() {
  const { data, error } = await supabase
    .from('academic_years')
    .select('*')
    .eq('is_active', true)
    .single()

  return { data, error }
}

/**
 * Get active semester
 */
export async function getActiveSemester(academicYearId: string) {
  const { data, error } = await supabase
    .from('semesters')
    .select('*')
    .eq('academic_year_id', academicYearId)
    .eq('is_active', true)
    .single()

  return { data, error }
}

// ============================================
// COUNT OPERATIONS
// ============================================

export async function countRecords(
  table: TableName,
  filters?: FilterParams[]
): Promise<{ count: number; error: Error | null }> {
  try {
    let query = supabase.from(table).select('*', { count: 'exact', head: true })

    if (filters) {
      for (const filter of filters) {
        const { field, value, operator = 'eq' } = filter
        // Use type assertion for dynamic operator access
        query = (query as any)[operator](field, value)
      }
    }

    const { count, error } = await query

    if (error) throw error

    return { count: count || 0, error: null }
  } catch (error) {
    console.error(`Error counting ${table}:`, error)
    return { count: 0, error: error as Error }
  }
}

// ============================================
// BULK OPERATIONS
// ============================================

/**
 * Bulk insert records
 */
export async function bulkCreate<T>(
  table: TableName,
  data: Partial<T>[]
): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    const { data: result, error } = await supabase.from(table).insert(data as any).select()

    if (error) throw error

    return { data: result as T[], error: null }
  } catch (error) {
    console.error(`Error bulk creating ${table}:`, error)
    return { data: null, error: error as Error }
  }
}

/**
 * Bulk update records
 */
export async function bulkUpdate<T>(
  table: TableName,
  ids: string[],
  data: Partial<T>
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from(table)
      .update({ ...data, updated_at: new Date().toISOString() })
      .in('id', ids)

    if (error) throw error

    return { success: true, error: null }
  } catch (error) {
    console.error(`Error bulk updating ${table}:`, error)
    return { success: false, error: error as Error }
  }
}

// ============================================
// AUDIT LOG
// ============================================

export async function createAuditLog(data: {
  action: string
  module: string
  entity?: string
  entity_id?: string
  old_value?: Record<string, unknown>
  new_value?: Record<string, unknown>
  description?: string
}) {
  const { error } = await supabase.from('audit_logs').insert({
    ...data,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Error creating audit log:', error)
  }

  return { error }
}
