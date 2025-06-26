import { supabase } from "@/lib/supabase";
import { ColorForm } from "./components/color-form";

const ColorPage = async ({ params }: { params: Promise<{ colorId: string }> }) => {
  const { colorId } = await params;

  const { data: color, error } = await supabase
    .from("color")
    .select("*")
    .eq("id", colorId)
    .single();

  if (error) {
    console.error("Failed to fetch color:", error.message);
    // Optional: redirect or show fallback UI
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ColorForm initialData={color || null} />
      </div>
    </div>
  );
};

export default ColorPage;
