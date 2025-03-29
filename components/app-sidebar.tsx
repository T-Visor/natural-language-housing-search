import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader
} from "@/components/ui/sidebar"

const searchResults = [
  {
    id: 1,
    Name: "The Art of War",
    Author: "Sun Tzu",
    Date: "500 BC",
    Location: "Ancient China"
  },
  {
    id: 2,
    Name: "Random Book",
    Author: "T-Visor",
    Date: "2023 44",
    Location: "United States"
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center space-y-2 p-4">
        <h2 className="font-medium text-white">Search Results</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col">
            {searchResults.map((result) => (
              <Button
                key={result.id}
                variant="ghost"
                className="w-full min-h-fit text-left flex flex-col items-start px-4 py-2 rounded-md hover:bg-gray-800 transition"
              >
                <div className="w-full flex flex-col">
                  <span className="text-sm font-medium text-white">{result.Name}</span>
                  <span className="text-xs text-gray-400">{result.Author}</span>
                  <span className="text-xs text-gray-400">{result.Date}</span>
                  <span className="text-xs text-gray-500 italic">{result.Location}</span>
                </div>
              </Button>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
