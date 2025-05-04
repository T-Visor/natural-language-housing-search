"use client"

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader
} from "@/components/ui/sidebar";
import isEqual from 'lodash/isEqual';
import useSearchResultsStore from "@/store/useSearchResultsStore";
import { useRef, useEffect } from "react";
import Image from "next/image"

const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(number);
}

const AppSidebar = () => {
  const searchResult = useSearchResultsStore((state) => state.searchResult);
  const setSearchResult = useSearchResultsStore((state) => state.setSearchResult);
  const searchResultReference = useRef<HTMLButtonElement | null>(null);
  const searchResults = useSearchResultsStore((state) => state.searchResults);

  // Auto-scroll to the selected search result in the sidebar
  useEffect(() => {
    if (searchResultReference.current) {
      searchResultReference.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    }
  }, [searchResult]);

  return (
    <Sidebar side="right">
      <SidebarHeader className="flex flex-col items-center justify-center space-y-2 p-4 border-b h-13">
        <h2 className="font-medium text-white">Search Results</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="p-2 overflow-auto">
            <div className="grid grid-cols-1 gap-3">
              {(searchResults.length > 0) && (searchResults.map((result) => {
                const coordinates: [number, number] = [result._source.location.lat, result._source.location.lon];

                return (
                  <div
                    key={result._id}
                    className="flex flex-col w-full rounded-md overflow-hidden"
                  >
                    {/* Highlight this button if its coordinates match the currently selected location */}
                    <Button
                      variant={isEqual(searchResult, coordinates) ? "secondary" : "ghost"}
                      ref={isEqual(searchResult, coordinates) ? searchResultReference : null}
                      onClick={() => setSearchResult(coordinates)}
                      className="w-full h-auto text-left flex flex-col items-start py-2 rounded-md hover:bg-gray-800"
                    >
                      <div className="w-full flex justify-center">
                      <Image
                        className="rounded-md"
                        src="/P5_ProtagonistHouseConceptArt.png"
                        width={800}
                        height={800}
                        alt="Blank image placeholder"
                      />
                      </div>
                      <div className="w-full flex flex-col">
                        <span className="text-base font-large font-bold text-white mb-1">
                          {`${formatCurrency(result._source.price)}`}
                        </span>
                        <span className="text-sm text-gray-400 mb-0.5">
                          {`${result._source.bedroom_number ?? 0} bed | 
                            ${result._source.bathroom_number ?? 0} bath`}
                        </span>
                        <span className="text-sm text-gray-400 mb-0.5 truncate whitespace-pre-line">
                          {result._source.address}
                        </span>
                        <a
                          className="text-sm text-blue-500"
                          href={result._source.property_url}
                          target="_blank"
                        >
                          View Source
                        </a>
                      </div>
                    </Button>
                  </div>
                )
              }))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar;