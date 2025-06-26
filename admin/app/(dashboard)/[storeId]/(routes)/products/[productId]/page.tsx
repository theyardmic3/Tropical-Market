import { supabase } from "@/lib/supabase";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string; storeId: string }>;
}) => {
  const { storeId, productId } = await params;

  // Fetch product and its images
  const { data: product, error: productError } = await supabase
    .from("product")
    .select(`
      *,
      images (
        id,
        url,
        createdAt,
        updatedAt
      )
    `)
    .eq("id", productId)
    .single();

  // Fetch categories
  const { data: categories, error: categoryError } = await supabase
    .from("category")
    .select("*")
    .eq("storeId", storeId);

  // Fetch sizes
  const { data: sizes, error: sizeError } = await supabase
    .from("size")
    .select("*")
    .eq("storeId", storeId);

  // Fetch colors
  const { data: colors, error: colorError } = await supabase
    .from("color")
    .select("*")
    .eq("storeId", storeId);

  if (productError || categoryError || sizeError || colorError) {
    console.error("Error loading product data", {
      productError,
      categoryError,
      sizeError,
      colorError,
    });
    // Optional: redirect or show error UI
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductForm
          initialData={product || null}
          colors={colors || []}
          sizes={sizes || []}
          categories={categories || []}
        />
      </div>
    </div>
  );
};

export default ProductPage;
