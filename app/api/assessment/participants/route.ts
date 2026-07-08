/**
 * Assessment Participants API Routes
 *
 * GET    /api/assessment/participants      - Get all participants (filter by sessionId)
 * POST   /api/assessment/participants      - Create new participant(s)
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

// GET - Get all participants
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const status = searchParams.get("status")

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId is required" },
        { status: 400 }
      )
    }

    let query = supabase
      .from("assessment_participants")
      .select(`
        *,
        students (
          id,
          name,
          student_number
        )
      `)
      .eq("session_id", sessionId)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0,
    })
  } catch (error) {
    console.error("Error fetching participants:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch participants" },
      { status: 500 }
    )
  }
}

// POST - Create new participant(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, studentIds, classId } = body

    // Validation
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId is required" },
        { status: 400 }
      )
    }

    // Check if session exists and is not locked
    const { data: session } = await supabase
      .from("assessment_sessions")
      .select("id, locked")
      .eq("id", sessionId)
      .single()

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      )
    }

    if (session.locked) {
      return NextResponse.json(
        { success: false, error: "Cannot add participants to locked session" },
        { status: 400 }
      )
    }

    let participantsToAdd: { session_id: string; student_id: string; status: string }[] = []

    // If studentIds provided, use them directly
    if (studentIds && Array.isArray(studentIds)) {
      participantsToAdd = studentIds.map((studentId: string) => ({
        session_id: sessionId,
        student_id: studentId,
        status: "assigned",
      }))
    }
    // If classId provided, get students from that class
    else if (classId) {
      const { data: students } = await supabase
        .from("students")
        .select("id")
        .eq("class_id", classId)

      if (students) {
        participantsToAdd = students.map((student) => ({
          session_id: sessionId,
          student_id: student.id,
          status: "assigned",
        }))
      }
    }

    if (participantsToAdd.length === 0) {
      return NextResponse.json(
        { success: false, error: "No participants to add" },
        { status: 400 }
      )
    }

    // Filter out existing participants
    const studentIdsToAdd = participantsToAdd.map((p) => p.student_id)
    const { data: existing } = await supabase
      .from("assessment_participants")
      .select("student_id")
      .eq("session_id", sessionId)
      .in("student_id", studentIdsToAdd)

    const existingIds = new Set(existing?.map((e) => e.student_id) || [])
    const newParticipants = participantsToAdd.filter(
      (p) => !existingIds.has(p.student_id)
    )

    if (newParticipants.length === 0) {
      return NextResponse.json(
        { success: true, data: [], message: "All selected students are already participants" },
        { status: 200 }
      )
    }

    // Insert new participants
    const { data, error } = await supabase
      .from("assessment_participants")
      .insert(newParticipants)
      .select()

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "add_participants",
      module: "assessment",
      entity: "assessment_participants",
      entity_id: sessionId,
      new_value: { count: newParticipants.length },
      description: `Added ${newParticipants.length} participants to session`,
    })

    return NextResponse.json({
      success: true,
      data,
      added: newParticipants.length,
    })
  } catch (error) {
    console.error("Error creating participants:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create participants" },
      { status: 500 }
    )
  }
}
