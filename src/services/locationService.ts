const GEOCODING_API_URL = 'https://nominatim.openstreetmap.org';

export interface College {
  name: string;
  address: string;
  lat: number;
  lng: number;
  city: string;
}

export interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface LocationWithDistance {
  distance: number;
  location: { lat: number; lng: number };
}

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const searchLocation = async (query: string): Promise<College[]> => {
  const response = await fetch(
    `${GEOCODING_API_URL}/search?q=${encodeURIComponent(
      query + ' college india'
    )}&format=json&addressdetails=1&limit=5&countrycodes=in`
  );
  
  const data = await response.json();
  
  return data.map((item: any) => ({
    name: item.display_name.split(',')[0],
    address: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    city: item.address?.city || item.address?.town || item.address?.state || ''
  }));
};
