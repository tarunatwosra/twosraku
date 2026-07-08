/**
 * Assessment Scores API Routes
 *
 * GET    /api/assessment/scores      - Get all scores (filter by sessionId)
 * POST   /api/assessment/scores      - Create/Update score(s)
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

// GET - Get all scores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const participantId = searchParams.get("participantId")
    const itemId = searchParams.get("itemId")

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId is required" },
        { status: 400 }
      )
    }

    let query = supabase
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
      .eq("session_id", sessionId)

    if (participantId) {
      query = query.eq("participant_id", participantId)
    }

    if (itemId) {
      query = query.eq("item_id", itemId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0,
    })
  } catch (error) {
    console.error("Error fetching scores:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch scores" },
      { status: 500 }
    )
  }
}

// POST - Create or Update score(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, scores } = body

    // Validation
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId is required" },
        { status: 400 }
      )
    }

    if (!scores || !Array.isArray(scores) || scores.length === 0) {
      return NextResponse.json(
        { success: false, error: "scores array is required" },
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
        { success: false, error: "Cannot save scores to locked session" },
        { status: 400 }
      )
    }

    // Process each score - upsert
    const results = []
    const errors = []

    for (const score of scores) {
      const { participantId, itemId, rawScore, finalScore, grade, remark, evaluatorId } = score

      if (!participantId || !itemId) {
        errors.push({ participantId, itemId, error: "participantId and itemId are required" })
        continue
      }

      // Check if score already exists
      const { data: existing } = await supabase
        .from("student_scores")
        .select("id, raw_score")
        .eq("participant_id", participantId)
        .eq("item_id", itemId)
        .single()

      if (existing) {
        // Update existing score
        const updateData: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
          status: "saved",
        }

        if (rawScore !== undefined) updateData.raw_score = rawScore
        if (finalScore !== undefined) updateData.final_score = finalScore
        if (grade !== undefined) updateData.grade = grade
        if (remark !== undefined) updateData.remark = remark

        const { data, error } = await supabase
          .from("student_scores")
          .update(updateData)
          .eq("id", existing.id)
          .select()
          .single()

        if (error) {
          errors.push({ participantId, itemId, error: error.message })
        } else {
          results.push({ type: "updated", data })
        }
      } else {
        // Create new score
        const { data, error } = await supabase
          .from("student_scores")
          .insert({
            participant_id: participantId,
            item_id: itemId,
            session_id: sessionId,
            student_id: score.studentId || "",
            raw_score: rawScore,
            final_score: finalScore,
            grade,
            remark,
            evaluator_id: evaluatorId || "system",
            status: "saved",
          })
          .select()
          .single()

        if (error) {
          errors.push({ participantId, itemId, error: error.message })
        } else {
          results.push({ type: "created", data })
        }
      }
    }

    // Update session status to in_progress if it's still draft/open
    if (results.length > 0) {
      const { data: currentSession } = await supabase
        .from("assessment_sessions")
        .select("status")
        .eq("id", sessionId)
        .single()

      if (currentSession?.status === "draft" || currentSession?.status === "open") {
        await supabase
          .from("assessment_sessions")
          .update({ status: "in_progress", updated_at: new Date().toISOString() })
          .eq("id", sessionId)
      }
    }

    // Create audit log
    await createAuditLog({
      action: "save_scores",
      module: "assessment",
      entity: "student_scores",
      entity_id: sessionId,
      new_value: { saved: results.length, errors: errors.length },
      description: `Saved ${results.length} scores to session`,
    })

    return NextResponse.json({
      success: true,
      saved: results.length,
      errorCount: errors.length,
      results,
      errors,
    })
  } catch (error) {
    console.error("Error saving scores:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save scores" },
      { status: 500 }
    )
  }
}
