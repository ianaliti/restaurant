import React from "react";
import Image from "next/image";
import { Dish, Restaurant } from "@/types/restaurants.type";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardProps = Restaurant | Dish;

const CardComponent = ({ name, image, address }: CardProps) => {
  return (
    <Card className="relative w-[320px] h-[300px] rounded-2xl overflow-hidden shadow-lg cursor-pointer group">
      <CardHeader>
        <Image
          src={image}
          alt={`${name} Image`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="min-width: 362px) 100vw, 33vw"
        />
      </CardHeader>
      <CardContent className="absolute bottom-0 left-0 p-4 text-white z-10">
        <p className="text-lg font-semibold truncate">{name}</p>
        {address && (
          <span className="text-sm opacity-80 truncate">{address}</span>
        )}
      </CardContent>
    </Card>
    // <div
    //   className="relative w-[320px] h-[300px] rounded-2xl overflow-hidden shadow-lg cursor-pointer group">
    //   <Image
    //     src={image}
    //     alt={`${name} Image`}
    //     fill
    //     className="object-cover transition-transform duration-300 group-hover:scale-105"
    //     sizes="min-width: 362px) 100vw, 33vw"
    //   />

    //   {/* Gradient overlay at bottom */}
    //   <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

    //   {/* Text content */}
    //   <div className="absolute bottom-0 left-0 p-4 text-white z-10">
    //     <h1 className="text-lg font-semibold truncate">{name}</h1>
    //     {address && (
    //       <span className="text-sm opacity-80 truncate">{address}</span>
    //     )}
    //   </div>
    // </div>
  );
};

export default CardComponent;
