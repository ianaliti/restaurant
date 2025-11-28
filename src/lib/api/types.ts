import type { ApiResponse } from '@/types/utils.type';
import type { RestaurantData } from '@/app/store/restaurantStore';
import type { PlatData } from '@/app/store/platStore';
import type { User } from '@/types/user.type';

export type RestaurantsApiResponse = ApiResponse<RestaurantData[]>;
export type RestaurantApiResponse = ApiResponse<RestaurantData>;
export type PlatsApiResponse = ApiResponse<PlatData[]>;
export type PlatApiResponse = ApiResponse<PlatData>;
export type UserApiResponse = ApiResponse<User>;

