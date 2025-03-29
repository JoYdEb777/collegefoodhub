
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
import { MessDetails } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";

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
  const [location, setLocation] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredMesses, setFilteredMesses] = useState<MessDetails[]>(dummyMesses);
  
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
  const [foodType, setFoodType] = useState("");
  
  // Apply filters
  useEffect(() => {
    let filtered = dummyMesses;
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(mess => 
        mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mess.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply location
    if (location) {
      filtered = filtered.filter(mess => 
        mess.address.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Apply price range
    filtered = filtered.filter(mess => {
      const cheapestRoom = mess.rooms.reduce((prev, current) => 
        (prev.rent < current.rent) ? prev : current
      );
      return cheapestRoom.rent >= priceRange[0] && cheapestRoom.rent <= priceRange[1];
    });
    
    // Apply room types
    if (roomTypes.single || roomTypes.double || roomTypes.triple) {
      filtered = filtered.filter(mess => 
        (roomTypes.single && mess.rooms.some(room => room.type === "single")) ||
        (roomTypes.double && mess.rooms.some(room => room.type === "double")) ||
        (roomTypes.triple && mess.rooms.some(room => room.type === "triple"))
      );
    }
    
    // Apply amenities
    if (amenities.wifi) {
      filtered = filtered.filter(mess => mess.amenities.wifi);
    }
    if (amenities.food) {
      filtered = filtered.filter(mess => mess.amenities.food);
    }
    
    // Apply food type
    if (foodType && amenities.food) {
      filtered = filtered.filter(mess => 
        mess.amenities.food && mess.amenities.foodType === foodType
      );
    }
    
    setFilteredMesses(filtered);
  }, [searchTerm, location, priceRange, roomTypes, amenities, foodType]);
  
  const resetFilters = () => {
    setSearchTerm("");
    setLocation("");
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
    setFoodType("");
  };
  
  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Find Your Perfect Mess</h1>
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by mess name or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
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
      
      {/* Filters */}
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
              {/* Price range */}
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
              
              {/* Room types */}
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
              
              {/* Amenities */}
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
                          <SelectItem value="">Any Type</SelectItem>
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
      
      {/* Results count */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            {filteredMesses.length} {filteredMesses.length === 1 ? 'mess' : 'messes'} found
            {(searchTerm || location || roomTypes.single || roomTypes.double || roomTypes.triple || 
              amenities.wifi || amenities.food || foodType) && (
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
      
      {/* Results */}
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
            markers={filteredMesses.map(mess => ({
              id: mess.id,
              lat: mess.location.lat,
              lng: mess.location.lng,
              title: mess.name
            }))}
            onMarkerClick={(id) => { console.log(`Clicked on mess ${id}`); }}
            height="600px"
          />
        </div>
      )}
    </div>
  );
};

export default SearchMess;
