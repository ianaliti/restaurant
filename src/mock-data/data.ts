import { RestaurantWithPlats } from "@/types/restaurants.type";

const data: RestaurantWithPlats[] = [
	{
		id: 1,
		name: "La Maison Italienne",
		description:
			"Authentic Italian cuisine in an elegant atmosphere with traditional recipes passed down through generations.",
		address: "123 Pasta Avenue, Little Italy, NY 10013",
		phone: "+1 212-555-0123",
		website: "https://lamaisonitalienne.com",
		image:
			"https://plus.unsplash.com/premium_photo-1672242676660-923c3bd446d7",
		cuisine: "Italian",
		rating: 4.8,
		priceRange: "₪₪₪",
		openingHours: "11:00 AM - 10:00 PM",
		deliveryTime: "30-45 min",
		minimumOrder: 20,
		deliveryFee: 5,
		isDeliveryAvailable: true,
		isParkingAvailable: true,
		isReservationRequired: true,
		plats: [
			{
				id: 101,
				name: "Truffle Pasta",
				price: 28.0,
				image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856",
			},
			{
				id: 102,
				name: "Osso Buco",
				price: 34.0,
				image: "https://images.unsplash.com/photo-1547424850-26228a17e42b",
			},
		],
	},
	{
		id: 2,
		name: "Sushi Master",
		description:
			"Contemporary Japanese cuisine featuring the freshest seafood and innovative fusion rolls.",
		address: "456 Ocean Drive, Miami Beach, FL 33139",
		phone: "+1 305-555-0456",
		website: "https://sushimaster.com",
		image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351",
		cuisine: "Japanese",
		rating: 4.9,
		priceRange: "₪₪₪₪",
		openingHours: "12:00 PM - 11:00 PM",
		deliveryTime: "25-40 min",
		minimumOrder: 25,
		deliveryFee: 4,
		isDeliveryAvailable: true,
		isParkingAvailable: false,
		isReservationRequired: false,
		plats: [
			{
				id: 201,
				name: "Dragon Roll",
				price: 22.0,
				image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56",
			},
			{
				id: 202,
				name: "Wagyu Nigiri",
				price: 18.0,
				image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
			},
		],
	},
	{
		id: 3,
		name: "Spice Route",
		description:
			"A journey through Indian flavors featuring traditional plats with a modern twist.",
		address: "789 Curry Lane, San Francisco, CA 94110",
		phone: "+1 415-555-0789",
		website: "https://spiceroute.com",
		image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
		cuisine: "Indian",
		rating: 4.7,
		priceRange: "₪₪",
		openingHours: "11:30 AM - 10:30 PM",
		deliveryTime: "35-50 min",
		minimumOrder: 15,
		deliveryFee: 3,
		isDeliveryAvailable: true,
		isParkingAvailable: true,
		isReservationRequired: false,
		plats: [
			{
				id: 301,
				name: "Butter Chicken",
				price: 24.0,
				image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
			},
			{
				id: 302,
				name: "Palak Paneer",
				price: 20.0,
				image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
			},
		],
	},
];

export default data;


