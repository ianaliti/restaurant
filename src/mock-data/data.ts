import type { RestaurantData } from '@/app/store/restaurantStore';
import type { PlatData } from '@/app/store/platStore';

export const mockRestaurants: RestaurantData[] = [
	{
		id: 1,
		userId: 'mock-resto-1',
		name: 'La Maison Italienne',
		address: '123 Pasta Avenue',
		codePostal: 'NY',
		city: '10013 Little Italy',
		email: 'lamaisonitalienne@restodigital.com',
		image: 'https://plus.unsplash.com/premium_photo-1672242676660-923c3bd446d7',
	},
	{
		id: 2,
		userId: 'mock-resto-2',
		name: 'Sushi Master',
		address: '456 Ocean Drive',
		codePostal: 'FL',
		city: '33139 Miami Beach',
		email: 'sushimaster@restodigital.com',
		image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
	},
	{
		id: 3,
		userId: 'mock-resto-3',
		name: 'Spice Route',
		address: '789 Curry Lane',
		codePostal: 'CA',
		city: '94110 San Francisco',
		email: 'spiceroute@restodigital.com',
		image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
	},
];

export const mockPlats: PlatData[] = [
	{
		id: '101',
		userId: 'mock-resto-1',
		name: 'Truffle Pasta',
		price: 28.0,
		image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856',
	},
	{
		id: '102',
		userId: 'mock-resto-1',
		name: 'Osso Buco',
		price: 34.0,
		image: 'https://plus.unsplash.com/premium_photo-1673581152308-591c1645be02?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
	{
		id: '201',
		userId: 'mock-resto-2',
		name: 'Dragon Roll',
		price: 22.0,
		image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56',
	},
	{
		id: '202',
		userId: 'mock-resto-2',
		name: 'Wagyu Nigiri',
		price: 18.0,
		image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
	},
	{
		id: '301',
		userId: 'mock-resto-3',
		name: 'Butter Chicken',
		price: 24.0,
		image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
	},
	{
		id: '302',
		userId: 'mock-resto-3',
		name: 'Palak Paneer',
		price: 20.0,
		image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
	},
];

const data = { restaurants: mockRestaurants, plats: mockPlats };

export default data;


