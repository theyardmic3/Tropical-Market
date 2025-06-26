import { supabase } from "@/lib/supabase";

export const getStockCount = async (storeId: string) => {
  const { count, error } = await supabase
    .from("product")
    .select("*", { count: "exact", head: true })
    .eq("storeId", storeId)
    .eq("isArchived", false);

  if (error) {
    console.error("Failed to count products in stock:", error.message);
    return 0;
  }

  return count ?? 0;
};
