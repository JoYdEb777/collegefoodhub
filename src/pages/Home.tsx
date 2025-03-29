
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MessCard from "@/components/MessCard";
import { MessDetails } from "@/types";

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
  }
];

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 md:py-24">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Find Your Perfect College Mess
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Connect with mess owners, explore housing options with meal plans, and find your ideal accommodation during your college years.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <Link to="/search">
                <Button size="lg" className="w-full sm:w-auto bg-white text-messsathi-orange hover:bg-gray-100">
                  Find a Mess
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  List Your Mess
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://placehold.co/600x400/white/white?text=Mess+Image" 
              alt="College Mess" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How MessSathi Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-messsathi-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">Browse through various mess options in your college area with detailed information.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-messsathi-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">Connect directly with mess owners to discuss availability and requirements.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-messsathi-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Move In</h3>
              <p className="text-gray-600">Finalize your booking and move in to your new home away from home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Messes */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Messes</h2>
            <Link to="/search" className="text-messsathi-blue hover:underline">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyMesses.map((mess) => (
              <MessCard key={mess.id} mess={mess} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-messsathi-dark text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Mess Owner?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            List your mess on MessSathi and connect with students looking for quality accommodation and food services.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-messsathi-orange hover:bg-orange-600">
              Register Your Mess
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
