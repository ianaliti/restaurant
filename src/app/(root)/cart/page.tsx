'use client';

import { useCartStore } from "@/app/store/cartStore";
import CardComponent from "@/components/card/CardComponent";

export default function page() {
  const items = useCartStore(state => state.cartlist.items);

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);
  console.log("Total Price:", totalPrice);

  console.log("Cart Items:", items);

  return (
    <div>
       {
        items.map((item) => (
         <CardComponent name={item.name} key={item.id} id={item.id} image={item.image} description={item.description}
         />
        ))
       }
      <p>Total: ${totalPrice.toFixed(2)}</p>
    </div>
  );
}
