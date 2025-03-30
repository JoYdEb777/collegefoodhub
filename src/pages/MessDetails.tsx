import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { MessDetails as MessDetailsType } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Wifi, Utensils, MapPin } from "lucide-react";
import MapView from "@/components/MapView";

const MessDetails = () => {
  const { id } = useParams();
  const [mess, setMess] = useState<MessDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchMessDetails = async () => {
      try {
        const messDoc = await getDoc(doc(db, 'messes', id!));
        if (messDoc.exists()) {
          setMess({ id: messDoc.id, ...messDoc.data() } as MessDetailsType);
        }
      } catch (error) {
        console.error("Error fetching mess details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!mess) {
    return <div>Mess not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <img
          src={mess.photos[0]}
          alt={mess.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{mess.name}</h1>
          <p className="flex items-center text-lg">
            <MapPin className="h-5 w-5 mr-2" />
            {mess.address}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="food">Food Menu</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-2">About this Mess</h3>
                <p className="text-gray-600">{mess.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mess.amenities.wifi && (
                    <div className="flex items-center text-gray-700">
                      <Wifi className="h-5 w-5 mr-2" />
                      <span>WiFi Available</span>
                    </div>
                  )}
                  {mess.amenities.food && (
                    <div className="flex items-center text-gray-700">
                      <Utensils className="h-5 w-5 mr-2" />
                      <span>{mess.amenities.foodType} Food</span>
                    </div>
                  )}
                  {/* Add more amenities */}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rooms" className="space-y-6">
              {mess.rooms.map((room, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Monthly Rent</p>
                      <p className="text-2xl font-bold text-messsathi-orange">
                        ₹{room.rent}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Available Rooms</p>
                      <p className="text-2xl font-bold">{room.count}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="food" className="space-y-6">
              {mess.amenities.food && (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Food Service</h3>
                    <p className="text-gray-600">
                      {mess.amenities.foodType} food with {mess.amenities.mealsPerDay} meals per day
                    </p>
                  </div>

                  {mess.amenities.weeklyMenu && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Weekly Menu</h3>
                      <div className="space-y-4">
                        {mess.amenities.weeklyMenu.map((menu, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-2">{menu.day}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {menu.breakfast && (
                                <div>
                                  <p className="text-sm text-gray-600">Breakfast</p>
                                  <p>{menu.breakfast}</p>
                                </div>
                              )}
                              {menu.lunch && (
                                <div>
                                  <p className="text-sm text-gray-600">Lunch</p>
                                  <p>{menu.lunch}</p>
                                </div>
                              )}
                              {menu.dinner && (
                                <div>
                                  <p className="text-sm text-gray-600">Dinner</p>
                                  <p>{menu.dinner}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="location">
              <div className="h-[400px] rounded-lg overflow-hidden">
                <MapView
                  markers={[
                    {
                      id: mess.id,
                      lat: mess.location.lat,
                      lng: mess.location.lng,
                      title: mess.name
                    }
                  ]}
                  center={mess.location}
                  height="400px"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Owner</h3>
              <Button className="w-full bg-messsathi-orange hover:bg-orange-600">
                Book Now
              </Button>
              <Button variant="outline" className="w-full mt-2">
                Save Mess
              </Button>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Owner Details</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={mess.ownerPhoto || "/default-avatar.png"}
                  alt={mess.ownerName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{mess.ownerName}</p>
                  <p className="text-sm text-gray-600">Verified Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessDetails;
