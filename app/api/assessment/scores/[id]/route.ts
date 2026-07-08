/**
 * Single Score API Routes
 *
 * GET    /api/assessment/scores/[id]    - Get score by ID
 * PUT    /api/assessment/scores/[id]    - Update score
 * DELETE /api/assessment/scores/[id]    - Delete score
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get score by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from("student_scores")
      .select(`
        *,
        assessment_items (
          id,
          name,
          weight,
          max_score,
          min_score
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: "Score not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching score:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch score" },
      { status: 500 }
    )
  }
}

// PUT - Update score
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const { rawScore, finalScore, grade, remark, evidence, status } = body

    // Check if score exists and session is not locked
    const { data: existing } = await supabase
      .from("student_scores")
      .select("id, raw_score, session_id, sessions!inner(locked)")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Score not found" },
        { status: 404 }
      )
    }

    // Check if locked
    const { data: session } = await supabase
      .from("assessment_sessions")
      .select("locked")
      .eq("id", existing.session_id)
      .single()

    if (session?.locked) {
      return NextResponse.json(
        { success: false, error: "Cannot update score in locked session" },
        { status: 400 }
      )
    }

    // Update score
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (rawScore !== undefined) updateData.raw_score = rawScore
    if (finalScore !== undefined) updateData.final_score = finalScore
    if (grade !== undefined) updateData.grade = grade
    if (remark !== undefined) updateData.remark = remark
    if (evidence !== undefined) updateData.evidence = evidence
    if (status !== undefined) updateData.status = status

    const { data, error } = await supabase
      .from("student_scores")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "update",
      module: "assessment",
      entity: "student_scores",
      entity_id: id,
      old_value: { raw_score: existing.raw_score },
      new_value: { raw_score: rawScore },
      description: `Updated score: ${rawScore !== undefined ? rawScore : 'N/A'}`,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error updating score:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update score" },
      { status: 500 }
    )
  }
}

// DELETE - Delete score
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if score exists
    const { data: existing } = await supabase
      .from("student_scores")
      .select("id")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Score not found" },
        { status: 404 }
      )
    }

    // Delete score
    const { error } = await supabase
      .from("student_scores")
      .delete()
      .eq("id", id)

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "delete",
      module: "assessment",
      entity: "student_scores",
      entity_id: id,
      description: `Deleted score: ${id}`,
    })

    return NextResponse.json({
      success: true,
      message: "Score deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting score:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete score" },
      { status: 500 }
    )
  }
}
