export interface Plat {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  image: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  openingHours: string;
  deliveryTime: string;
  minimumOrder: number;
  deliveryFee: number;
  isDeliveryAvailable: boolean;
  isParkingAvailable: boolean;
  isReservationRequired: boolean;
}

export interface RestaurantWithPlats extends Restaurant {
  plats: Plat[];
  quantity?: number;
}

export interface Profile {
  id: number;
  username: string;
  email: string;
}

export interface CartItem extends Plat {
  quantity: number;
  restaurantId: number;
}

export interface Order {
  id: number;
  date: string;
  total: number;
  items: CartItem[];
}