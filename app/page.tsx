"use client"

import dynamic from "next/dynamic";

const MapWithSearch = dynamic(() => import("@/components/MapWithSearch"), {
  ssr: false,
  loading: () => <div className="text-white p-4">Loading map...</div>, // optional
});

export default function Home() {
  return <MapWithSearch />;
}