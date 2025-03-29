import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
  }>;
  onMarkerClick?: (id: string) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  center?: { lat: number; lng: number };
  selectable?: boolean;
  height?: string;
}

const MapView = ({
  markers = [],
  onMarkerClick,
  onLocationSelect,
  center = { lat: 20.5937, lng: 78.9629 }, // Default to India's center
  selectable = false,
  height = "400px"
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView([center.lat, center.lng], 12);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Handle map clicks for location selection
    if (selectable) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (onLocationSelect) {
          onLocationSelect(lat, lng);
        }
      });
    }

    return () => {
      map.remove();
    };
  }, [center, selectable, onLocationSelect]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    // Add new markers
    markers.forEach(({ id, lat, lng, title }) => {
      const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current!);
      marker.bindPopup(`<b>${title}</b>`);

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(id));
      }
    });
  }, [markers, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: "100%" }}
      className="rounded-lg overflow-hidden border border-gray-200"
    />
  );
};

export default MapView;
