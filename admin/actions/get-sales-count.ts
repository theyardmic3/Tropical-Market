import { supabase } from "@/lib/supabase";

export const getSalesCount = async (storeId: string) => {
  const { data, error } = await supabase
    .from("order")
    .select("id", { count: "exact", head: true })
    .eq("storeId", storeId)
    .eq("isPaid", true);

  if (error) {
    console.error("Failed to count sales:", error.message);
    return 0;
  }

  return data?.length ?? 0;
};
