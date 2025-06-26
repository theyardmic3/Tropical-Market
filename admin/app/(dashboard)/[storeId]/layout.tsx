import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";

interface DashboardType {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}

export default async function Dashboard({ children, params }: DashboardType) {
  const { userId } = await auth();
  const { storeId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const { data: store, error } = await supabase
    .from("store")
    .select("*")
    .eq("id", storeId)
    .eq("userId", userId)
    .single();

  if (error || !store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
