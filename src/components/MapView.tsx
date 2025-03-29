
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  center = { lat: 20.5937, lng: 78.9629 }, // Default center of India
  selectable = false,
  height = "500px"
}: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [mapApiKey, setMapApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState(true);

  useEffect(() => {
    // Check if the map has been initialized
    if (mapApiLoaded && mapRef.current && mapApiKey) {
      // This is where we would initialize the map with the API key
      // In a real implementation, this would use the Google Maps API or any other map provider
      console.log("Map initialized with key:", mapApiKey);
      
      // For this demo, we'll just show a mock implementation
      const mapElement = mapRef.current;
      mapElement.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div class="text-center p-4">
            <p class="text-lg font-semibold">Interactive Map</p>
            <p class="text-sm text-gray-500">Using API Key: ${mapApiKey.substring(0, 4)}...${mapApiKey.substring(mapApiKey.length - 4)}</p>
            <p class="text-sm text-gray-500 mt-2">Markers: ${markers.length}</p>
            <p class="text-sm text-gray-500">Center: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}</p>
            <p class="text-xs text-gray-400 mt-4">In a real implementation, this would be an interactive map showing the markers</p>
          </div>
        </div>
      `;
    }
  }, [mapApiLoaded, markers, center, mapApiKey]);

  const handleApiKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const key = formData.get("mapApiKey") as string;
    
    if (key && key.length > 10) {
      setMapApiKey(key);
      setMapApiLoaded(true);
      setShowKeyInput(false);
      toast.success("Map API key added successfully");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  return (
    <div className="space-y-4">
      {showKeyInput && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <div>
              <label htmlFor="mapApiKey" className="block text-sm font-medium text-yellow-800">
                Enter Map API Key
              </label>
              <p className="text-xs text-yellow-600 mb-2">
                For demonstration purposes. In a production app, this would be securely handled on the server.
              </p>
              <input
                type="text"
                id="mapApiKey"
                name="mapApiKey"
                className="mt-1 block w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                placeholder="Enter your map API key"
                required
              />
            </div>
            <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
              Submit API Key
            </Button>
          </form>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="rounded-lg overflow-hidden border border-gray-200" 
        style={{ height, width: "100%" }}
      >
        {!mapApiLoaded && !showKeyInput && (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <p className="text-gray-500">Loading map...</p>
          </div>
        )}
      </div>
      
      {selectable && mapApiLoaded && (
        <div className="text-sm text-gray-500">
          Click on the map to select a location for your mess
        </div>
      )}
    </div>
  );
};

export default MapView;
