'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useRestaurantStore } from "@/app/store/restaurantStore";
import { Message } from "@/components/ui/Message";

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

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user?.id) {
      setError('Utilisateur non connecté');
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

        {error && (
          <div 
            className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
            role='alert'
            aria-live='assertive'
          >
            {error}
          </div>
        )}
          
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md" aria-label="Formulaire de modification du restaurant">
          <div>
            <label htmlFor='resto-name' className="text-sm font-medium mb-1 block">Nom du restaurant</label>
            <Input
              id='resto-name'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom du restaurant"
              required
              aria-label='Nom du restaurant'
              aria-invalid={!!error}
            />
          </div>
          
          <div>
            <label htmlFor='resto-address' className="text-sm font-medium mb-1 block">Adresse</label>
            <Input
              id='resto-address'
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Adresse"
              aria-label="Adresse"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="resto-codePostal" className="text-sm font-medium mb-1 block">Code Postal</label>
              <Input
                id="resto-codePostal"
                value={formData.codePostal}
                onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                placeholder="Code Postal"
                aria-label="Code postal"
              />
            </div>
            
            <div>
              <label htmlFor="resto-city" className="text-sm font-medium mb-1 block">Ville</label>
              <Input
                id="resto-city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ville"
                aria-label="Ville"
              />
            </div>
          </div>

          <div>
            <label htmlFor="resto-image" className="text-sm font-medium mb-1 block">URL de l'image</label>
            <Input
              id="resto-image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              aria-label="URL de l'image du restaurant"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Modifier les informations du restaurant"
          >
            Modifier
          </Button>
        </form>
      </div>
        
        {showSuccess && (
          <Message
            type="success"
            message="Restaurant mis à jour avec succès!"
            onClose={() => setShowSuccess(false)}
          />
        )}
    
    </ProtectedRoute>
  );
}


