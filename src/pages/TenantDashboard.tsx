
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { MessDetails } from "@/types";
import MessCard from "@/components/MessCard";

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
  }
];

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Tenant Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-fit w-full">
          <TabsTrigger value="profile">Your Profile</TabsTrigger>
          <TabsTrigger value="saved">Saved Messes</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
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
                <div className="text-sm font-medium text-gray-500">Full Name</div>
                <div>Rahul Singh</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div>rahul.singh@example.com</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Phone Number</div>
                <div>+91 9876543210</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Aadhar Verification</div>
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
          
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
              <CardDescription>
                Your current accommodation status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-amber-600 font-medium flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Looking for a mess
              </div>
              <p className="text-sm text-gray-500 mt-2">
                You are currently searching for a mess. Once you book a mess, your status will be updated.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/search">
                <Button className="bg-messsathi-blue hover:bg-blue-600">Find a Mess</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Saved Messes Tab */}
        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Messes</CardTitle>
              <CardDescription>
                Messes you've saved for later
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dummyMesses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dummyMesses.map((mess) => (
                    <MessCard key={mess.id} mess={mess} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't saved any messes yet</p>
                  <Link to="/search">
                    <Button>Find Messes</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Bookings</CardTitle>
              <CardDescription>
                Your current mess bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any active bookings</p>
                <Link to="/search">
                  <Button>Find Messes</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
              <CardDescription>
                Your past mess bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any booking history</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantDashboard;
