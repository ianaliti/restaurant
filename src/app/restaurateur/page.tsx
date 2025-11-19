'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useRestaurantStore } from "@/app/store/restaurantStore";
import { SuccessMessage } from "@/components/ui/SuccessMessage";

export default function RestaurantPage() {
  const { user } = useAuthStore();
  const getRestaurantByUserId = useRestaurantStore(state => state.getRestaurantByUserId);
  const createRestaurant = useRestaurantStore(state => state.createRestaurant);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    codePostal: '',
    city: '',
    image: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const restaurant = getRestaurantByUserId(user.id);
      if (restaurant) {
        setFormData({
          name: restaurant.name || '',
          address: restaurant.address || '',
          codePostal: restaurant.codePostal || '',
          city: restaurant.city || '',
          image: restaurant.image || '',
        });
      }
    }
  }, [user?.id, getRestaurantByUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert('Utilisateur non connecté');
      return;
    }

    try {
      const restaurantData = {
        userId: user.id,
        name: formData.name,
        address: formData.address,
        codePostal: formData.codePostal,
        city: formData.city,
        email: user.email,
        image: formData.image || '/default-restaurant.jpg',
      };
      
      createRestaurant(restaurantData);
      
      setShowSuccess(true);
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  return (
    <ProtectedRoute requiredRole={['restaurateur', 'admin']}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Mon Restaurant</h1>
        </div>
        

          <p className="text-muted-foreground mb-4">
            Bienvenue, {user?.name}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="text-sm font-medium mb-1 block">Nom du restaurant</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du restaurant"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Adresse</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Adresse"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Code Postal</label>
                <Input
                  value={formData.codePostal}
                  onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                  placeholder="Code Postal"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Ville</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ville"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">URL de l'image</label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <Button type="submit" className="w-full">
              Modifier
            </Button>
          </form>
        </div>
        
        {showSuccess && (
          <SuccessMessage
            message="Restaurant mis à jour avec succès!"
            onClose={() => setShowSuccess(false)}
          />
        )}
    
    </ProtectedRoute>
  );
}


