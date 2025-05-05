import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useMap } from "react-leaflet";

const CenterMapOnSelectedMarker = ({ point }: { point: [number, number] | null }) => {
  const map = useMap();

  useEffect(() => {
    if (!point) return;
    map.panTo(point, {
      animate: true,
      duration: 0.2,
    });
  }, [point, map]);

  return null; // doesn't render anything visible
}

const ResizeMapOnSidebarToggle = () => {
  const map = useMap();
  const open = useSidebar();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200); // small delay gives layout time to settle
  }, [open, map]);

  return null; // doesn't render anything visible
};

const FitMapBoundsAroundMarkers = ({ points }: { points: [number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0)
      return;
    else {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] }); // optional padding
    }
  }, [points, map]);

  return null; // doesn't render anything visible
};

export { CenterMapOnSelectedMarker, ResizeMapOnSidebarToggle, FitMapBoundsAroundMarkers };