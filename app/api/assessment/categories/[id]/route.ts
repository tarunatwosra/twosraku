/**
 * Single Category API Routes
 *
 * GET    /api/assessment/categories/[id] - Get category by ID
 * PUT    /api/assessment/categories/[id] - Update category
 * DELETE /api/assessment/categories/[id] - Delete category
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get category by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from("assessment_categories")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

// PUT - Update category
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const { name, description, icon, color, displayOrder, status } = body

    // Check if category exists
    const { data: existing } = await supabase
      .from("assessment_categories")
      .select("id, name")
      .eq("id", id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if new name conflicts with another category
    if (name && name !== existing.name) {
      const { data: conflict } = await supabase
        .from("assessment_categories")
        .select("id")
        .eq("name", name)
        .neq("id", id)
        .single()

      if (conflict) {
        return NextResponse.json(
          { success: false, error: "Category with this name already exists" },
          { status: 409 }
        )
      }
    }

    // Update category
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (icon !== undefined) updateData.icon = icon
    if (color !== undefined) updateData.color = color
    if (displayOrder !== undefined) updateData.display_order = displayOrder
    if (status !== undefined) updateData.status = status

    const { data, error } = await supabase
      .from("assessment_categories")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "update",
      module: "assessment",
      entity: "assessment_categories",
      entity_id: id,
      old_value: existing,
      new_value: data,
      description: `Updated category: ${name || existing.name}`,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    )
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if category has templates
    const { data: templates } = await supabase
      .from("assessment_templates")
      .select("id")
      .eq("category_id", id)
      .limit(1)

    if (templates && templates.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete category with existing templates. Delete templates first or archive this category.",
        },
        { status: 400 }
      )
    }

    // Delete category
    const { error } = await supabase
      .from("assessment_categories")
      .delete()
      .eq("id", id)

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "delete",
      module: "assessment",
      entity: "assessment_categories",
      entity_id: id,
      description: `Deleted category: ${id}`,
    })

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
