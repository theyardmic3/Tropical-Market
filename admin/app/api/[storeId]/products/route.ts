import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
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
    const { storeId } = await params;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category id is required", { status: 400 });
    if (!colorId) return new NextResponse("Color id is required", { status: 400 });
    if (!sizeId) return new NextResponse("Size id is required", { status: 400 });
    if (isFeatured === undefined) return new NextResponse("Featured is required", { status: 400 });
    if (isArchived === undefined) return new NextResponse("Archived is required", { status: 400 });
    if (!images?.length) return new NextResponse("Image is required", { status: 400 });
    if (!storeId) return new NextResponse("Store Id is required", { status: 400 });

    const { data: store, error: storeError } = await supabase
      .from("store")
      .select("id")
      .eq("id", storeId)
      .eq("userId", userId)
      .single();

    if (storeError || !store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { data: product, error: productError } = await supabase
      .from("product")
      .insert([
        {
          name,
          price,
          isFeatured,
          isArchived,
          categoryId,
          sizeId,
          colorId,
          storeId
        }
      ])
      .select()
      .single();

    if (productError || !product) {
      console.error("[SUPABASE_PRODUCT_CREATE]", productError?.message);
      return new NextResponse("Failed to create product", { status: 500 });
    }

    // Insert product images
    const imageData = images.map((img: { url: string }) => ({
      url: img.url,
      productId: product.id
    }));

    const { error: imageInsertError } = await supabase
      .from("image")
      .insert(imageData);

    if (imageInsertError) {
      console.error("[SUPABASE_IMAGE_INSERT]", imageInsertError.message);
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("[PRODUCTS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId");
    const colorId = searchParams.get("colorId");
    const sizeId = searchParams.get("sizeId");
    const isFeatured = searchParams.get("isFeatured") === "true";

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const query = supabase
      .from("product")
      .select(
        `*,
         images:image(*),
         category(*),
         color(*),
         size(*)`
      )
      .eq("storeId", storeId)
      .eq("isArchived", false)
      .order("createdAt", { ascending: false });

    if (categoryId) query.eq("categoryId", categoryId);
    if (colorId) query.eq("colorId", colorId);
    if (sizeId) query.eq("sizeId", sizeId);
    if (searchParams.get("isFeatured")) query.eq("isFeatured", isFeatured);

    const { data: products, error } = await query;

    if (error) {
      console.error("[SUPABASE_PRODUCTS_GET]", error.message);
      return new NextResponse("Failed to fetch products", { status: 500 });
    }

    return NextResponse.json(products);
  } catch (err) {
    console.error("[PRODUCTS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
