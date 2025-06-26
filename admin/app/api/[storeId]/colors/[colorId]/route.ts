import { supabase } from "@/lib/supabase";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ colorId: string }> }
) {
  try {
    const { colorId } = await params;

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const { data: color, error } = await supabase
      .from("color")
      .select("*")
      .eq("id", colorId)
      .single();

    if (error) {
      console.error("[SUPABASE_COLOR_GET]", error.message);
      return new NextResponse("Failed to fetch color", { status: 500 });
    }

    return NextResponse.json(color);
  } catch (err) {
    console.log('[COLOR_GET]', err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; colorId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;
    const { storeId, colorId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value) return new NextResponse("Value is required", { status: 400 });
    if (!colorId) return new NextResponse("Color id is required", { status: 400 });

    // Ownership check
    const { data: store, error: storeError } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeError || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { data: updatedColor, error: updateError } = await supabase
      .from("color")
      .update({ name, value })
      .eq("id", colorId)
      .select()
      .single();

    if (updateError) {
      console.error("[SUPABASE_COLOR_PATCH]", updateError.message);
      return new NextResponse("Failed to update color", { status: 500 });
    }

    return NextResponse.json(updatedColor);
  } catch (err) {
    console.log('[COLOR_PATCH]', err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; colorId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, colorId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!colorId) return new NextResponse("Color id is required", { status: 400 });

    const { data: store, error: storeError } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeError || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { data: deletedColor, error: deleteError } = await supabase
      .from("color")
      .delete()
      .eq("id", colorId)
      .select()
      .single();

    if (deleteError) {
      console.error("[SUPABASE_COLOR_DELETE]", deleteError.message);
      return new NextResponse("Failed to delete color", { status: 500 });
    }

    return NextResponse.json(deletedColor);
  } catch (err) {
    console.log('[COLOR_DELETE]', err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
