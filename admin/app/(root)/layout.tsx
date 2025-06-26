import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface DashboardType {
  children: React.ReactNode;
}

export default async function SetupLayout({ children }: DashboardType) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { data: store, error } = await supabase
    .from('store')
    .select('id')
    .eq('userId', userId)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching store:', error.message);
    // Optional: throw or show error UI
  }

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
