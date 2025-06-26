import { supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { productIds } = await req.json();
    const { storeId } = await params;

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product ids are required", { status: 400 });
    }

    // Fetch products from Supabase
    const { data: products, error: fetchError } = await supabase
      .from("product")
      .select("*")
      .in("id", productIds);

    if (fetchError || !products) {
      console.error("[SUPABASE_FETCH_PRODUCTS]", fetchError?.message);
      return new NextResponse("Failed to fetch products", { status: 500 });
    }

    // Prepare Stripe line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map((product) => ({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        unit_amount: Number(product.price) * 100,
      },
    }));

    // Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from("order")
      .insert([
        {
          storeId,
          isPaid: false,
          phone: "",
          address: "",
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error("[SUPABASE_ORDER_CREATE]", orderError?.message);
      return new NextResponse("Failed to create order", { status: 500 });
    }

    // Insert orderItems into Supabase
    const { error: orderItemsError } = await supabase
      .from("orderItem")
      .insert(
        productIds.map((productId: string) => ({
          orderId: order.id,
          productId,
        }))
      );

    if (orderItemsError) {
      console.error("[SUPABASE_ORDERITEM_CREATE]", orderItemsError.message);
      return new NextResponse("Failed to create order items", { status: 500 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  } catch (err) {
    console.error("[CHECKOUT_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
