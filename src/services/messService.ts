import { db } from '@/config/firebase';
import { collection, query, onSnapshot, where, orderBy } from 'firebase/firestore';
import { MessDetails } from '@/types';

export const subscribeToMesses = (
  filters: {
    location?: string;
    priceRange?: [number, number];
    roomTypes?: string[];
    amenities?: { wifi?: boolean; food?: boolean };
    foodType?: string;
  },
  callback: (messes: MessDetails[]) => void
) => {
  let q = query(collection(db, 'messes'));

  // Apply filters
  if (filters.location && filters.location !== 'all') {
    q = query(q, where('address', '>=', filters.location));
  }

  if (filters.roomTypes && filters.roomTypes.length > 0) {
    q = query(q, where('roomTypes', 'array-contains-any', filters.roomTypes));
  }

  if (filters.amenities?.wifi) {
    q = query(q, where('amenities.wifi', '==', true));
  }

  if (filters.amenities?.food) {
    q = query(q, where('amenities.food', '==', true));
  }

  if (filters.foodType && filters.foodType !== 'any') {
    q = query(q, where('amenities.foodType', '==', filters.foodType));
  }

  // Order by creation date
  q = query(q, orderBy('createdAt', 'desc'));

  // Subscribe to realtime updates
  return onSnapshot(q, (snapshot) => {
    const messes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MessDetails[];

    // Apply price range filter client-side
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      const filteredMesses = messes.filter(mess => {
        const cheapestRoom = mess.rooms.reduce((prev, curr) => 
          prev.rent < curr.rent ? prev : curr
        );
        return cheapestRoom.rent >= min && cheapestRoom.rent <= max;
      });
      callback(filteredMesses);
    } else {
      callback(messes);
    }
  });
};
