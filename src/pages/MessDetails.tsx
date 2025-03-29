
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapView from "@/components/MapView";
import { MessDetails as MessDetailsType } from "@/types";
import { Wifi, Utensils, Phone, Mail, Star, MapPin } from "lucide-react";
import { toast } from "sonner";

// Sample data
const dummyMesses: MessDetailsType[] = [
  {
    id: "1",
    name: "Sunshine Mess",
    ownerId: "owner1",
    description: "A comfortable mess with homely food and amenities for students. We provide clean rooms, hygienic food, and a conducive environment for students to study and relax. The mess is located near the engineering college, making it convenient for students to commute.",
    address: "Plot No. 123, Near Engineering College, Shivaji Nagar, Pune - 411005",
    location: { lat: 18.5204, lng: 73.8567 },
    photos: [
      "https://placehold.co/600x400/orange/white?text=Sunshine+Mess+Main",
      "https://placehold.co/600x400/orange/white?text=Sunshine+Mess+Front",
      "https://placehold.co/600x400/orange/white?text=Sunshine+Mess+Common+Area"
    ],
    rooms: [
      { 
        type: "single", 
        count: 5, 
        rent: 8000, 
        photos: [
          "https://placehold.co/600x400/orange/white?text=Single+Room+1",
          "https://placehold.co/600x400/orange/white?text=Single+Room+2"
        ] 
      },
      { 
        type: "double", 
        count: 8, 
        rent: 6000, 
        photos: [
          "https://placehold.co/600x400/orange/white?text=Double+Room+1",
          "https://placehold.co/600x400/orange/white?text=Double+Room+2"
        ] 
      }
    ],
    amenities: {
      wifi: true,
      food: true,
      foodType: "veg",
      mealsPerDay: 3,
      weeklyMenu: [
        { day: "Monday", breakfast: "Poha, Tea", lunch: "Rice, Dal, Chapati, Vegetable", dinner: "Rice, Dal, Chapati, Paneer" },
        { day: "Tuesday", breakfast: "Upma, Tea", lunch: "Rice, Dal, Chapati, Vegetable", dinner: "Rice, Dal, Chapati, Vegetable" },
        { day: "Wednesday", breakfast: "Idli, Sambhar, Tea", lunch: "Rice, Dal, Chapati, Vegetable", dinner: "Rice, Dal, Chapati, Vegetable" },
        { day: "Thursday", breakfast: "Sandwich, Tea", lunch: "Rice, Dal, Chapati, Vegetable", dinner: "Rice, Dal, Chapati, Paneer" },
        { day: "Friday", breakfast: "Paratha, Tea", lunch: "Rice, Dal, Chapati, Vegetable", dinner: "Rice, Dal, Chapati, Vegetable" },
        { day: "Saturday", breakfast: "Poha, Tea", lunch: "Rice, Dal, Chapati, Vegetable", dinner: "Rice, Dal, Chapati, Special Item" },
        { day: "Sunday", breakfast: "Aloo Paratha, Tea", lunch: "Rice, Dal, Chapati, Paneer", dinner: "Rice, Dal, Chapati, Vegetable" }
      ]
    },
    ratings: 4.5,
    reviews: [
      {
        userId: "user1",
        userName: "Rahul Singh",
        rating: 5,
        comment: "Great mess with tasty food and clean rooms. Highly recommended!",
        date: "2023-10-15"
      },
      {
        userId: "user2",
        userName: "Priya Patel",
        rating: 4,
        comment: "Good food, nice location. Rooms are well maintained.",
        date: "2023-09-22"
      }
    ]
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

const MessDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [mess, setMess] = useState<MessDetailsType | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedMess = dummyMesses.find(m => m.id === id);
    if (fetchedMess) {
      setMess(fetchedMess);
    }
  }, [id]);

  if (!mess) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Mess not found</h2>
        <p className="mb-8">The mess you're looking for doesn't exist or has been removed.</p>
        <Link to="/search">
          <Button>Browse Other Messes</Button>
        </Link>
      </div>
    );
  }

  const handleContactOwner = () => {
    toast.success("Request sent to the mess owner. They will contact you soon.");
  };

  const handleBookNow = () => {
    toast.success("Booking request sent. Please wait for confirmation.");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/search" className="text-messsathi-blue hover:underline flex items-center">
          ← Back to search results
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images and details */}
        <div className="lg:col-span-2">
          {/* Main image gallery */}
          <div className="mb-8">
            <div className="relative rounded-lg overflow-hidden h-64 md:h-96 mb-2">
              <img 
                src={mess.photos[activeImageIndex] || "https://placehold.co/600x400/png?text=No+Image"} 
                alt={mess.name} 
                className="w-full h-full object-cover"
              />
              {mess.ratings && (
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full font-medium flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                  <span>{mess.ratings.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {mess.photos.map((photo, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`flex-shrink-0 h-16 w-24 rounded-md overflow-hidden border-2 ${
                    activeImageIndex === idx ? 'border-messsathi-orange' : 'border-transparent'
                  }`}
                >
                  <img src={photo} alt={`${mess.name} ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Mess details tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{mess.name}</h2>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{mess.address}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {mess.amenities.wifi && (
                    <Badge variant="outline" className="flex items-center">
                      <Wifi className="w-3 h-3 mr-1" />
                      WiFi
                    </Badge>
                  )}
                  
                  {mess.amenities.food && (
                    <Badge variant="outline" className="flex items-center">
                      <Utensils className="w-3 h-3 mr-1" />
                      {mess.amenities.foodType === 'veg' ? 'Vegetarian Food' : 
                       mess.amenities.foodType === 'non-veg' ? 'Non-Vegetarian Food' : 
                       'Food Available'}
                    </Badge>
                  )}
                  
                  {mess.rooms.map((room) => (
                    <Badge key={room.type} variant="outline">
                      {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
                    </Badge>
                  ))}
                </div>
                
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{mess.description}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Location</h3>
                <MapView
                  markers={[{ id: mess.id, lat: mess.location.lat, lng: mess.location.lng, title: mess.name }]}
                  center={mess.location}
                  height="300px"
                />
              </div>
            </TabsContent>
            
            {/* Rooms Tab */}
            <TabsContent value="rooms" className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Available Rooms</h3>
              
              {mess.rooms.map((room, idx) => (
                <Card key={idx} className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                        {room.photos && room.photos.length > 0 ? (
                          <img 
                            src={room.photos[0]} 
                            alt={`${room.type} Room`} 
                            className="w-full h-48 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md">
                            <span className="text-gray-400">No image available</span>
                          </div>
                        )}
                        
                        {room.photos && room.photos.length > 1 && (
                          <div className="flex mt-2 space-x-2 overflow-x-auto">
                            {room.photos.slice(1).map((photo, photoIdx) => (
                              <img 
                                key={photoIdx}
                                src={photo} 
                                alt={`${room.type} Room ${photoIdx + 2}`} 
                                className="h-16 w-24 object-cover rounded-md flex-shrink-0"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="md:w-2/3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold">
                            {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
                          </h4>
                          <div className="text-xl font-bold text-messsathi-orange">
                            ₹{room.rent}<span className="text-sm text-gray-500">/month</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <p className="text-gray-600">
                            <span className="font-medium">Availability:</span> {room.count} rooms
                          </p>
                          
                          <p className="text-gray-600">
                            <span className="font-medium">Room Type:</span> {room.type === 'single' ? 'Single occupancy' : 
                                                                 room.type === 'double' ? 'Double sharing' : 
                                                                 'Triple sharing'}
                          </p>
                          
                          <p className="text-gray-600">
                            <span className="font-medium">Includes:</span> Bed, Table, Chair, Cupboard, Fan
                          </p>
                          
                          <div className="pt-2">
                            <Button onClick={handleBookNow} className="bg-messsathi-orange hover:bg-orange-600">
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            {/* Food Tab */}
            <TabsContent value="food" className="space-y-6">
              {mess.amenities.food ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Food Services</h3>
                    <p className="text-gray-700">
                      <span className="font-medium">Type:</span> {mess.amenities.foodType === 'veg' ? 'Vegetarian Only' : 
                                               mess.amenities.foodType === 'non-veg' ? 'Non-Vegetarian Only' : 
                                               'Both Vegetarian and Non-Vegetarian'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Meals per day:</span> {mess.amenities.mealsPerDay || 'Not specified'}
                    </p>
                  </div>
                  
                  {mess.amenities.weeklyMenu && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Weekly Menu</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider border">Day</th>
                              {mess.amenities.mealsPerDay! >= 1 && (
                                <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider border">Breakfast</th>
                              )}
                              {mess.amenities.mealsPerDay! >= 2 && (
                                <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider border">Lunch</th>
                              )}
                              {mess.amenities.mealsPerDay! >= 3 && (
                                <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider border">Dinner</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {mess.amenities.weeklyMenu.map((day, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="py-3 px-4 border font-medium">{day.day}</td>
                                {mess.amenities.mealsPerDay! >= 1 && (
                                  <td className="py-3 px-4 border">{day.breakfast || 'Not specified'}</td>
                                )}
                                {mess.amenities.mealsPerDay! >= 2 && (
                                  <td className="py-3 px-4 border">{day.lunch || 'Not specified'}</td>
                                )}
                                {mess.amenities.mealsPerDay! >= 3 && (
                                  <td className="py-3 px-4 border">{day.dinner || 'Not specified'}</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">This mess does not provide food services.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center mb-6">
                <h3 className="text-xl font-semibold">Reviews</h3>
                {mess.ratings && (
                  <div className="ml-4 flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(mess.ratings!) 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-lg font-medium">{mess.ratings.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              {mess.reviews && mess.reviews.length > 0 ? (
                <div className="space-y-6">
                  {mess.reviews.map((review, idx) => (
                    <div key={idx} className="border-b pb-6 last:border-b-0">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{review.userName}</div>
                        <div className="text-gray-500 text-sm">{review.date}</div>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet for this mess.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right column - Contact and booking */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Mess Owner</h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleContactOwner}
                      className="w-full flex items-center justify-center"
                      variant="outline"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Owner
                    </Button>
                    <Button 
                      onClick={handleContactOwner}
                      className="w-full flex items-center justify-center"
                      variant="outline"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Owner
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Quick Booking</h3>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Interested in this mess? Book now to secure your spot!
                    </p>
                    <Button 
                      onClick={handleBookNow}
                      className="w-full bg-messsathi-orange hover:bg-orange-600"
                    >
                      Book Now
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Your booking will be confirmed after verification by the mess owner.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessDetails;
