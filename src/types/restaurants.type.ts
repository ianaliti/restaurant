export interface Plat {
  id: string;
  name: string;
  price: number;
  image: string | null;
  description: string | null;
  category: string;
  isAvailable: boolean;
}

/** Extended Plat shape — userId equals restaurantId */
export interface PlatData extends Plat {
  userId: string;
}

export interface RestaurantData {
  id: string;
  /** Equals the restaurant's DB id (same entity in the backend) */
  userId: string;
  name: string;
  address: string;
  codePostal: string;
  city: string;
  email: string;
  image: string | null;
  description: string | null;
  phone: string;
  website: string | null;
  cuisine: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
}

export interface CartItem extends Plat {
  quantity: number;
  restaurantId: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  date: string;
  total: number;
  status?: string;
  deliveryAddress: string;
  items: CartItem[];
}
