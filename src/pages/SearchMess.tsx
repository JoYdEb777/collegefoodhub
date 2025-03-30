import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MapView from "@/components/MapView";
import MessCard from "@/components/MessCard";
import { MessDetails, College } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { subscribeToMesses } from "@/services/messService";
import { searchLocation, calculateDistance } from "@/services/locationService";

const dummyMesses: MessDetails[] = [
  {
    id: "1",
    name: "Sunshine Mess",
    ownerId: "owner1",
    description: "A comfortable mess with homely food and amenities for students.",
    address: "Near Engineering College, Pune",
    location: { lat: 18.5204, lng: 73.8567 },
    photos: ["https://placehold.co/600x400/orange/white?text=Sunshine+Mess"],
    rooms: [
      { type: "single", count: 5, rent: 8000, photos: [] },
      { type: "double", count: 8, rent: 6000, photos: [] }
    ],
    amenities: {
      wifi: true,
      food: true,
      foodType: "veg",
      mealsPerDay: 3
    },
    ratings: 4.5
  },
  {
    id: "2",
    name: "Green Valley Mess",
    ownerId: "owner2",
    description: "Budget-friendly mess with clean rooms and good food.",
    address: "College Road, Mumbai",
    location: { lat: 19.0760, lng: 72.8777 },
    photos: ["https://placehold.co/600x400/green/white?text=Green+Valley"],
    rooms: [
      { type: "double", count: 10, rent: 5500, photos: [] },
      { type: "triple", count: 6, rent: 4500, photos: [] }
    ],
    amenities: {
      wifi: true,
      food: true,
      foodType: "both",
      mealsPerDay: 2
    },
    ratings: 4.2
  },
  {
    id: "3",
    name: "Royal Mess",
    ownerId: "owner3",
    description: "Premium mess with modern amenities and excellent food quality.",
    address: "Civil Lines, Delhi",
    location: { lat: 28.7041, lng: 77.1025 },
    photos: ["https://placehold.co/600x400/blue/white?text=Royal+Mess"],
    rooms: [
      { type: "single", count: 12, rent: 10000, photos: [] },
      { type: "double", count: 8, rent: 7500, photos: [] },
      { type: "triple", count: 4, rent: 6000, photos: [] }
    ],
    amenities: {
      wifi: true,
      food: true,
      foodType: "both",
      mealsPerDay: 3
    },
    ratings: 4.8
  },
  {
    id: "4",
    name: "Student's Nest",
    ownerId: "owner4",
    description: "Affordable mess with basic amenities for students on a budget.",
    address: "University Road, Bangalore",
    location: { lat: 12.9716, lng: 77.5946 },
    photos: ["https://placehold.co/600x400/purple/white?text=Students+Nest"],
    rooms: [
      { type: "double", count: 15, rent: 5000, photos: [] },
      { type: "triple", count: 10, rent: 4000, photos: [] }
    ],
    amenities: {
      wifi: false,
      food: true,
      foodType: "veg",
      mealsPerDay: 2
    },
    ratings: 3.9
  },
  {
    id: "5",
    name: "College Corner Mess",
    ownerId: "owner5",
    description: "Conveniently located mess with good food and friendly environment.",
    address: "Near IIT Campus, Chennai",
    location: { lat: 13.0827, lng: 80.2707 },
    photos: ["https://placehold.co/600x400/teal/white?text=College+Corner"],
    rooms: [
      { type: "single", count: 8, rent: 7000, photos: [] },
      { type: "double", count: 12, rent: 5000, photos: [] }
    ],
    amenities: {
      wifi: true,
      food: true,
      foodType: "both",
      mealsPerDay: 3
    },
    ratings: 4.3
  }
];

const locations = [
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 }
];

