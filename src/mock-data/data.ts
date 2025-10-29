import { RestaurantWithDishes } from "@/types/restaurants.type";

const data: RestaurantWithDishes[] = [
  {
    id: 1,
    name: "La Maison Italienne",
    description:
      "Authentic Italian cuisine in an elegant atmosphere with traditional recipes passed down through generations.",
    address: "123 Pasta Avenue, Little Italy, NY 10013",
    city: "",
    image:
      "https://plus.unsplash.com/premium_photo-1672242676660-923c3bd446d7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    cuisine: "Italian",
    codePostal: 56000,
    email: "",
    dishes: [
      {
        id: 101,
        name: "Truffle Pasta",
        description:
          "Fresh handmade fettuccine with black truffle shavings and parmesan cream sauce",
        price: 28.0,
        image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856",
        category: "Main Course",
        isSpicy: false,
        isVegetarian: true,
      },
      {
        id: 102,
        name: "Osso Buco",
        description: "Braised veal shanks with gremolata and saffron risotto",
        price: 34.0,
        image:
          "https://images.unsplash.com/photo-1602253057119-44d745d9b860?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1452",
        category: "Main Course",
        isSpicy: false,
        isVegetarian: false,
      },
      {
        id: 103,
        name: "Truffle Pasta",
        description:
          "Fresh handmade fettuccine with black truffle shavings and parmesan cream sauce",
        price: 22.0,
        image:
          "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
        category: "Main Course",
        isSpicy: false,
        isVegetarian: true,
      },
      {
        id: 104,
        name: "Osso Buco",
        description: "Braised veal shanks with gremolata and saffron risotto",
        price: 31.0,
        image:
          "https://images.unsplash.com/photo-1598532213919-078e54dd1f40?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
        category: "Main Course",
        isSpicy: false,
        isVegetarian: false,
      },
    ],
  },
  {
    id: 2,
    name: "Sushi Master",
    description:
      "Contemporary Japanese cuisine featuring the freshest seafood and innovative fusion rolls.",
    address: "456 Ocean Drive, Miami Beach, FL 33139",
    image:
      "https://images.unsplash.com/photo-1669283723966-3437546829cc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765",
    cuisine: "Japanese",
    city: "",
    codePostal: 56000,
    email: "",
    dishes: [
      {
        id: 201,
        name: "Dragon Roll",
        description: "Eel and cucumber inside, avocado and tobiko on top",
        price: 22.0,
        image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56",
        category: "Rolls",
        isSpicy: false,
        isVegetarian: false,
      },
      {
        id: 202,
        name: "Wagyu Nigiri",
        description: "Seared A5 wagyu beef on sushi rice with truffle oil",
        price: 18.0,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
        category: "Nigiri",
        isSpicy: false,
        isVegetarian: false,
      },
      {
        id: 203,
        name: "Dragon Roll",
        description: "Eel and cucumber inside, avocado and tobiko on top",
        price: 20.0,
        image:
          "https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
        category: "Rolls",
        isSpicy: false,
        isVegetarian: false,
      },
      {
        id: 204,
        name: "Wagyu Nigiri",
        description: "Seared A5 wagyu beef on sushi rice with truffle oil",
        price: 30.0,
        image:
          "https://plus.unsplash.com/premium_photo-1673590981774-d9f534e0c617?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
        category: "Nigiri",
        isSpicy: false,
        isVegetarian: false,
      },
    ],
  },
  {
    id: 3,
    name: "Spice Route",
    description:
      "A journey through Indian flavors featuring traditional dishes with a modern twist.",
    address: "789 Curry Lane, San Francisco, CA 94110",
    image:
      "https://images.unsplash.com/photo-1554980291-c3e7cea75872?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=698",
    cuisine: "Indian",
    city: "",
    codePostal: 56000,
    email: "",
    dishes: [
      {
        id: 301,
        name: "Butter Chicken",
        description:
          "Tender chicken in a rich tomato and butter sauce with aromatic spices",
        price: 24.0,
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
        category: "Main Course",
        isSpicy: true,
        isVegetarian: false,
      },
      {
        id: 302,
        name: "Palak Paneer",
        description: "Fresh spinach curry with homemade cottage cheese cubes",
        price: 20.0,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        category: "Vegetarian",
        isSpicy: true,
        isVegetarian: true,
      },
      {
        id: 303,
        name: "Butter Chicken",
        description:
          "Tender chicken in a rich tomato and butter sauce with aromatic spices",
        price: 27.0,
        image:
          "https://images.unsplash.com/photo-1571805341302-f857308690e3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1964",
        category: "Main Course",
        isSpicy: true,
        isVegetarian: false,
      },
      {
        id: 304,
        name: "Palak Paneer",
        description: "Fresh spinach curry with homemade cottage cheese cubes",
        price: 23.0,
        image:
          "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1160",
        category: "Vegetarian",
        isSpicy: true,
        isVegetarian: true,
      },
    ],
  },
];

export default data;


