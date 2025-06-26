import { supabase } from "@/lib/supabase";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({ params }: { params: Promise<{ billboardId: string }> }) => {
  const { billboardId } = await params;

  const { data: billboard, error } = await supabase
    .from("billboard")
    .select("*")
    .eq("id", billboardId)
    .single();

  if (error) {
    console.error("Failed to fetch billboard:", error.message);
    // Optionally redirect or handle missing billboard here
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
