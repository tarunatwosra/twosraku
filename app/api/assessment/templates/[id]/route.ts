/**
 * Single Template API Routes
 *
 * GET    /api/assessment/templates/[id] - Get template by ID with items
 * PUT    /api/assessment/templates/[id] - Update template
 * DELETE /api/assessment/templates/[id] - Delete template
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get template by ID with items
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Get template with category
    const { data: template, error: templateError } = await supabase
      .from("assessment_templates")
      .select(`
        *,
        assessment_categories (
          id,
          name,
          color
        )
      `)
      .eq("id", id)
      .single()

    if (templateError) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      )
    }

    // Get items for this template
    const { data: items } = await supabase
      .from("assessment_items")
      .select("*")
      .eq("template_id", id)
      .order("display_order", { ascending: true })

    return NextResponse.json({
      success: true,
      data: {
        ...template,
        items: items || [],
      },
    })
  } catch (error) {
    console.error("Error fetching template:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch template" },
      { status: 500 }
    )
  }
}

// PUT - Update template
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      name,
      description,
      categoryId,
      scoringMethod,
      passingScore,
      maxScore,
      minScore,
      allowDecimal,
      autoCalculate,
      displayOrder,
      status,
    } = body

    // Check if template exists
    const { data: existing } = await supabase
      .from("assessment_templates")
      .select("id, name, status")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      )
    }

    // Cannot change status from active to draft
    if (existing.status === "active" && status === "draft") {
      return NextResponse.json(
        { success: false, error: "Cannot change active template back to draft" },
        { status: 400 }
      )
    }

    // Update template
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (categoryId !== undefined) updateData.category_id = categoryId
    if (scoringMethod !== undefined) updateData.scoring_method = scoringMethod
    if (passingScore !== undefined) updateData.passing_score = passingScore
    if (maxScore !== undefined) updateData.max_score = maxScore
    if (minScore !== undefined) updateData.min_score = minScore
    if (allowDecimal !== undefined) updateData.allow_decimal = allowDecimal
    if (autoCalculate !== undefined) updateData.auto_calculate = autoCalculate
    if (displayOrder !== undefined) updateData.display_order = displayOrder
    if (status !== undefined) updateData.status = status

    const { data, error } = await supabase
      .from("assessment_templates")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "update",
      module: "assessment",
      entity: "assessment_templates",
      entity_id: id,
      old_value: existing,
      new_value: data,
      description: `Updated template: ${name || existing.name}`,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error updating template:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update template" },
      { status: 500 }
    )
  }
}

// DELETE - Delete template
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if template has sessions
    const { data: sessions } = await supabase
      .from("assessment_sessions")
      .select("id")
      .eq("template_id", id)
      .limit(1)

    if (sessions && sessions.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete template with existing sessions. Archive this template instead.",
        },
        { status: 400 }
      )
    }

    // Delete template (items will be cascade deleted)
    const { error } = await supabase
      .from("assessment_templates")
      .delete()
      .eq("id", id)

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "delete",
      module: "assessment",
      entity: "assessment_templates",
      entity_id: id,
      description: `Deleted template: ${id}`,
    })

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting template:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete template" },
      { status: 500 }
    )
  }
}
