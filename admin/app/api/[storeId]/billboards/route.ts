import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

// POST: Create a new billboard
export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { label, imageUrl } = body;
    const { storeId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!label) return new NextResponse("Label is required", { status: 400 });
    if (!imageUrl) return new NextResponse("Image Url is required", { status: 400 });
    if (!storeId) return new NextResponse("Store Id is required", { status: 400 });

    // Check ownership
    const { data: store, error: storeError } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeError || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Create billboard
    const { data: billboard, error: insertError } = await supabase
      .from("billboard")
      .insert([
        {
          label,
          imageUrl,
          storeId,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error(`[BILLBOARDS_POST_INSERT] ${insertError.message}`);
      return new NextResponse("Failed to create billboard", { status: 500 });
    }

    return NextResponse.json(billboard);
  } catch (err) {
    console.error(`[BILLBOARDS_POST] ${err}`);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET: List all billboards for store
export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const { data: billboards, error } = await supabase
      .from("billboard")
      .select("*")
      .eq("storeId", storeId);

    if (error) {
      console.error(`[BILLBOARDS_GET] ${error.message}`);
      return new NextResponse("Failed to fetch billboards", { status: 500 });
    }

    return NextResponse.json(billboards);
  } catch (err) {
    console.error(`[BILLBOARDS_GET] ${err}`);
    return new NextResponse("Internal error", { status: 500 });
  }
}
