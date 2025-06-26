import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { supabase } from "@/lib/supabase";

// GET Size by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ sizeId: string }> }
) {
  try {
    const { sizeId } = await params;

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const { data: size, error } = await supabase
      .from("size")
      .select("*")
      .eq("id", sizeId)
      .single();

    if (error) {
      console.error("[SIZE_GET]", error.message);
      return new NextResponse("Failed to fetch size", { status: 500 });
    }

    return NextResponse.json(size);
  } catch (err) {
    console.error("[SIZE_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH (Update) Size
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string, sizeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, sizeId } = await params;
    const { name, value } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name || !value || !sizeId) {
      return new NextResponse("Name, value, and sizeId are required", { status: 400 });
    }

    const { data: store, error: storeError } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeError || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { data: updated, error } = await supabase
      .from("size")
      .update({ name, value })
      .eq("id", sizeId)
      .select()
      .single();

    if (error) {
      console.error("[SIZE_PATCH]", error.message);
      return new NextResponse("Failed to update size", { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[SIZE_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE Size
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string, sizeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, sizeId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!sizeId) return new NextResponse("Size id is required", { status: 400 });

    const { data: store, error: storeError } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeError || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { data: deleted, error } = await supabase
      .from("size")
      .delete()
      .eq("id", sizeId)
      .select()
      .single();

    if (error) {
      console.error("[SIZE_DELETE]", error.message);
      return new NextResponse("Failed to delete size", { status: 500 });
    }

    return NextResponse.json(deleted);
  } catch (err) {
    console.error("[SIZE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
