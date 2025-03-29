import { useState } from "react";
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
import { db, storage } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const MessOwnerDashboard = () => {
  const { user, userData } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [messPhotos, setMessPhotos] = useState<File[]>([]);
  const [singleRoomPhotos, setSingleRoomPhotos] = useState<File[]>([]);
  const [doubleRoomPhotos, setDoubleRoomPhotos] = useState<File[]>([]);
  const [tripleRoomPhotos, setTripleRoomPhotos] = useState<File[]>([]);
  
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
        ownerId: user?.uid,
        ownerName: userData?.name,
        name: messInfo.name,
        description: messInfo.description,
        address: messInfo.address,
        location: messInfo.location,
        photos: photoUrls,
        rooms: [],
        amenities: {
          wifi: messInfo.hasWifi,
          food: messInfo.providesFood,
          foodType: messInfo.foodType,
          mealsPerDay: messInfo.mealsPerDay,
          weeklyMenu: messInfo.weeklyMenu
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const messRef = await addDoc(collection(db, 'messes'), messData);
      toast.success("Mess information saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save mess information");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Mess Owner Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-fit w-full">
          <TabsTrigger value="profile">Your Profile</TabsTrigger>
          <TabsTrigger value="mess-info">Mess Details</TabsTrigger>
          <TabsTrigger value="rooms-food">Rooms & Food</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                View and update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="owner-name">Full Name</Label>
                <Input id="owner-name" value="John Doe" disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner-email">Email</Label>
                <Input id="owner-email" value="john.doe@example.com" disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner-phone">Phone Number</Label>
                <Input id="owner-phone" value="+91 9876543210" disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aadhar-status">Aadhar Verification</Label>
                <div className="px-4 py-2 bg-green-50 text-green-700 rounded-md flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Update Profile</Button>
            </CardFooter>
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
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Enter complete address"
                    rows={2}
                    required
                    value={messInfo.address}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Mess Location on Map</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    Select your mess location on the map
                  </p>
                  <MapView 
                    center={messInfo.location}
                    selectable={true}
                    onLocationSelect={(lat, lng) => 
                      setMessInfo(prev => ({ ...prev, location: { lat, lng } }))
                    }
                  />
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
    </div>
  );
};

export default MessOwnerDashboard;
