import { Button } from "@/components/ui/button"
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
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center space-y-2 p-4">
        <h1 className="font-medium text-white text-lg">Search Results</h1>
        <div className="h-px w-full bg-gray-600" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {/* Search result styled as button */}
            <Button
              variant="ghost"
              className="w-full h-full text-left flex flex-col items-start px-4 rounded-md hover:bg-gray-800 transition"
            >
              <div className="w-full flex flex-col">
                <span className="text-sm font-medium text-white">The Art of War</span>
                <span className="text-xs text-gray-400">Sun Tzu</span>
                <span className="text-xs text-gray-400">500 BC</span>
                <span className="text-xs text-gray-500 italic">Ancient China</span>
              </div>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
