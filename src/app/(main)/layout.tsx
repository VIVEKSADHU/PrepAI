import type { ReactNode } from "react"
import Link from "next/link"
import { MainSidebar } from "@/components/main-sidebar"
import { UserNav } from "@/components/user-nav"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Building2 } from "lucide-react"

export default function MainLayout({ children }: { children: ReactNode }) {
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
