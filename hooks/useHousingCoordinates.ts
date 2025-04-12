"use client"

import { useState, useEffect } from "react";
import getSearchResults from "@/lib/getSearchResults";
import useSearchResultsStore from "@/store/useSearchResultsStore";

const useHousingCoordinates = () => {
  const searchResults = useSearchResultsStore((state) => state.searchResults);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getSearchResults();
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }
    fetchData();
  }, []);

  const coordinates = searchResults.map(hit => hit._source.location);
  return coordinates;
}

export default useHousingCoordinates;