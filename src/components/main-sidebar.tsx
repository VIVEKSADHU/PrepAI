"use client"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, LayoutGrid, PenSquare, Building2, Github, Workflow, Code2, Newspaper } from "lucide-react"

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/ai-mentor", label: "AI Mentor", icon: Bot },
  { href: "/submit-experience", label: "Submit Experience", icon: PenSquare },
  { href: "/saas-ai-agents", label: "SaaS AI Agents", icon: Workflow },
  { href: "/dsa-tracker", label: "DSA Tracker", icon: Code2 },
  { href: "/dev-news", label: "Dev News", icon: Newspaper },
]

export function MainSidebar() {
  const pathname = usePathname()

  // For main layout route group, we need to handle the root path
  const adjustedPathname = pathname === '/dashboard' ? '/' : pathname;

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-lg text-primary"
        >
          <Building2 className="h-6 w-6" />
          <span className="duration-200 group-data-[collapsible=icon]:hidden">
            PrepAI
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={adjustedPathname === item.href}
                tooltip={{ children: item.label, side: "right" }}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="duration-200 group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