const SearchMess = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredMesses, setFilteredMesses] = useState<MessDetails[]>(dummyMesses);
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<College | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [nearbyMesses, setNearbyMesses] = useState<MessDetails[]>([]);
  const [collegesOnMap, setCollegesOnMap] = useState<College[]>([]);

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [roomTypes, setRoomTypes] = useState({
    single: false,
    double: false,
    triple: false
  });
  const [amenities, setAmenities] = useState({
    wifi: false,
    food: false
  });
  const [foodType, setFoodType] = useState("any");

  const handleLocationSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchLocation(query);
      setSearchResults(results);
      setCollegesOnMap(results); // Update colleges to display on the map
    } catch (error) {
      console.error('Location search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCollegeSelect = async (college: College) => {
    setSelectedCollege(college);
    setSearchTerm(college.name);
    setSearchResults([]);
    setCollegesOnMap([college]); // Focus on the selected college

    const messesWithDistance = filteredMesses.map(mess => ({
      ...mess,
      distance: calculateDistance(
        college.lat,
        college.lng,
        mess.location.lat,
        mess.location.lng
      )
    }));

    const sorted = messesWithDistance.sort((a, b) => a.distance - b.distance);
    setNearbyMesses(sorted);
  };

  useEffect(() => {
    const unsubscribe = subscribeToMesses({
      location: location !== "all" ? location : undefined,
      priceRange: priceRange,
      roomTypes: Object.entries(roomTypes)
        .filter(([_, checked]) => checked)
        .map(([type]) => type),
      amenities: {
        wifi: amenities.wifi,
        food: amenities.food
      },
      foodType: foodType !== "any" ? foodType : undefined
    }, (messes) => {
      if (searchTerm) {
        const filtered = messes.filter(mess =>
          mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mess.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMesses(filtered);
      } else {
        setFilteredMesses(messes);
      }
    });

    return () => unsubscribe();
  }, [searchTerm, location, priceRange, roomTypes, amenities, foodType]);

  const resetFilters = () => {
    setSearchTerm("");
    setLocation("all");
    setPriceRange([0, 15000]);
    setRoomTypes({
      single: false,
      double: false,
      triple: false
    });
    setAmenities({
      wifi: false,
      food: false
    });
    setFoodType("any");
  };

  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Find Your Perfect Mess</h1>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <div className="relative">
              <Input
                placeholder="Search by college name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleLocationSearch(e.target.value);
                }}
                className="pl-10"
              />
              
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                  {searchResults.map((college, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleCollegeSelect(college)}
                    >
                      <div className="font-medium text-messsathi-orange">{college.name}</div>
                      <div className="text-sm text-gray-600">{college.city}</div>
                      <div className="text-xs text-gray-500 truncate">{college.address}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={toggleFilter} className="flex items-center">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className="flex-1"
            >
              List
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              onClick={() => setViewMode("map")}
              className="flex-1"
            >
              Map
            </Button>
          </div>
        </div>
      </div>
      
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => resetFilters()} className="h-8">
                Reset All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Price Range (₹/month)</h4>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={15000}
                    step={500}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Room Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="single" 
                      checked={roomTypes.single}
                      onCheckedChange={(checked) => 
                        setRoomTypes({...roomTypes, single: checked as boolean})
                      }
                    />
                    <Label htmlFor="single">Single Room</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="double" 
                      checked={roomTypes.double}
                      onCheckedChange={(checked) => 
                        setRoomTypes({...roomTypes, double: checked as boolean})
                      }
                    />
                    <Label htmlFor="double">Double Sharing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="triple" 
                      checked={roomTypes.triple}
                      onCheckedChange={(checked) => 
                        setRoomTypes({...roomTypes, triple: checked as boolean})
                      }
                    />
                    <Label htmlFor="triple">Triple Sharing</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Amenities</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="wifi" 
                      checked={amenities.wifi}
                      onCheckedChange={(checked) => 
                        setAmenities({...amenities, wifi: checked as boolean})
                      }
                    />
                    <Label htmlFor="wifi">WiFi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="food" 
                      checked={amenities.food}
                      onCheckedChange={(checked) => 
                        setAmenities({...amenities, food: checked as boolean})
                      }
                    />
                    <Label htmlFor="food">Food Service</Label>
                  </div>
                  
                  {amenities.food && (
                    <div className="pl-6 pt-2">
                      <Select value={foodType} onValueChange={setFoodType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Food Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Type</SelectItem>
                          <SelectItem value="veg">Vegetarian Only</SelectItem>
                          <SelectItem value="non-veg">Non-Vegetarian Only</SelectItem>
                          <SelectItem value="both">Both Available</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {selectedCollege && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Messes near {selectedCollege.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyMesses.map((mess) => (
              <MessCard
                key={mess.id}
                mess={mess}
                distance={mess.distance}
                showDistance={true}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            {filteredMesses.length} {filteredMesses.length === 1 ? 'mess' : 'messes'} found
            {(searchTerm || location !== "all" || roomTypes.single || roomTypes.double || roomTypes.triple || 
              amenities.wifi || amenities.food || foodType !== "any") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="ml-2 h-8 text-messsathi-blue"
              >
                <X className="h-3 w-3 mr-1" />
                Clear Filters
              </Button>
            )}
          </p>
        </div>
        <div>
          <Select defaultValue="recommended">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {viewMode === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMesses.length > 0 ? (
            filteredMesses.map((mess) => (
              <MessCard key={mess.id} mess={mess} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium mb-2">No messes found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
          <MapView
            markers={filteredMesses.map((mess) => ({
              id: mess.id,
              lat: mess.location.lat,
              lng: mess.location.lng,
              title: mess.name
            }))}
            colleges={collegesOnMap.map((college) => ({
              id: college.name,
              lat: college.lat,
              lng: college.lng,
              name: college.name
            }))}
            center={selectedCollege ? 
              { lat: selectedCollege.lat, lng: selectedCollege.lng } : 
              undefined}
            height="600px"
          />
        </div>
      )}
    </div>
  );
};

export default SearchMess;
