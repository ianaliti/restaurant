import React from "react";
import { Input } from "@/components/ui/input";
import CardComponent from "@/components/card/CardComponent";
import data from "@/mock-data/data";
import Link from "next/link";

const page = () => {
  console.log(data);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Restaurants</h1>
      <Input className="rounded-3xl h-12" placeholder="Rechercher un restaurant" />
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((resto) => (
            <Link href={`/restaurants/${resto.id}`} key={resto.id}>
              <CardComponent
                key={resto.id}
                name={resto.name}
                id={resto.id}
                address={resto.address}
                image={resto.image}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
