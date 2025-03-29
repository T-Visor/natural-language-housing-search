"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparkles, Search } from "lucide-react"

const position: LatLngExpression = [51.505, -0.09];

export default function Map() {
  return (
    <div className="h-full w-full">
      <div className="py-2 flex items-center space-x-3 px-4">
        <SidebarTrigger />

        {/* Vertical line separator*/}
        <div className="h-6 w-px bg-gray-600" /> 

        {/* Search bar with icon */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search" className="pl-9"/>
        </div>

        {/* Button to execute search */}
        <Button>
          <Sparkles />
        </Button>
      </div>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        attributionControl={false}
      >
        <TileLayer
          attribution=""
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
