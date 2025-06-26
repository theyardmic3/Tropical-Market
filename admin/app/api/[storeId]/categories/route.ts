import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

// POST: Create a category
export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, billboardId } = body;
    const { storeId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!billboardId) return new NextResponse("Billboard id is required", { status: 400 });
    if (!storeId) return new NextResponse("Store Id is required", { status: 400 });

    // Check if store belongs to user
    const { data: store, error: storeError } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeError || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Create category
    const { data: category, error: insertError } = await supabase
      .from("category")
      .insert([
        {
          name,
          billboardId,
          storeId,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error(`[CATEGORIES_POST] ${insertError.message}`);
      return new NextResponse("Failed to create category", { status: 500 });
    }

    return NextResponse.json(category);
  } catch (err) {
    console.log(`[CATEGORIES_POST] ${err}`);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET: Fetch all categories for store
export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const { data: categories, error } = await supabase
      .from("category")
      .select("*")
      .eq("storeId", storeId);

    if (error) {
      console.error(`[CATEGORIES_GET] ${error.message}`);
      return new NextResponse("Failed to fetch categories", { status: 500 });
    }

    return NextResponse.json(categories);
  } catch (err) {
    console.log(`[CATEGORIES_GET] ${err}`);
    return new NextResponse("Internal error", { status: 500 });
  }
}
