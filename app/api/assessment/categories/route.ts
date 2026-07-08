/**
 * Assessment Categories API Routes
 *
 * GET    /api/assessment/categories     - Get all categories
 * POST   /api/assessment/categories     - Create new category
 */

import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createAuditLog } from "@/lib/database"

// GET - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = supabase
      .from("assessment_categories")
      .select("*")
      .order("display_order", { ascending: true })

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
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, description, icon, color, displayOrder } = body

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      )
    }

    // Check if name already exists
    const { data: existing } = await supabase
      .from("assessment_categories")
      .select("id")
      .eq("name", name)
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Category with this name already exists" },
        { status: 409 }
      )
    }

    // Create category
    const { data, error } = await supabase
      .from("assessment_categories")
      .insert({
        name,
        description,
        icon,
        color: color || "#6B7280",
        display_order: displayOrder || 0,
        status: "active",
      })
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await createAuditLog({
      action: "create",
      module: "assessment",
      entity: "assessment_categories",
      entity_id: data.id,
      new_value: data,
      description: `Created category: ${name}`,
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    )
  }
}
