import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const { data: product, error } = await supabase
      .from("product")
      .select(`
        *,
        images:image(*),
        category(*),
        color(*),
        size(*)
      `)
      .eq("id", productId)
      .single();

    if (error) {
      console.error("[PRODUCT_GET]", error.message);
      return new NextResponse("Failed to fetch product", { status: 500 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("[PRODUCT_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, productId } = await params;
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived
    } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!productId) return new NextResponse("Product id is required", { status: 400 });
    if (!name || !price || !categoryId || !colorId || !sizeId || images?.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
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

    // Step 1: Update the product
    const { error: updateErr } = await supabase
      .from("product")
      .update({
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived
      })
      .eq("id", productId);

    if (updateErr) {
      console.error("[PRODUCT_PATCH - update]", updateErr.message);
      return new NextResponse("Failed to update product", { status: 500 });
    }

    // Step 2: Delete existing images
    const { error: deleteErr } = await supabase
      .from("image")
      .delete()
      .eq("productId", productId);

    if (deleteErr) {
      console.error("[PRODUCT_PATCH - deleteImages]", deleteErr.message);
    }

    // Step 3: Insert new images
    const imageInsert = images.map((img: { url: string }) => ({
      url: img.url,
      productId
    }));

    const { error: insertErr } = await supabase
      .from("image")
      .insert(imageInsert);

    if (insertErr) {
      console.error("[PRODUCT_PATCH - insertImages]", insertErr.message);
    }

    return new NextResponse("Product updated successfully");
  } catch (err) {
    console.error("[PRODUCT_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, productId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!productId) return new NextResponse("Product id is required", { status: 400 });

    const { data: store, error: storeErr } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeErr || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from("product")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      console.error("[PRODUCT_DELETE]", deleteError.message);
      return new NextResponse("Failed to delete product", { status: 500 });
    }

    return new NextResponse("Product deleted successfully");
  } catch (err) {
    console.error("[PRODUCT_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
