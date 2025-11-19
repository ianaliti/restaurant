'use client';

import { useCartStore } from "@/app/store/cartStore";
import { useOrderStore } from "@/app/store/orderStore";
import { useAuthStore } from "@/app/store/authStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useMemo, useEffect, useRef } from "react";
import { Message } from "@/components/ui/Message";
import type { CartItem } from "@/types/restaurants.type";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function page() {
  const { user } = useAuthStore();
  const isCustomer = user?.role === 'customer';
  const router = useRouter();
  
  const userId = user?.id || 'guest';
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);
  
  const currentUserCart = useCartStore((state) => {
    const currentUserId = userIdRef.current;
    return state.userCarts[currentUserId] || null;
  });
  
  const items: CartItem[] = useMemo(() => {
    return currentUserCart ? [...currentUserCart] : [];
  }, [currentUserCart]);
  
  useEffect(() => {
    if (user?.id) {
      const guestCart = useCartStore.getState().userCarts['guest'];
      if (guestCart && guestCart.length > 0) {
        const userCart = useCartStore.getState().userCarts[user.id] || [];
        const mergedCart = [...userCart];
        guestCart.forEach(guestItem => {
          const existing = mergedCart.find(item => item.id === guestItem.id);
          if (existing) {
            existing.quantity += guestItem.quantity;
          } else {
            mergedCart.push(guestItem);
          }
        });
        useCartStore.setState((state) => ({
          userCarts: {
            ...state.userCarts,
            [user.id]: mergedCart,
            guest: [], 
          },
        }));
      }
    }
  }, [user?.id]);
  
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const clearCart = useCartStore(state => state.clearCart);
  const getTotalPrice = useCartStore(state => state.getTotalPrice);
  const createOrder = useCartStore(state => state.createOrder);
  const addOrder = useOrderStore((state) => state.addOrder);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [warningMessage, setWarningMessage] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    useCartStore.getState().setCurrentUser(userId);
  }, [userId]);
  
  const totalPrice = useMemo(() => {
    if (!mounted) return 0;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [mounted, items]);

  const addPlat = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateQuantity(id, (item.quantity || 1) + 1, userId);
    }
  };

  const deletePlat = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateQuantity(id, Math.max(0, (item.quantity || 1) - 1), userId);
    }
  };

  const handleCreateOrder = () => {
    if (!user?.id || !isCustomer) {
      setWarningMessage(true);
      return;
    }
    
    const newOrder = createOrder(user.id);
    addOrder(newOrder);  
    setShowSuccess(true);
  }

  const handleClearCart = () => {
    clearCart(userId);
  }

  console.log("Cart Items:", items);

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Button variant="secondary" onClick={() => router.back()} aria-label="Retour à la page précédente"><ArrowLeft /></Button>
      <h1 className="text-2xl font-bold mb-6">Panier</h1>
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Votre panier est vide.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item, idx) => (
          <Card key={`${item.id}-${idx}`} className="p-4">
            <CardContent className="p-0 grid grid-cols-[96px_1fr_auto] items-center gap-4">
              <div className="relative w-24 h-24 overflow-hidden rounded-lg">
                <Image 
                  src={item.image} 
                  alt={`Image de ${item.name}`} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <div className="mt-2 inline-flex items-center gap-2" role="group" aria-label={`Actions pour ${item.name}`}>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => deletePlat(item.id)}
                    aria-label={`Diminuer la quantité de ${item.name}`}
                  >
                    -
                  </Button>
                  <span className="text-sm font-medium w-6 text-center" aria-label={`Quantité: ${item.quantity}`}>
                    {item.quantity}
                  </span>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => addPlat(item.id)}
                    aria-label={`Augmenter la quantité de ${item.name}`}
                  >
                    +
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600" 
                    onClick={() => removeItem(item.id, userId)}
                    aria-label={`Retirer ${item.name} du panier`}
                  >
                    Retirer
                  </Button>
                </div>
              </div>
              <div className="text-right font-semibold">{`$${(item.price * item.quantity).toFixed(2)}`}</div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {items.length > 0 && (
      <div className="mt-8 flex items-center justify-between">
        <p className="text-lg font-semibold">Total: {`$${totalPrice.toFixed(2)}`}</p>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            className="h-12 rounded-3xl px-6" 
            onClick={handleClearCart}
            aria-label="Vider le panier"
          >
            Vider
          </Button>
          <Button 
            className="h-12 rounded-3xl px-8" 
            onClick={handleCreateOrder}
            aria-label="Créer la commande"
          >
            Payer
          </Button>
        </div>
      </div>
      
      )}

      {showSuccess && (
        <Message
          type="success"
          message="Commande créée avec succès!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      {warningMessage && (
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="warning-title"
          aria-describedby="warning-description"
        >
          <div className="bg-white rounded p-6 max-w-md w-11/12 shadow-2xl">
            <h3 id="warning-title" className="text-xl font-bold mb-3">Attention</h3>
            <p id="warning-description" className="mb-5">
              Vous devez être connecté en tant que client pour créer une commande. Veuillez vous connecter pour continuer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setWarningMessage(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Annuler"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setWarningMessage(false);
                  router.push('/login');
                }}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Aller à la page de connexion"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
