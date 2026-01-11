'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useUser } from '@/firebase';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect('/login');
    }
  }, [user, isUserLoading]);
  
  if (isUserLoading) {
    return (
        <div className="flex h-screen">
            <div className="w-16 border-r p-2 flex flex-col gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
            <div className="p-8 flex-1">
                <Skeleton className="h-12 w-1/3 mb-4" />
                <Skeleton className="h-80 w-full" />
            </div>
        </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <main className="p-6 lg:p-10">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
