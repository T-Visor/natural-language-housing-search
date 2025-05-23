"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import useSearchResultsStore from "@/store/useSearchResultsStore";
import { useRef, useEffect } from "react";
import { ListingButtonCard } from "@/components/listing-card";

const AppSidebar = () => {
  const isSearching = useSearchResultsStore((state) => state.isSearching);
  const selectedListing = useSearchResultsStore((state) => state.searchResult);
  const setSelectedListing = useSearchResultsStore((state) => state.setSearchResult);
  const selectedListingButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchResults = useSearchResultsStore((state) => state.searchResults);
  const pageForSearchResults = useSearchResultsStore((state) => state.pageForSearchResults);
  const setPageForSearchResults = useSearchResultsStore((state) => state.setPageForSearchResults);
  const topOfScrollableAreaRef = useRef<HTMLDivElement | null>(null);

  // Scroll to top of search results when new ones are fetched via pagination
  useEffect(() => {
    topOfScrollableAreaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [searchResults]);

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
    <Sidebar 
      side="right" 
      className={isSearching ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}
    >
      <SidebarHeader className="flex flex-col items-center justify-center space-y-2 p-4 border-b h-13">
        <h2 className="font-medium">
          Listings
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup ref={topOfScrollableAreaRef}>
          <SidebarGroupContent className="p-2 overflow-auto">
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {searchResults.map((result) => (
                  <ListingButtonCard
                    key={result._id}
                    result={result}
                    searchResult={selectedListing}
                    searchResultReference={selectedListingButtonRef}
                    setSearchResult={setSelectedListing}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="text-center text-muted-foreground">
                  No Results
                </span>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {searchResults.length > 0 && (
        <SidebarFooter className="border-t p-2">
          <Pagination className="w-full justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={pageForSearchResults === 1 ? 
                             "opacity-50 pointer-events-none cursor-not-allowed" : ""}
                  onClick={() => {
                    if (pageForSearchResults > 1) {
                      setPageForSearchResults(pageForSearchResults - 1);
                    }
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>
                  {pageForSearchResults}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    setPageForSearchResults(pageForSearchResults + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}

export default AppSidebar;