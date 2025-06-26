import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { storeId } = await params;

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !value || !storeId) {
      return new NextResponse("Name, value, and storeId are required", { status: 400 });
    }

    const { data: store, error: storeErr } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeErr || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { data: size, error } = await supabase
      .from("size")
      .insert([{ name, value, storeId }])
      .select()
      .single();

    if (error) {
      console.error("[SIZES_POST]", error.message);
      return new NextResponse("Failed to create size", { status: 500 });
    }

    return NextResponse.json(size);
  } catch (err) {
    console.error("[SIZES_POST]", err);
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

    const { data: sizes, error } = await supabase
      .from("size")
      .select("*")
      .eq("storeId", storeId);

    if (error) {
      console.error("[SIZES_GET]", error.message);
      return new NextResponse("Failed to fetch sizes", { status: 500 });
    }

    return NextResponse.json(sizes);
  } catch (err) {
    console.error("[SIZES_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
