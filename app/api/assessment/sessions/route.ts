/**
 * Assessment Sessions API Routes
 *
 * GET    /api/assessment/sessions     - Get all sessions
 * POST   /api/assessment/sessions     - Create new session
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

// GET - Get all sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get("templateId")
    const status = searchParams.get("status")
    const academicYearId = searchParams.get("academicYearId")
    const semesterId = searchParams.get("semesterId")
    const classId = searchParams.get("classId")
    const search = searchParams.get("search")

    let query = supabase
      .from("assessment_sessions")
      .select(`
        *,
        assessment_templates (
          id,
          name,
          category_id,
          assessment_categories (
            id,
            name,
            color
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (templateId) {
      query = query.eq("template_id", templateId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (academicYearId) {
      query = query.eq("academic_year_id", academicYearId)
    }

    if (semesterId) {
      query = query.eq("semester_id", semesterId)
    }

    if (classId) {
      query = query.eq("class_id", classId)
    }

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    // Get participant counts for each session
    const sessionsWithCounts = await Promise.all(
      (data || []).map(async (session) => {
        const { count } = await supabase
          .from("assessment_participants")
          .select("*", { count: "exact", head: true })
          .eq("session_id", session.id)

        return {
          ...session,
          participantCount: count || 0,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: sessionsWithCounts,
      count: sessionsWithCounts.length,
    })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}

// POST - Create new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      templateId,
      name,
      academicYearId,
      semesterId,
      classId,
      evaluatorId,
      startDate,
      endDate,
      notes,
    } = body

    // Validation
    if (!templateId || !name) {
      return NextResponse.json(
        { success: false, error: "Template ID and name are required" },
        { status: 400 }
      )
    }

    // Check if template exists
    const { data: template } = await supabase
      .from("assessment_templates")
      .select("id, name")
      .eq("id", templateId)
      .single()

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      )
    }

    // Create session
    const { data, error } = await supabase
      .from("assessment_sessions")
      .insert({
        template_id: templateId,
        name,
        academic_year_id: academicYearId || "1",
        semester_id: semesterId || "1",
        class_id: classId,
        evaluator_id: evaluatorId || "system",
        start_date: startDate,
        end_date: endDate,
        notes,
        status: "draft",
        locked: false,
      })
      .select()
      .single()

    if (error) throw error

    // Create activity log
    await createAuditLog({
      action: "create",
      module: "assessment",
      entity: "assessment_sessions",
      entity_id: data.id,
      new_value: data,
      description: `Created session: ${name}`,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create session" },
      { status: 500 }
    )
  }
}
