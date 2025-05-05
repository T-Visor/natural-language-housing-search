"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader
} from "@/components/ui/sidebar";
import useSearchResultsStore from "@/store/useSearchResultsStore";
import { useRef, useEffect } from "react";
import { ListingButtonCard } from "@/components/listing-card";

const AppSidebar = () => {
  const selectedListing = useSearchResultsStore((state) => state.searchResult);
  const setSelectedListing = useSearchResultsStore((state) => state.setSearchResult);
  const selectedListingButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchResults = useSearchResultsStore((state) => state.searchResults);

  // Auto-scroll to the selected search result in the sidebar
  useEffect(() => {
    if (selectedListingButtonRef.current) {
      selectedListingButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    }
  }, [selectedListing]);

  return (
    <Sidebar side="right">
      <SidebarHeader className="flex flex-col items-center justify-center space-y-2 p-4 border-b h-13">
        <h2 className="font-medium text-white">
          Listings
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="p-2 overflow-auto">
            <div className="grid grid-cols-1 gap-3">
              {(searchResults.length > 0) && (searchResults.map((result) => (
                <ListingButtonCard
                  key={result._id}
                  result={result}
                  searchResult={selectedListing}
                  searchResultReference={selectedListingButtonRef}
                  setSearchResult={setSelectedListing}
                />
              )))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar;