import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar variant="floating" className="top-10 bottom-50">
      <SidebarHeader className="flex-col items-center justify-center">
        <h1>
          Search Form
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Form</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
