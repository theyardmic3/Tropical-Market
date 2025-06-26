import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET a single billboard
export async function GET(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  try {
    const { billboardId } = await params;
    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const { data: billboard, error } = await supabase
      .from("billboard")
      .select("*")
      .eq("id", billboardId)
      .single();

    if (error) {
      console.error("[BILLBOARD_GET]", error.message);
      return new NextResponse("Failed to fetch billboard", { status: 500 });
    }

    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[BILLBOARD_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH: update a billboard
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; billboardId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId, billboardId } = await params;
    const { label, imageUrl } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!label) return new NextResponse("Label is required", { status: 400 });
    if (!imageUrl) return new NextResponse("Image URL is required", { status: 400 });
    if (!billboardId) return new NextResponse("Billboard id is required", { status: 400 });

    const { data: store, error: storeError } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeError || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { data: updated, error: updateError } = await supabase
      .from("billboard")
      .update({ label, imageUrl })
      .eq("id", billboardId)
      .select()
      .single();

    if (updateError) {
      console.error("[BILLBOARD_PATCH]", updateError.message);
      return new NextResponse("Failed to update billboard", { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.log("[BILLBOARD_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE a billboard
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; billboardId: string }> }
) {
  try {
    const { userId } = await auth();
    const { billboardId, storeId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!billboardId) return new NextResponse("Billboard id is required", { status: 400 });

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
      .from("billboard")
      .delete()
      .eq("id", billboardId)
      .select()
      .single();

    if (deleteError) {
      console.error("[BILLBOARD_DELETE]", deleteError.message);
      return new NextResponse("Failed to delete billboard", { status: 500 });
    }

    return NextResponse.json(deleted);
  } catch (err) {
    console.log("[BILLBOARD_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
