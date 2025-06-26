import { supabase } from "@/lib/supabase";
import { SizeForm } from "./components/size-form";

const SizePage = async ({ params }: { params: Promise<{ sizeId: string }> }) => {
  const { sizeId } = await params;

  const { data: size, error } = await supabase
    .from("size")
    .select("*")
    .eq("id", sizeId)
    .single();

  if (error) {
    console.error("Failed to fetch size:", error.message);
    // Optional: redirect or show fallback
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SizeForm initialData={size || null} />
      </div>
    </div>
  );
};

export default SizePage;
