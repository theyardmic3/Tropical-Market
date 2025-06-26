import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET category with billboard info
export async function GET(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const { data: category, error } = await supabase
      .from("category")
      .select("*, billboard(*)")
      .eq("id", categoryId)
      .single();

    if (error) {
      console.error("[CATEGORY_GET]", error.message);
      return new NextResponse("Failed to fetch category", { status: 500 });
    }

    return NextResponse.json(category);
  } catch (err) {
    console.log("[CATEGORY_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH: update category
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; categoryId: string }> }
) {
  try {
    const { userId } = await auth();
    const { name, billboardId } = await req.json();
    const { storeId, categoryId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("Category id is required", { status: 400 });

    const { data: store, error: storeError } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeError || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { data: updatedCategory, error: updateError } = await supabase
      .from("category")
      .update({ name, billboardId })
      .eq("id", categoryId)
      .select()
      .single();

    if (updateError) {
      console.error("[CATEGORY_PATCH]", updateError.message);
      return new NextResponse("Failed to update category", { status: 500 });
    }

    return NextResponse.json(updatedCategory);
  } catch (err) {
    console.log("[CATEGORY_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE: remove category
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; categoryId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, categoryId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!categoryId)
      return new NextResponse("Category id is required", { status: 400 });

    const { data: store, error: storeError } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeError || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { data: deleted, error: deleteError } = await supabase
      .from("category")
      .delete()
      .eq("id", categoryId)
      .select()
      .single();

    if (deleteError) {
      console.error("[CATEGORY_DELETE]", deleteError.message);
      return new NextResponse("Failed to delete category", { status: 500 });
    }

    return NextResponse.json(deleted);
  } catch (err) {
    console.log("[CATEGORY_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
