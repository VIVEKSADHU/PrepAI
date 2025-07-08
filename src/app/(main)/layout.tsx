"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MainSidebar } from "@/components/main-sidebar"
import { UserNav } from "@/components/user-nav"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Building2, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

function MainLayoutSkeleton() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:block">
        <Skeleton className="h-full w-12" />
      </div>
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
          <Skeleton className="h-6 w-6 md:hidden" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </header>
        <main className="p-4 sm:p-6">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </main>
      </div>
    </div>
  )
}


export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <MainLayoutSkeleton />;
  }
  
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-primary md:hidden"
            >
              <Building2 className="h-6 w-6" />
              <span>PrepAI</span>
            </Link>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
