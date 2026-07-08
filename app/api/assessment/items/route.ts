/**
 * Assessment Items API Routes
 *
 * GET    /api/assessment/items           - Get all items (filter by templateId)
 * POST   /api/assessment/items           - Create new item
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

// GET - Get all items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get("templateId")

    if (!templateId) {
      return NextResponse.json(
        { success: false, error: "templateId is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("assessment_items")
      .select("*")
      .eq("template_id", templateId)
      .order("display_order", { ascending: true })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0,
    })
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 }
    )
  }
}

// POST - Create new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      templateId,
      name,
      description,
      scoreType,
      weight,
      minScore,
      maxScore,
      passingScore,
      displayOrder,
      required,
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
      .select("id")
      .eq("id", templateId)
      .single()

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      )
    }

    // Create item
    const { data, error } = await supabase
      .from("assessment_items")
      .insert({
        template_id: templateId,
        name,
        description,
        score_type: scoreType || "numeric",
        weight: weight || 0,
        min_score: minScore ?? 0,
        max_score: maxScore ?? 100,
        passing_score: passingScore,
        display_order: displayOrder || 0,
        is_required: required ?? true,
        status: "active",
      })
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "create",
      module: "assessment",
      entity: "assessment_items",
      entity_id: data.id,
      new_value: data,
      description: `Created item: ${name}`,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    )
  }
}
