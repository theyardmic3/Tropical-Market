import { supabase } from "@/lib/supabase";

export const getTotalRevenue = async (storeId: string) => {
  const { data: orders, error } = await supabase
    .from("order")
    .select(`
      id,
      orderItems (
        id,
        product (
          id,
          price
        )
      )
    `)
    .eq("storeId", storeId)
    .eq("isPaid", true);

  if (error) {
    console.error("Failed to fetch paid orders:", error.message);
    return 0;
  }

  const totalRevenue = (orders || []).reduce((total, order) => {
    const orderTotal = (order.orderItems || []).reduce((sum, item) => {
      return sum + Number(item.product?.price || 0);
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
