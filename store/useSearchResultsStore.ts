import { create } from "zustand";

type LatLong = [number, number] | null;

interface SearchResultsStore {
  // Collection of search results
  searchResults: any[];
  setSearchResults: (results: any[]) => void;

  // Selected search result
  searchResult: LatLong;
  setSearchResult: (result: [number, number]) => void;
  unselectSearchResult: () => void;

  // loading state
  isSearching: boolean;
  setIsSearching: (status: boolean) => void;

  // Pagination
  pageForSearchResults: number;
  setPageForSearchResults: (page: number) => void;
}

const useSearchResultsStore = create<SearchResultsStore>((set) => ({
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),

  searchResult: null,
  setSearchResult: (result) => set({ searchResult: result }),
  unselectSearchResult: () => set({ searchResult: null }),

  isSearching: false,
  setIsSearching: (status) => set({ isSearching: status }),

  pageForSearchResults: 1,
  setPageForSearchResults: (page) => set({ pageForSearchResults: page }),
}));

export default useSearchResultsStore;