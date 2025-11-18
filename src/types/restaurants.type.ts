export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isSpicy: boolean;
  isVegetarian: boolean;
  ingredients: string[];
  allergies: string[];
  calories: number;
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

export interface RestaurantWithDishes extends Restaurant {
  dishes: Dish[];
}

export interface Profile {
  id: number;
  username: string;
  email: string;
}

export interface CartItem extends Dish {
  quantity: number;
  restaurantId: number;
}

export interface Order {
  id: number;
  date: string;
  total: number;
  items: CartItem[];
}