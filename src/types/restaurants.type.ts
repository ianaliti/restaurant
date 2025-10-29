export interface Restaurant {
  id: number;
  name: string;
  address?: string;
  image: string;
  description?: string;
  phone?: string;
  website?: string;
  cuisine?: string;
  rating?: number; 
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

export interface DishExtended extends Dish {
  category?: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
}

export interface RestaurantWithDishes extends Restaurant {
  dishes: DishExtended[];
}

export interface Profile {
  id: number;
  username: string;
  email: string;
}

export interface Command {
  id: string;
  date: string;
  total: number;
}