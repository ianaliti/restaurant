import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Input } from "@/components/ui/input";
import Card from "@/components/card/Card";
import data from "@/mock-data/data";
import Link from "next/link";

const page = () => {
  //   const { data: session } = useSession();
  console.log(data);

  return (
    <div className="flex flex-col p-8 gap-4 w-screen">
      <h1 className="font-extrabold size-7">Restaurantes</h1>
      <Input className="rounded-4xl h-12" />
      <div  className="flex justify-between items-center w-full flex-direction-col">
        <div className="flex flex-wrap justify-center space-x-4 gap-4">
          {data.map((resto) => (
            <Link href={`/restaurants/${resto.id}`} key={resto.id}>
              <Card
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
