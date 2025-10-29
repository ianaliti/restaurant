import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

interface CardProps {
  id?: number;
  name: string;
  image: string;
  address?: string;
  description?: string;
}

const CardComponent = ({ name, image, address }: CardProps) => {
  return (
    <Card className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden shadow-md cursor-pointer group p-0 border-0">
      <CardHeader className="p-0 h-full">
        <Image
          src={image}
          alt={`${name} Image`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="min-width: 362px) 100vw, 33vw"
        />
      </CardHeader>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
      <CardContent className="absolute bottom-0 left-0 p-4 text-white z-10">
        <p className="text-lg font-semibold truncate">{name}</p>
        {address && (
          <span className="text-sm opacity-80 truncate">{address}</span>
        )}
      </CardContent>
    </Card>
  );
};

export default CardComponent;
