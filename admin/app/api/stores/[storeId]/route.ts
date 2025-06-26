import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { supabase } from "@/lib/supabase";

// PATCH - Update Store Name
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId } = await params;
    const { name } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    // Check ownership
    const { data: store, error: fetchErr } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (fetchErr || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Update store
    const { data: updated, error } = await supabase
      .from("store")
      .update({ name })
      .eq("id", storeId)
      .select()
      .single();

    if (error) {
      console.error("[STORE_PATCH]", error.message);
      return new NextResponse("Failed to update store", { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[STORE_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE - Delete Store
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!storeId) return new NextResponse("Store id is required", { status: 400 });

    // Validate ownership
    const { data: store, error: fetchErr } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (fetchErr || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Delete store
    const { data: deleted, error } = await supabase
      .from("store")
      .delete()
      .eq("id", storeId)
      .select()
      .single();

    if (error) {
      console.error("[STORE_DELETE]", error.message);
      return new NextResponse("Failed to delete store", { status: 500 });
    }

    return NextResponse.json(deleted);
  } catch (err) {
    console.error("[STORE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
