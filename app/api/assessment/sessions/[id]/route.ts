/**
 * Single Session API Routes
 *
 * GET    /api/assessment/sessions/[id]     - Get session by ID
 * PUT    /api/assessment/sessions/[id]     - Update session
 * DELETE /api/assessment/sessions/[id]     - Delete session
 * PATCH  /api/assessment/sessions/[id]     - Lock/Unlock session
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get session by ID with all related data
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Get session with template and category
    const { data: session, error: sessionError } = await supabase
      .from("assessment_sessions")
      .select(`
        *,
        assessment_templates (
          id,
          name,
          scoring_method,
          passing_score,
          max_score,
          min_score,
          allow_decimal,
          auto_calculate,
          category_id,
          assessment_categories (
            id,
            name,
            color
          )
        )
      `)
      .eq("id", id)
      .single()

    if (sessionError) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      )
    }

    // Get items for this template
    const { data: items } = await supabase
      .from("assessment_items")
      .select("*")
      .eq("template_id", session.template_id)
      .order("display_order", { ascending: true })

    // Get participants with student info
    const { data: participants } = await supabase
      .from("assessment_participants")
      .select(`
        *,
        students (
          id,
          name,
          student_number
        )
      `)
      .eq("session_id", id)

    // Get scores for this session
    const { data: scores } = await supabase
      .from("student_scores")
      .select("*")
      .eq("session_id", id)

    return NextResponse.json({
      success: true,
      data: {
        ...session,
        items: items || [],
        participants: participants || [],
        scores: scores || [],
      },
    })
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}

// PUT - Update session
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      name,
      templateId,
      academicYearId,
      semesterId,
      classId,
      evaluatorId,
      startDate,
      endDate,
      notes,
      status,
    } = body

    // Check if session exists
    const { data: existing } = await supabase
      .from("assessment_sessions")
      .select("id, name, status, is_locked")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      )
    }

    // Cannot edit locked session
    if (existing.is_locked) {
      return NextResponse.json(
        { success: false, error: "Cannot edit locked session" },
        { status: 400 }
      )
    }

    // Cannot change status if locked
    if (status && existing.status === "locked") {
      return NextResponse.json(
        { success: false, error: "Cannot change status of locked session" },
        { status: 400 }
      )
    }

    // Update session
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.name = name
    if (templateId !== undefined) updateData.template_id = templateId
    if (academicYearId !== undefined) updateData.academic_year_id = academicYearId
    if (semesterId !== undefined) updateData.semester_id = semesterId
    if (classId !== undefined) updateData.class_id = classId
    if (evaluatorId !== undefined) updateData.evaluator_id = evaluatorId
    if (startDate !== undefined) updateData.start_date = startDate
    if (endDate !== undefined) updateData.end_date = endDate
    if (notes !== undefined) updateData.notes = notes
    if (status !== undefined) updateData.status = status

    const { data, error } = await supabase
      .from("assessment_sessions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "update",
      module: "assessment",
      entity: "assessment_sessions",
      entity_id: id,
      old_value: existing,
      new_value: data,
      description: `Updated session: ${name || existing.name}`,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update session" },
      { status: 500 }
    )
  }
}

// PATCH - Lock/Unlock session
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body // "lock" or "unlock"

    // Check if session exists
    const { data: existing } = await supabase
      .from("assessment_sessions")
      .select("id, name, is_locked, status")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      )
    }

    if (action === "lock") {
      // Lock session
      const { data, error } = await supabase
        .from("assessment_sessions")
        .update({
          status: "locked",
          is_locked: true,
          locked_at: new Date().toISOString(),
          locked_by: "system",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Create audit log
      await createAuditLog({
        action: "lock",
        module: "assessment",
        entity: "assessment_sessions",
        entity_id: id,
        description: `Locked session: ${existing.name}`,
      })

      return NextResponse.json({
        success: true,
        data,
        message: "Session locked successfully",
      })
    } else if (action === "unlock") {
      // Unlock session
      const { data, error } = await supabase
        .from("assessment_sessions")
        .update({
          status: "completed",
          is_locked: false,
          locked_at: null,
          locked_by: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Create audit log
      await createAuditLog({
        action: "unlock",
        module: "assessment",
        entity: "assessment_sessions",
        entity_id: id,
        description: `Unlocked session: ${existing.name}`,
      })

      return NextResponse.json({
        success: true,
        data,
        message: "Session unlocked successfully",
      })
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error updating session lock status:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update session lock status" },
      { status: 500 }
    )
  }
}

// DELETE - Delete session
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if session exists and is not locked
    const { data: existing } = await supabase
      .from("assessment_sessions")
      .select("id, name, is_locked")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      )
    }

    if (existing.is_locked) {
      return NextResponse.json(
        { success: false, error: "Cannot delete locked session" },
        { status: 400 }
      )
    }

    // Delete session (participants and scores will be cascade deleted)
    const { error } = await supabase
      .from("assessment_sessions")
      .delete()
      .eq("id", id)

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "delete",
      module: "assessment",
      entity: "assessment_sessions",
      entity_id: id,
      description: `Deleted session: ${existing.name}`,
    })

    return NextResponse.json({
      success: true,
      message: "Session deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete session" },
      { status: 500 }
    )
  }
}
