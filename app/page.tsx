"use client"

import dynamic from "next/dynamic";

const MapWithSearch = dynamic(() => import("@/components/Map/MapWithSearch"), {
  ssr: false,
  loading: () => <div className="text-white p-4">Loading map...</div>, // optional
});

const Home = () => {
  return <MapWithSearch />;
}
export default Home;