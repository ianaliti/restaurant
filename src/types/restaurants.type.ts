export interface Restaurant {
    id: number;
    name: string;
    address?: string;
    image: string;
}

export interface Dish {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
}

export interface Profile {
    id: number;
    username: string;
    email: string;
}

export interface Command {
    id: number;
    dishId: number;
    quantity: number;
    title: string;
    price: number;
}