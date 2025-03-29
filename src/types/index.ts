
export type UserRole = 'tenant' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  aadharVerified: boolean;
  isMinor?: boolean;
  parentDetails?: {
    name: string;
    phone: string;
    email?: string;
  };
}

export interface MessDetails {
  id: string;
  name: string;
  ownerId: string;
  description: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  photos: string[];
  rooms: {
    type: 'single' | 'double' | 'triple';
    count: number;
    rent: number;
    photos: string[];
  }[];
  amenities: {
    wifi: boolean;
    food: boolean;
    foodType?: 'veg' | 'non-veg' | 'both';
    mealsPerDay?: number;
    weeklyMenu?: {
      day: string;
      breakfast?: string;
      lunch?: string;
      dinner?: string;
    }[];
  };
  ratings?: number;
  reviews?: {
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}
