import { supabase } from "@/lib/supabase";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

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

    // Create color
    const { data: color, error: colorError } = await supabase
      .from("color")
      .insert([
        {
          name,
          value,
          storeId,
        },
      ])
      .select()
      .single();

    if (colorError) {
      console.error("[SUPABASE_COLOR_INSERT]", colorError.message);
      return new NextResponse("Failed to create color", { status: 500 });
    }

    return NextResponse.json(color);
  } catch (err) {
    console.error(`[COLORS_POST] ${err}`);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const { data: colors, error: colorsError } = await supabase
      .from("color")
      .select("*")
      .eq("storeId", storeId);

    if (colorsError) {
      console.error("[SUPABASE_COLOR_GET]", colorsError.message);
      return new NextResponse("Failed to fetch colors", { status: 500 });
    }

    return NextResponse.json(colors);
  } catch (err) {
    console.error(`[COLORS_GET] ${err}`);
    return new NextResponse("Internal error", { status: 500 });
  }
}
