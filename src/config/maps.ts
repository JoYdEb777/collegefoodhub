export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const defaultCenter = {
  lat: 20.5937, // India's center latitude
  lng: 78.9629  // India's center longitude
};

export const defaultZoom = 12;

// Popular college cities coordinates
export const collegeHubs = [
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  // Add more college hubs as needed
];
