import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { MessDetails } from "@/types";
import MessCard from "@/components/MessCard";
import { useAuth } from "@/contexts/AuthContext"; // Updated import path
import EditProfileDialog from "@/components/EditProfileDialog";
import { Loader2 } from "lucide-react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from "sonner";

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
  const { userData, updateUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async () => {
    if (!userData?.uid) return;
    
    setIsLoading(true);
    try {
      const userDocRef = doc(db, 'users', userData.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const freshData = userDocSnap.data();
        await updateUserData(freshData);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast.error("Failed to refresh profile data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-messsathi-orange/10 to-messsathi-blue/10 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img 
              src={userData?.photoURL || '/default-avatar.png'}
              alt={userData?.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-2 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{userData?.name}</h1>
            <p className="text-gray-600">{userData?.email}</p>
            {userData?.college && (
              <p className="text-gray-600 mt-1">
                {userData.course} • {userData.college}
              </p>
            )}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-fit w-full">
          <TabsTrigger value="profile">Your Profile</TabsTrigger>
          <TabsTrigger value="saved">Saved Messes</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your profile information
                </CardDescription>
              </div>
              <Button 
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="shrink-0"
              >
                Edit Profile
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="font-medium">{userData?.name}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="font-medium">{userData?.email}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="font-medium">{userData?.phone}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">College</p>
                      <p className="font-medium">{userData?.college || "Not specified"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Course</p>
                      <p className="font-medium">{userData?.course || "Not specified"}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Year</p>
                      <p className="font-medium">{userData?.year || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Verification Status</h4>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-green-50 text-green-700 rounded-md p-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Email Verified
                      </div>
                      <div className="flex-1 bg-green-50 text-green-700 rounded-md p-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Phone Verified
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
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

      <EditProfileDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        userData={userData}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default TenantDashboard;
