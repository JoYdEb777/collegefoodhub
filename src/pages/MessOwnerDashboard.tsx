import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUpload from "@/components/FileUpload";
import MapView from "@/components/MapView";
import { toast } from "sonner";
import { MessDetails } from "@/types";
import { db, storage, auth } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, setDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { searchLocation, LocationSuggestion } from "@/services/locationService";
import { debounce } from "lodash";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import OwnerProfileDialog from "@/components/OwnerProfileDialog";

const MessOwnerDashboard = () => {
  const { user, userData, setUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [messPhotos, setMessPhotos] = useState<File[]>([]);
  const [singleRoomPhotos, setSingleRoomPhotos] = useState<File[]>([]);
  const [doubleRoomPhotos, setDoubleRoomPhotos] = useState<File[]>([]);
  const [tripleRoomPhotos, setTripleRoomPhotos] = useState<File[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [messInfo, setMessInfo] = useState({
    name: "",
    description: "",
    address: "",
    location: { lat: 20.5937, lng: 78.9629 },
    
    // Room details
    hasSingleRooms: false,
    singleRoomCount: 0,
    singleRoomRent: 0,
    
    hasDoubleRooms: false,
    doubleRoomCount: 0,
    doubleRoomRent: 0,
    
    hasTripleRooms: false,
    tripleRoomCount: 0,
    tripleRoomRent: 0,
    
    // Amenities
    hasWifi: false,
    providesFood: false,
    foodType: "veg",
    mealsPerDay: 3,
    
    // Weekly menu
    weeklyMenu: [
      { day: "Monday", breakfast: "", lunch: "", dinner: "" },
      { day: "Tuesday", breakfast: "", lunch: "", dinner: "" },
      { day: "Wednesday", breakfast: "", lunch: "", dinner: "" },
      { day: "Thursday", breakfast: "", lunch: "", dinner: "" },
      { day: "Friday", breakfast: "", lunch: "", dinner: "" },
      { day: "Saturday", breakfast: "", lunch: "", dinner: "" },
      { day: "Sunday", breakfast: "", lunch: "", dinner: "" },
    ]
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMessInfo(prev => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (!query) {
        setAddressSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchLocation(query);
        setAddressSuggestions(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500)
  ).current;

  // Handle address search
  const handleAddressSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setMessInfo(prev => ({ ...prev, address: query }));
    debouncedSearch(query);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    setMessInfo(prev => ({
      ...prev,
      address: suggestion.address,
      location: suggestion.location
    }));
    setAddressSuggestions([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMessInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setMessInfo(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setMessInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMessInfo(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const handleMenuChange = (day: string, meal: string, value: string) => {
    setMessInfo(prev => ({
      ...prev,
      weeklyMenu: prev.weeklyMenu.map(item => 
        item.day === day ? { ...item, [meal]: value } : item
      )
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) {
      toast.error("Please login first");
      return;
    }

    // Validation
    if (!messInfo.name || !messInfo.address) {
      toast.error("Please provide all required information");
      return;
    }
    
    if (messPhotos.length === 0) {
      toast.error("Please upload at least one photo of your mess");
      return;
    }
    
    try {
      // Upload mess photos
      const photoUrls = await Promise.all(
        messPhotos.map(async (file) => {
          const fileRef = ref(storage, `mess_photos/${user?.uid}/${file.name}`);
          await uploadBytes(fileRef, file);
          return getDownloadURL(fileRef);
        })
      );

      // Create mess document
      const messData = {
        ...messInfo,
        ownerName: userData.name,
        ownerPhoto: userData.photoURL,
        photos: photoUrls,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'messes', user!.uid), messData);
      toast.success("Mess information saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save mess information");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    }
  };

  const handleProfileUpdate = async () => {
    if (!userData?.uid) return;
    
    setIsLoading(true);
    try {
      // Get fresh user data from Firestore
      const userDocRef = doc(db, 'users', userData.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const freshData = userDocSnap.data();
        await updateUserData(freshData);
        toast.success("Profile updated successfully");
        
        // Update local state to reflect changes
        setUserData(freshData);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-messsathi-orange/10 to-messsathi-blue/10 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <div className="relative">
              <img 
                src={userData?.photoURL || '/default-avatar.png'}
                alt={userData?.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              {userData?.aadharVerified && (
                <div className="absolute -bottom-2 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userData?.name}</h1>
              <p className="text-gray-600">{userData?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-messsathi-orange/10 text-messsathi-orange rounded-full text-sm">
                  Mess Owner
                </span>
                {userData?.aadharVerified && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsEditing(true)}
            >
              <Settings size={16} />
              Edit Profile
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-fit w-full">
          <TabsTrigger value="profile">Your Profile</TabsTrigger>
          <TabsTrigger value="mess-info">Mess Details</TabsTrigger>
          <TabsTrigger value="rooms-food">Rooms & Food</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>View and update your personal information</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="shrink-0"
              >
                Edit Profile
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="owner-name">Full Name</Label>
                <Input id="owner-name" value={userData?.name || ""} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner-email">Email</Label>
                <Input id="owner-email" value={userData?.email || ""} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner-phone">Phone Number</Label>
                <Input id="owner-phone" value={userData?.phone || ""} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" value={userData?.businessName || ""} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-address">Business Address</Label>
                <Input id="business-address" value={userData?.businessAddress || ""} disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Mess Info Tab */}
        <TabsContent value="mess-info" className="space-y-6">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Mess Details</CardTitle>
                <CardDescription>
                  Provide information about your mess
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Mess Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter mess name"
                    required
                    value={messInfo.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your mess, facilities, rules, etc."
                    rows={4}
                    value={messInfo.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <Input
                      ref={searchInputRef}
                      id="address"
                      name="address"
                      placeholder="Start typing college name..."
                      required
                      value={messInfo.address}
                      onChange={handleAddressSearch}
                    />
                    
                    {isSearching && (
                      <div className="absolute right-3 top-3">
                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}

                    {addressSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                        {addressSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionSelect(suggestion)}
                          >
                            <div className="font-medium">{suggestion.name}</div>
                            <div className="text-sm text-gray-600 truncate">
                              {suggestion.address}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label>Location on Map</Label>
                    <MapView
                      center={messInfo.location}
                      selectable={true}
                      markers={[
                        {
                          id: "mess-location",
                          lat: messInfo.location.lat,
                          lng: messInfo.location.lng,
                          title: messInfo.name || "Your Mess Location"
                        }
                      ]}
                      onLocationSelect={(lat, lng) =>
                        setMessInfo((prev) => ({ ...prev, location: { lat, lng } }))
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Mess Photos</Label>
                  <FileUpload 
                    label="Upload Mess Photos" 
                    multiple={true} 
                    onChange={setMessPhotos}
                    maxFiles={5}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="bg-messsathi-orange hover:bg-orange-600">
                  Save Mess Details
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        
        {/* Rooms & Food Tab */}
        <TabsContent value="rooms-food" className="space-y-6">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Room Types</CardTitle>
                <CardDescription>
                  Specify the types of rooms available in your mess
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Single Room */}
                <div className="space-y-4 pb-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="hasSingleRooms" 
                      checked={messInfo.hasSingleRooms}
                      onCheckedChange={(checked) => handleSwitchChange("hasSingleRooms", checked)}
                    />
                    <Label htmlFor="hasSingleRooms">Single Rooms Available</Label>
                  </div>
                  
                  {messInfo.hasSingleRooms && (
                    <div className="pl-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="singleRoomCount">Number of Single Rooms</Label>
                          <Input
                            id="singleRoomCount"
                            name="singleRoomCount"
                            type="number"
                            min="1"
                            value={messInfo.singleRoomCount}
                            onChange={handleNumberChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="singleRoomRent">Monthly Rent (₹)</Label>
                          <Input
                            id="singleRoomRent"
                            name="singleRoomRent"
                            type="number"
                            min="0"
                            value={messInfo.singleRoomRent}
                            onChange={handleNumberChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Single Room Photos</Label>
                        <FileUpload 
                          label="Upload Single Room Photos" 
                          multiple={true} 
                          onChange={setSingleRoomPhotos}
                          maxFiles={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Double Room */}
                <div className="space-y-4 pb-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="hasDoubleRooms" 
                      checked={messInfo.hasDoubleRooms}
                      onCheckedChange={(checked) => handleSwitchChange("hasDoubleRooms", checked)}
                    />
                    <Label htmlFor="hasDoubleRooms">Double Sharing Rooms Available</Label>
                  </div>
                  
                  {messInfo.hasDoubleRooms && (
                    <div className="pl-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="doubleRoomCount">Number of Double Rooms</Label>
                          <Input
                            id="doubleRoomCount"
                            name="doubleRoomCount"
                            type="number"
                            min="1"
                            value={messInfo.doubleRoomCount}
                            onChange={handleNumberChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="doubleRoomRent">Monthly Rent per Person (₹)</Label>
                          <Input
                            id="doubleRoomRent"
                            name="doubleRoomRent"
                            type="number"
                            min="0"
                            value={messInfo.doubleRoomRent}
                            onChange={handleNumberChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Double Room Photos</Label>
                        <FileUpload 
                          label="Upload Double Room Photos" 
                          multiple={true} 
                          onChange={setDoubleRoomPhotos}
                          maxFiles={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Triple Room */}
                <div className="space-y-4 pb-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="hasTripleRooms" 
                      checked={messInfo.hasTripleRooms}
                      onCheckedChange={(checked) => handleSwitchChange("hasTripleRooms", checked)}
                    />
                    <Label htmlFor="hasTripleRooms">Triple Sharing Rooms Available</Label>
                  </div>
                  
                  {messInfo.hasTripleRooms && (
                    <div className="pl-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tripleRoomCount">Number of Triple Rooms</Label>
                          <Input
                            id="tripleRoomCount"
                            name="tripleRoomCount"
                            type="number"
                            min="1"
                            value={messInfo.tripleRoomCount}
                            onChange={handleNumberChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tripleRoomRent">Monthly Rent per Person (₹)</Label>
                          <Input
                            id="tripleRoomRent"
                            name="tripleRoomRent"
                            type="number"
                            min="0"
                            value={messInfo.tripleRoomRent}
                            onChange={handleNumberChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Triple Room Photos</Label>
                        <FileUpload 
                          label="Upload Triple Room Photos" 
                          multiple={true} 
                          onChange={setTripleRoomPhotos}
                          maxFiles={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Amenities</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="hasWifi" 
                      checked={messInfo.hasWifi}
                      onCheckedChange={(checked) => handleSwitchChange("hasWifi", checked)}
                    />
                    <Label htmlFor="hasWifi">WiFi Available</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="providesFood" 
                      checked={messInfo.providesFood}
                      onCheckedChange={(checked) => handleSwitchChange("providesFood", checked)}
                    />
                    <Label htmlFor="providesFood">Food Services Available</Label>
                  </div>
                  
                  {messInfo.providesFood && (
                    <div className="pl-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="foodType">Food Type</Label>
                        <Select 
                          value={messInfo.foodType} 
                          onValueChange={(value) => handleSelectChange("foodType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select food type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="veg">Vegetarian Only</SelectItem>
                            <SelectItem value="non-veg">Non-Vegetarian Only</SelectItem>
                            <SelectItem value="both">Both Veg and Non-Veg</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="mealsPerDay">Meals Per Day</Label>
                        <Select 
                          value={messInfo.mealsPerDay.toString()} 
                          onValueChange={(value) => handleSelectChange("mealsPerDay", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select number of meals" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Meal</SelectItem>
                            <SelectItem value="2">2 Meals</SelectItem>
                            <SelectItem value="3">3 Meals</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-md font-medium">Weekly Menu</h4>
                        
                        {messInfo.weeklyMenu.map((day, index) => (
                          <div key={index} className="p-4 border rounded-md">
                            <h5 className="font-medium mb-2">{day.day}</h5>
                            <div className="grid grid-cols-1 gap-4">
                              {messInfo.mealsPerDay >= 1 && (
                                <div className="space-y-1">
                                  <Label htmlFor={`breakfast-${day.day}`}>Breakfast</Label>
                                  <Input
                                    id={`breakfast-${day.day}`}
                                    value={day.breakfast}
                                    onChange={(e) => handleMenuChange(day.day, "breakfast", e.target.value)}
                                    placeholder="Breakfast menu"
                                  />
                                </div>
                              )}
                              
                              {messInfo.mealsPerDay >= 2 && (
                                <div className="space-y-1">
                                  <Label htmlFor={`lunch-${day.day}`}>Lunch</Label>
                                  <Input
                                    id={`lunch-${day.day}`}
                                    value={day.lunch}
                                    onChange={(e) => handleMenuChange(day.day, "lunch", e.target.value)}
                                    placeholder="Lunch menu"
                                  />
                                </div>
                              )}
                              
                              {messInfo.mealsPerDay >= 3 && (
                                <div className="space-y-1">
                                  <Label htmlFor={`dinner-${day.day}`}>Dinner</Label>
                                  <Input
                                    id={`dinner-${day.day}`}
                                    value={day.dinner}
                                    onChange={(e) => handleMenuChange(day.day, "dinner", e.target.value)}
                                    placeholder="Dinner menu"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="bg-messsathi-orange hover:bg-orange-600">
                  Save Room & Food Details
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>

      <OwnerProfileDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        userData={userData}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default MessOwnerDashboard;
