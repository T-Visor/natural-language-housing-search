import { create } from "zustand";

const useSearchResultsStore = create((set) => ({
  // Entire list of results
  searchResults: [],
  setSearchResults: (searchResults) => set({ searchResults }),

  // Selected search result from list
  searchResult: null,
  setSearchResult: (searchResult: [number, number]) => set({ searchResult }),
  unselectSearchResult: () => set({ searchResult: null }),
}));

export default useSearchResultsStore;