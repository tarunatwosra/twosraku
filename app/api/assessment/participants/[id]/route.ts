/**
 * Single Participant API Routes
 *
 * GET    /api/assessment/participants/[id]  - Get participant by ID
 * PUT    /api/assessment/participants/[id]  - Update participant
 * DELETE /api/assessment/participants/[id]  - Remove participant
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get participant by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from("assessment_participants")
      .select(`
        *,
        students (
          id,
          name,
          student_number
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: "Participant not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching participant:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch participant" },
      { status: 500 }
    )
  }
}

// PUT - Update participant
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const { status, notes } = body

    // Check if participant exists and session is not locked
    const { data: existing } = await supabase
      .from("assessment_participants")
      .select("id, status, sessions!inner(locked)")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Participant not found" },
        { status: 404 }
      )
    }

    // Update participant
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    const { data, error } = await supabase
      .from("assessment_participants")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "update",
      module: "assessment",
      entity: "assessment_participants",
      entity_id: id,
      old_value: existing,
      new_value: data,
      description: `Updated participant status: ${status || existing.status}`,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error updating participant:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update participant" },
      { status: 500 }
    )
  }
}

// DELETE - Remove participant
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if participant exists and session is not locked
    const { data: existing } = await supabase
      .from("assessment_participants")
      .select("id, student_id")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Participant not found" },
        { status: 404 }
      )
    }

    // Delete participant (scores will be cascade deleted)
    const { error } = await supabase
      .from("assessment_participants")
      .delete()
      .eq("id", id)

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "delete",
      module: "assessment",
      entity: "assessment_participants",
      entity_id: id,
      description: `Removed participant: ${existing.student_id}`,
    })

    return NextResponse.json({
      success: true,
      message: "Participant removed successfully",
    })
  } catch (error) {
    console.error("Error removing participant:", error)
    return NextResponse.json(
      { success: false, error: "Failed to remove participant" },
      { status: 500 }
    )
  }
}
