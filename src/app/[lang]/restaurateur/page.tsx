'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMyRestaurant } from "@/hooks/useRestaurant";
import { LazyMessage as Message } from "@/components/ui/LazyComponents";
import { useDictionary } from "@/components/i18n/DictionaryProvider";

export default function RestaurantPage() {
  const { user } = useAuth();
  const dict = useDictionary();
  const { restaurant, update } = useMyRestaurant();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    codePostal: '',
    city: '',
    image: '',
    description: '',
    phone: '',
    website: '',
    cuisine: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        address: restaurant.address || '',
        codePostal: restaurant.codePostal || '',
        city: restaurant.city || '',
        image: restaurant.image || '',
        description: restaurant.description || '',
        phone: restaurant.phone || '',
        website: restaurant.website || '',
        cuisine: restaurant.cuisine || '',
      });
    }
  }, [restaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await update({
        name: formData.name,
        address: formData.address,
        codePostal: formData.codePostal,
        city: formData.city,
        image: formData.image || undefined,
        description: formData.description || undefined,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        cuisine: formData.cuisine || undefined,
      });
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.messages.error);
    }
  };

  const field = (id: string, label: string, value: string, key: keyof typeof formData, type = 'text') => (
    <div>
      <label htmlFor={id} className="text-sm font-medium mb-1 block">{label}</label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
      />
    </div>
  );

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
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm" role='alert' aria-live='assertive'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md" aria-label={dict.restaurateur.restaurant}>
          {field('resto-name', dict.restaurateur.restaurantName, formData.name, 'name')}

          <div>
            <label htmlFor="resto-description" className="text-sm font-medium mb-1 block">{dict.restaurateur.description}</label>
            <textarea
              id="resto-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}

              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {field('resto-cuisine', dict.restaurateur.cuisine, formData.cuisine, 'cuisine')}
          {field('resto-phone', dict.restaurateur.phone, formData.phone, 'phone', 'tel')}
          {field('resto-website', dict.restaurateur.website, formData.website, 'website', 'url')}

          {field('resto-address', dict.restaurateur.address, formData.address, 'address')}
          <div className="grid grid-cols-2 gap-4">
            {field('resto-codePostal', dict.restaurateur.postalCode, formData.codePostal, 'codePostal')}
            {field('resto-city', dict.restaurateur.city, formData.city, 'city')}
          </div>
          {field('resto-image', dict.restaurateur.imageUrl, formData.image, 'image', 'url')}

          <Button type="submit" className="w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label={dict.restaurateur.update}>
            {dict.restaurateur.update}
          </Button>
        </form>
      </div>

      {showSuccess && (
        <Message type="success" message={dict.restaurateur.updateSuccess} onClose={() => setShowSuccess(false)} />
      )}
    </ProtectedRoute>
  );
}
