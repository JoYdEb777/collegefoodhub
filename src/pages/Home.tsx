import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessCard from "@/components/MessCard";
import { MessDetails } from "@/types";
import { motion } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    try {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-section text-white py-20 relative overflow-hidden">
        {/* Background Overlay */}
        <div className="hero-overlay"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 opacity-20">
          <svg viewBox="0 0 100 100" fill="white">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              Find Your Perfect College Mess Experience
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-md">
              Discover affordable accommodation with quality meals near your college
            </p>
            
            {/* Search Bar with error handling */}
            <div className="max-w-2xl mx-auto mb-8 relative">
              <div className="flex gap-4 flex-col sm:flex-row backdrop-blur-sm bg-black/20 p-4 rounded-lg">
                <Input
                  type="text"
                  placeholder="Search by location, college name..."
                  className="h-12 bg-white/90 text-black placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/search">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8"
                >
                  Browse Messes
                </Button>
              </Link>
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-white text-orange-500 hover:bg-orange-50 
                             hover:text-orange-600 border-2 border-white hover:border-orange-500 
                             px-8 flex items-center gap-2 relative overflow-hidden group"
                  >
                    <Building2 className="w-5 h-5" />
                    <span>List Your Mess</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-orange-500 filter blur-xl opacity-30 
                                group-hover:opacity-50 transition-opacity -z-10" />
                </motion.div>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
              <div className="backdrop-blur-md bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="font-bold text-3xl">500+</div>
                <div className="text-sm text-gray-200">Listed Messes</div>
              </div>
              <div className="backdrop-blur-md bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="font-bold text-3xl">1000+</div>
                <div className="text-sm text-gray-200">Happy Students</div>
              </div>
              <div className="hidden md:block backdrop-blur-md bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="font-bold text-3xl">50+</div>
                <div className="text-sm text-gray-200">Colleges Covered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave Pattern */}
        <svg className="hero-pattern" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,0 C480,40 960,40 1440,0 L1440,40 L0,40 Z" fill="currentColor"/>
        </svg>
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
      <section className="bg-gradient-to-br from-messsathi-dark to-messsathi-blue/90 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4">Are You a Mess Owner?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
              List your mess on MessSathi and connect with students looking for quality accommodation and food services.
            </p>
            <Link to="/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-messsathi-orange hover:bg-orange-50 
                           border-2 border-white hover:border-orange-500
                           font-semibold px-8 py-6 text-lg flex items-center gap-3
                           shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Building2 className="w-6 h-6" />
                  Register Your Mess
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
