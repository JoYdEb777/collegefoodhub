import { Link } from "react-router-dom";
import { MessDetails } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Wifi, Utensils } from "lucide-react";

interface MessCardProps {
  mess: MessDetails;
  distance?: number;
  showDistance?: boolean;
}

const MessCard = ({ mess, distance, showDistance }: MessCardProps) => {
  const mainPhoto = mess.photos && mess.photos.length > 0 ? mess.photos[0] : "https://placehold.co/600x400/png?text=No+Image";
  
  // Find the cheapest room
  const cheapestRoom = mess.rooms.reduce((prev, current) => 
    (prev.rent < current.rent) ? prev : current
  );

  return (
    <Link to={`/mess/${mess.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow mess-card-shadow transition-all duration-300 hover:shadow-lg">
        <div className="aspect-w-16 aspect-h-9 relative">
          <img
            src={mainPhoto}
            alt={mess.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {mess.ratings && (
            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-sm font-medium flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{mess.ratings.toFixed(1)}</span>
            </div>
          )}
          {showDistance && distance && (
            <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-full text-sm font-medium">
              {distance < 1 ? 
                `${(distance * 1000).toFixed(0)}m` : 
                `${distance.toFixed(1)}km`
              } away
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold truncate">{mess.name}</h3>
            <p className="text-messsathi-orange font-bold">
              ₹{cheapestRoom.rent}<span className="text-xs text-gray-500">/mo</span>
            </p>
          </div>
          
          <p className="text-gray-500 text-sm mt-1 truncate">{mess.address}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {mess.amenities.wifi && (
              <div className="flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                <Wifi className="w-3 h-3 mr-1" />
                <span>WiFi</span>
              </div>
            )}
            
            {mess.amenities.food && (
              <div className="flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                <Utensils className="w-3 h-3 mr-1" />
                <span>
                  {mess.amenities.foodType === 'veg' ? 'Veg Food' : 
                   mess.amenities.foodType === 'non-veg' ? 'Non-Veg Food' : 
                   'Food Available'}
                </span>
              </div>
            )}
            
            {mess.rooms.map((room) => (
              <Badge key={room.type} variant="outline" className="text-xs">
                {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MessCard;
