"use client";

import { useEffect, useState } from "react"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparkles, Search } from "lucide-react"
import useHousingCoordinates from "@/hooks/useHousingCoordinates"
import { CenterMapOnSelectedMarker, ResizeMapOnSidebarToggle, FitMapBoundsAroundMarkers } from "./MapEffects"
import useSearchResultsStore from "@/store/useSearchResultsStore";
import getSearchResults from "@/lib/getSearchResults"

const customIcon = L.icon({
  iconUrl: "/vercel.svg",
  iconRetinaUrl: "/vercel.svg",
  iconSize: [20, 20],
  iconAnchor: [16, 32],
})

const MapWithSearch = () => {
  const coordinates = useHousingCoordinates();
  const setSearchResults = useSearchResultsStore((state) => state.setSearchResults);
  const [mouseClickPoint, setMouseClickPoint] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getSearchResults();
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }
    fetchData();
  }, [setSearchResults]);

  return (
    <div className="h-full w-full">
      <div className="py-2 flex items-center space-x-3 px-4 h-13 border-b">

        {/* Sidebar trigger button */}
        <SidebarTrigger />

        {/* Vertical line separator */}
        <div className="h-6 w-px bg-gray-600" />

        <form
          onSubmit={(e) => {
            e.preventDefault(); // prevents page from refreshing
            alert(searchQuery)
          }}
          className="flex items-center space-x-3 w-full"
        >
          <div className="relative w-full">
            {/* Search bar with icon */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Clears the search bar */}
            <Button
              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              variant="ghost"
              type="button" // important so it doesn't submit
              onClick={() => setSearchQuery("")}
            >
              X
            </Button>
          </div>
          <Button type="submit">
            <Sparkles />
          </Button>
        </form>
      </div>

      {/* Interactive Map*/}
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
        {coordinates.map((point, index) => (
          <Marker
            key={index}
            position={point}
            icon={customIcon}
            eventHandlers={{
              click: () => setMouseClickPoint(point),
            }}
          />
        ))}
        <ResizeMapOnSidebarToggle />
        <FitMapBoundsAroundMarkers points={coordinates} />
        <CenterMapOnSelectedMarker point={mouseClickPoint} />
      </MapContainer>
    </div>
  );
}

export default MapWithSearch;