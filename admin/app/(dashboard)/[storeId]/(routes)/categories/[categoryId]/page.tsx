import { supabase } from "@/lib/supabase";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ categoryId: string; storeId: string }>;
}) => {
  const { categoryId, storeId } = await params;

  const { data: category, error: categoryError } = await supabase
    .from("category")
    .select("*")
    .eq("id", categoryId)
    .single();

  const { data: billboards, error: billboardError } = await supabase
    .from("billboard")
    .select("*")
    .eq("storeId", storeId);

  if (categoryError || billboardError) {
    console.error("Error loading category or billboards", {
      categoryError,
      billboardError,
    });
    // Optional: redirect or show fallback
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <CategoryForm billboards={billboards || []} initialData={category || null} />
      </div>
    </div>
  );
};

export default CategoryPage;
