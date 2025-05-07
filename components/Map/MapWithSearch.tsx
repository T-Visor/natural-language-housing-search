"use client";

import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L, { marker } from "leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sparkles, Search, Loader, SlidersHorizontal } from "lucide-react";
import useSearchResultsStore from "@/store/useSearchResultsStore";
import {
  CenterMapOnSelectedMarker,
  ResizeMapOnSidebarToggle,
  FitMapBoundsAroundMarkers
} from "./MapEffects";
import axios from "axios";
import { ListingPopupForLeafletMarker } from "@/components/listing-card";
import isEqual from 'lodash/isEqual';

const customIcon = L.icon({
  iconUrl: "/marker.png",
  iconRetinaUrl: "/marker.png",
  iconSize: [30, 30],
  iconAnchor: [16, 32],
})

const MapWithSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mouseClickPoint = useSearchResultsStore((state) => state.searchResult);
  const setMouseClickPoint = useSearchResultsStore((state) => state.setSearchResult);
  const searchResults = useSearchResultsStore((state) => state.searchResults);
  const setSearchResults = useSearchResultsStore((state) => state.setSearchResults);
  const pageForSearchResults = useSearchResultsStore((state) => state.pageForSearchResults);
  const setPageForSearchResults = useSearchResultsStore((state) => state.setPageForSearchResults);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const selectedLeafletMarkerRef = useRef(null);

  const fetchSearchResults = async (query: string, page: number) => {
    setIsSearching(true);
    try {
      const response = await axios.post("/api/query-elastic-using-nl", {
        prompt: query,
        pageNumber: page
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!mouseClickPoint || !selectedLeafletMarkerRef.current) return;

    const timeout = setTimeout(() => {
      selectedLeafletMarkerRef.current?.openPopup();
    }, 500);

    return () => clearTimeout(timeout);
  }, [mouseClickPoint]);

  useEffect(() => {
    if (!searchQuery) return; // Optional safeguard
    fetchSearchResults(searchQuery, pageForSearchResults);
  }, [pageForSearchResults]);

  const handleNaturalLanguageSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery?.trim()) return;

    // Always reset to page 1 for a new query
    setPageForSearchResults(1);
    fetchSearchResults(searchQuery, pageForSearchResults);
  };

  return (
    <div className="h-full w-full">
      <div className="py-2 flex items-center space-x-3 px-4 h-13 border-b">
        {/* Search bar with 'submit' button */}
        <form
          onSubmit={handleNaturalLanguageSearch}
          className="flex items-center space-x-3 w-full"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              disabled={isSearching}
              className="pl-9"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            {/* Clears the search bar */}
            {searchQuery && <Button
              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              disabled={isSearching}
              variant="ghost"
              type="button" // important so it doesn't submit
              onClick={() => setSearchQuery("")}
            >
              X
            </Button>}
          </div>
          <Button
            type="submit"
            disabled={isSearching}
          >
            {!isSearching ? <Sparkles /> : <Loader className="animate-spin" />}
          </Button>
        </form>
        <div className="h-7 w-px bg-gray-600" />
        {/* 'Filters' button with pop-up dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="border-white"
              disabled={isSearching}
            >
              Filters
              <SlidersHorizontal />
            </Button>
          </DialogTrigger>
          <DialogContent className="z-[9999]">
            <DialogHeader>
              <DialogTitle>Filter Criteria</DialogTitle>
              <DialogDescription>
                Nothing to see here - this still needs to be implemented!
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Darken map container if filters dialog is open */}
      {isDialogOpen && (
        <div className="absolute inset-0 bg-black/40 z-[999] pointer-events-none" />
      )}

      <MapContainer
        center={[39.2904, -76.6122]}
        zoom={5}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        attributionControl={false}
      >
        <TileLayer
          attribution=""
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        {searchResults?.length > 0 && searchResults.map((result, index) => {
          const point = result._source.location;
          return (
            <Marker
              ref={isEqual(mouseClickPoint, [point.lat, point.lon]) ? selectedLeafletMarkerRef : null}
              key={result._id || index}
              position={[point.lat, point.lon]}
              icon={customIcon}
              eventHandlers={{
                click: () => setMouseClickPoint([point.lat, point.lon]),
              }}
            >
              <ListingPopupForLeafletMarker result={result} />
            </Marker>
          );
        })}
        <ResizeMapOnSidebarToggle />
        {!mouseClickPoint && searchResults?.length > 0 && (
          <FitMapBoundsAroundMarkers points={searchResults.map(hit => hit._source.location)} />
        )}
        <CenterMapOnSelectedMarker point={mouseClickPoint} />
      </MapContainer>
    </div>
  );
}

export default MapWithSearch;