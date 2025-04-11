"use client"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader
} from "@/components/ui/sidebar"
import axios from "axios"
import { useState, useEffect } from "react"

const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(number);
}

const AppSidebar = () => {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const results = await axios.get("/api/housing-search");
        setSearchResults(results.data);
      }
      catch (error) {
        console.error(error);
      }
    }
    fetchSearchResults();
  }, [])

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center space-y-2 p-4 border-b h-13">
        <h2 className="font-medium text-white">Search Results</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="p-4 overflow-auto">
            <div className="grid grid-cols-1 gap-3">
              {(searchResults.length > 0) && (searchResults.map((result) => (
                <div
                  key={result._id}
                  className="w-full rounded-md overflow-hidden"
                >
                  <Button
                    variant="ghost"
                    className="w-full h-auto text-left flex flex-col items-start py-2 rounded-md hover:bg-gray-800 transition"
                  >
                    <div className="w-full flex flex-col">
                      <span className="text-sm font-medium text-white mb-1">{`${formatCurrency(result._source.price)}`}</span>
                      <span className="text-xs text-gray-400 mb-0.5 truncate">{result._source.address}</span>
                      <span className="text-xs text-gray-400 mb-0.5">{result._source.city}</span>
                      <span className="text-xs text-gray-500 italic">{result._source.state}</span>
                    </div>
                  </Button>
                </div>
              )))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar;