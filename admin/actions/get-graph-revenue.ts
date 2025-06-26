import { supabase } from "@/lib/supabase"; // make sure you created this wrapper

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
  // Fetch all paid orders for the store with related order items and products
  const { data: orders, error } = await supabase
    .from("order")
    .select(`
      id,
      createdAt,
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
    console.error("Failed to fetch orders:", error.message);
    return [];
  }

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of orders || []) {
    const month = new Date(order.createdAt).getMonth();
    let revenueForOrder = 0;

    for (const item of order.orderItems || []) {
      revenueForOrder += Number(item.product?.price || 0);
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const graphData: GraphData[] = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};
