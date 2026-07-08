/**
 * Assessment Templates API Routes
 *
 * GET    /api/assessment/templates     - Get all templates
 * POST   /api/assessment/templates     - Create new template
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

// GET - Get all templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const academicYearId = searchParams.get("academicYearId")

    let query = supabase
      .from("assessment_templates")
      .select(`
        *,
        assessment_categories (
          id,
          name,
          color
        )
      `)
      .order("display_order", { ascending: true })

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0,
    })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    )
  }
}

// POST - Create new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      categoryId,
      name,
      description,
      academicYearScope,
      scoringMethod,
      passingScore,
      maxScore,
      minScore,
      allowDecimal,
      autoCalculate,
      displayOrder,
    } = body

    // Validation
    if (!name || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Name and category are required" },
        { status: 400 }
      )
    }

    // Check if category exists
    const { data: category } = await supabase
      .from("assessment_categories")
      .select("id")
      .eq("id", categoryId)
      .single()

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      )
    }

    // Create template
    const { data, error } = await supabase
      .from("assessment_templates")
      .insert({
        category_id: categoryId,
        name,
        description,
        scoring_method: scoringMethod || "weighted_average",
        passing_score: passingScore || 75,
        max_score: maxScore || 100,
        min_score: minScore || 0,
        allow_decimal: allowDecimal ?? true,
        auto_calculate: autoCalculate ?? true,
        display_order: displayOrder || 0,
        status: "draft",
      })
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "create",
      module: "assessment",
      entity: "assessment_templates",
      entity_id: data.id,
      new_value: data,
      description: `Created template: ${name}`,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create template" },
      { status: 500 }
    )
  }
}
