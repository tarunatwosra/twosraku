/**
 * Single Item API Routes
 *
 * GET    /api/assessment/items/[id]      - Get item by ID
 * PUT    /api/assessment/items/[id]      - Update item
 * DELETE /api/assessment/items/[id]      - Delete item
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get item by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from("assessment_items")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch item" },
      { status: 500 }
    )
  }
}

// PUT - Update item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      name,
      description,
      scoreType,
      weight,
      minScore,
      maxScore,
      passingScore,
      displayOrder,
      required,
      status,
    } = body

    // Check if item exists
    const { data: existing } = await supabase
      .from("assessment_items")
      .select("id, name")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      )
    }

    // Update item
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (scoreType !== undefined) updateData.score_type = scoreType
    if (weight !== undefined) updateData.weight = weight
    if (minScore !== undefined) updateData.min_score = minScore
    if (maxScore !== undefined) updateData.max_score = maxScore
    if (passingScore !== undefined) updateData.passing_score = passingScore
    if (displayOrder !== undefined) updateData.display_order = displayOrder
    if (required !== undefined) updateData.is_required = required
    if (status !== undefined) updateData.status = status

    const { data, error } = await supabase
      .from("assessment_items")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "update",
      module: "assessment",
      entity: "assessment_items",
      entity_id: id,
      old_value: existing,
      new_value: data,
      description: `Updated item: ${name || existing.name}`,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update item" },
      { status: 500 }
    )
  }
}

// DELETE - Delete item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if item has scores
    const { data: scores } = await supabase
      .from("student_scores")
      .select("id")
      .eq("item_id", id)
      .limit(1)

    if (scores && scores.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete item with existing scores. Archive this item instead.",
        },
        { status: 400 }
      )
    }

    // Delete item
    const { error } = await supabase
      .from("assessment_items")
      .delete()
      .eq("id", id)

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "delete",
      module: "assessment",
      entity: "assessment_items",
      entity_id: id,
      description: `Deleted item: ${id}`,
    })

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500 }
    )
  }
}
