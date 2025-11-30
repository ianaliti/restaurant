'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useRestaurantStore } from "@/app/store/restaurantStore";
import { LazyMessage as Message } from "@/components/ui/LazyComponents";
import { useDictionary } from "@/components/i18n/DictionaryProvider";

export default function RestaurantPage() {
  const { user } = useAuthStore();
  const dict = useDictionary();
  const getRestaurantByUserId = useRestaurantStore(state => state.getRestaurantByUserId);
  const createRestaurant = useRestaurantStore(state => state.createRestaurant);
  const existingRestaurant = user?.id ? getRestaurantByUserId(user.id) : null;
  const [formData, setFormData] = useState(() => ({
    name: existingRestaurant?.name || '',
    address: existingRestaurant?.address || '',
    codePostal: existingRestaurant?.codePostal || '',
    city: existingRestaurant?.city || '',
    image: existingRestaurant?.image || '',
  }));
  const [showSuccess, setShowSuccess] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!user?.id) {
      setError(dict.messages.error);
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
          <h1 className="text-2xl font-semibold">{dict.restaurateur.restaurant}</h1>
        </div>
        
        <p className="text-muted-foreground mb-4">
          {dict.profile.welcome.replace('{{name}}', user?.name || '')}
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
          
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md" aria-label={dict.restaurateur.restaurant}>
          <div>
            <label htmlFor='resto-name' className="text-sm font-medium mb-1 block">{dict.restaurateur.restaurantName}</label>
            <Input
              id='resto-name'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={dict.restaurateur.restaurantName}
              required
              aria-label={dict.restaurateur.restaurantName}
              aria-invalid={!!error}
            />
          </div>
          
          <div>
            <label htmlFor='resto-address' className="text-sm font-medium mb-1 block">{dict.restaurateur.address}</label>
            <Input
              id='resto-address'
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={dict.restaurateur.address}
              aria-label={dict.restaurateur.address}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="resto-codePostal" className="text-sm font-medium mb-1 block">{dict.restaurateur.postalCode}</label>
              <Input
                id="resto-codePostal"
                value={formData.codePostal}
                onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                placeholder={dict.restaurateur.postalCode}
                aria-label={dict.restaurateur.postalCode}
              />
            </div>
            
            <div>
              <label htmlFor="resto-city" className="text-sm font-medium mb-1 block">{dict.restaurateur.city}</label>
              <Input
                id="resto-city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder={dict.restaurateur.city}
                aria-label={dict.restaurateur.city}
              />
            </div>
          </div>

          <div>
            <label htmlFor="resto-image" className="text-sm font-medium mb-1 block">{dict.restaurateur.imageUrl}</label>
            <Input
              id="resto-image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              aria-label={dict.restaurateur.imageUrl}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={dict.restaurateur.update}
          >
            {dict.restaurateur.update}
          </Button>
        </form>
      </div>
        
        {showSuccess && (
          <Message
            type="success"
            message={dict.restaurateur.updateSuccess}
            onClose={() => setShowSuccess(false)}
          />
        )}
    
    </ProtectedRoute>
  );
}


