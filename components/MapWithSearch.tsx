"use client";

import { useEffect } from "react"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { MapContainer, TileLayer, Marker, Popup, useMap, Fit } from "react-leaflet";
import L from "leaflet";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparkles, Search } from "lucide-react"

const points: [number, number][] = [
  [39.2904, -76.6122], // Baltimore
  [38.9072, -77.0369], // DC
  [40.7128, -74.0060], // NYC
];

const customIcon = L.icon({
  iconUrl: "/vercel.svg",
  iconRetinaUrl: "/vercel.svg",
  iconSize: [20, 20],
  iconAnchor: [16, 32],
})

const MapResizeHandler = () => {
  const map = useMap();
  const open = useSidebar();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200); // small delay gives layout time to settle
  }, [open, map]);

  return null;
};

const FitBoundsToMarkers = ({ points }: { points: [number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50] }); // optional padding
  }, [points, map]);

  return null; // doesn't render anything visible
};

const MapWithSearch = () => {
  return (
    <div className="h-full w-full">
      <div className="py-2 flex items-center space-x-3 px-4 h-13 border-b">
        {/* Button to control collapsible sidebar */}
        <SidebarTrigger />

        {/* Vertical line separator*/}
        <div className="h-6 w-px bg-gray-600" />

        {/* Search bar with icon */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search" className="pl-9" />
        </div>

        {/* Button to execute search */}
        <Button>
          <Sparkles />
        </Button>
      </div>

      {/* Interactive Map*/}
      <MapContainer
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        attributionControl={false}
      >
        <MapResizeHandler />
        <TileLayer
          attribution=""
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
      {points.map((position, index) => (
        <Marker key={index} position={position} icon={customIcon}>
          <Popup>Point {index + 1}</Popup>
        </Marker>
      ))}
      <FitBoundsToMarkers points={points} />
      </MapContainer>
    </div>
  );
}
export default MapWithSearch;