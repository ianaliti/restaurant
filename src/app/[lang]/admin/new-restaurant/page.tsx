'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRestaurantStore } from "@/app/store/restaurantStore";
import { createUserWithoutLogin } from "@/app/store/userStore";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LazyMessage as Message } from "@/components/ui/LazyComponents";
import { useDictionary } from "@/components/i18n/DictionaryProvider";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const dict = useDictionary();
  const createRestaurant = useRestaurantStore(state => state.createRestaurant);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    codePostal: '',
    city: '',
    email: '',
    password: '',
    image: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setValidationError(dict.auth.register.fillAllFields);
      return;
    }

    try {
      const newUser = createUserWithoutLogin(
        formData.email,
        formData.password,
        formData.name,
        'restaurateur'
      );
      
      const restaurantData = {
        userId: newUser.id,
        name: formData.name,
        address: formData.address,
        codePostal: formData.codePostal,
        city: formData.city,
        email: formData.email,
        image: formData.image || '/default-restaurant.jpg',
      };
      
      createRestaurant(restaurantData);
      
      setFormData({
        name: '',
        address: '',
        codePostal: '',
        city: '',
        email: '',
        password: '',
        image: ''
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating restaurateur:', error);;
    }
  };


  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <h1 className="text-lg font-semibold">{dict.admin.addRestaurateur}</h1>
        {validationError && (
          <div 
            className='mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm'
            role='alert'
            aria-live='assertive'
          >
            {validationError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3 max-w-sm" aria-label={dict.admin.addRestaurateur}>
          <div>
            <label htmlFor='restaurant-name' className='sr-only'>{dict.profile.name}</label>
            <Input
              id='restaurant-name'
              placeholder={dict.profile.name}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              aria-label={dict.profile.name}
              aria-invalid={!!validationError}
            />
          </div>
          <div>
            <label htmlFor='restaurant-address' className='sr-only'>{dict.restaurants.address}</label>
            <Input
              id='restaurant-address'
              placeholder={dict.restaurants.address}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              aria-label={dict.restaurants.address}
            />
          </div>
          <div>
            <label htmlFor='restaurant-codePostal' className='sr-only'>{dict.restaurateur.postalCode}</label>
            <Input
              id='restaurant-codePostal'
              placeholder={dict.restaurateur.postalCode}
              value={formData.codePostal}
              onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
              aria-label={dict.restaurateur.postalCode}
            />
          </div>
          <div>
            <label htmlFor='restaurant-city' className='sr-only'>{dict.restaurateur.city}</label>
            <Input
              id='restaurant-city'
              placeholder={dict.restaurateur.city}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              aria-label={dict.restaurateur.city}
            />
          </div>
          <div>
            <label htmlFor='restaurant-email' className='sr-only'>{dict.profile.email}</label>
            <Input
              id="restaurant-email"
              type="email"
              placeholder={dict.profile.email}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              aria-label={dict.profile.email}
              aria-invalid={!!validationError}
            />
          </div>
          <div>
            <label htmlFor='restaurant-image' className='sr-only'>{dict.restaurateur.imageUrl}</label>
            <Input
              id='restaurant-image'
              type="text"
              placeholder={dict.restaurateur.imageUrl}
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              aria-label={dict.restaurateur.imageUrl}
            />
          </div>
          <div>
            <label htmlFor="restaurant-password" className="sr-only">{dict.auth.login.password}</label>
            <Input
              id='restaurant-password'
              type="password"
              placeholder={dict.auth.login.password}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              aria-label={`${dict.auth.login.password} (${dict.validation.minLength.replace('{{min}}', '6')})`}
              aria-invalid={!!validationError}
            />
          </div>
          <Button 
            type="submit" 
            className='h-9 rounded-md bg-primary px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            aria-label={dict.admin.addRestaurateur}
          >
            {dict.common.add}
          </Button>
          {showSuccess && (
            <Message
              type="success"
              message={dict.admin.addSuccess}
              onClose={() => {
                setShowSuccess(false);
                router.push(`/${lang}/admin`);
              }}
            />
          )}
        </form>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/${lang}/admin`)}
            className="h-9 rounded-md px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`${dict.common.back} ${dict.admin.title}`}
          >
            {dict.common.back} {dict.admin.title}
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}


