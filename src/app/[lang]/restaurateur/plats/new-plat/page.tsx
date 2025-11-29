'use client';

import { useState } from 'react';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/store/authStore";
import { usePlatStore } from "@/app/store/platStore";
import { useRouter, usePathname } from "next/navigation";
import { LazyMessage as Message } from "@/components/ui/LazyComponents";
import { useDictionary } from "@/components/i18n/DictionaryProvider";

export default function NewPlatPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const dict = useDictionary();
  const createPlat = usePlatStore(state => state.createPlat);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (!formData.name || !formData.price || !user?.id) {
      setValidationError(dict.auth.register.fillAllFields);
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setValidationError(dict.validation.required);
      return;
    }

    try {
      createPlat({
        userId: user.id,
        name: formData.name,
        price: price,
        image: formData.image || '/placeholder-plat.jpg',
      });
      
      setFormData({
        name: '',
        price: '',
        image: '',
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Erreur lors de la création du plat');
    }
  };

  return (
    <ProtectedRoute requiredRole={['restaurateur', 'admin']}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">{dict.restaurateur.addPlat}</h1>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/${lang}/restaurateur/plats`)}
            aria-label={`${dict.common.back} ${dict.restaurateur.plats}`}
            className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {dict.common.back}
          </Button>
        </div>

        {validationError && (
          <div 
            className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
            role="alert"
            aria-live="assertive"
          >
            {validationError}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4" aria-label={dict.restaurateur.addPlat}>
            <div>
              <label htmlFor="plat-name" className="text-sm font-medium mb-1 block">{dict.restaurateur.platName}</label>
              <Input
                id="plat-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={dict.restaurateur.platName}
                required
                aria-label={dict.restaurateur.platName}
                aria-invalid={!!validationError}
              />
            </div>
            
            <div>
              <label htmlFor="plat-price" className="text-sm font-medium mb-1 block">{dict.restaurateur.price}</label>
              <Input
                id="plat-price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder={dict.restaurateur.price}
                required
                aria-label={dict.restaurateur.price}
                aria-invalid={!!validationError}
              />
            </div>
            
            <div>
              <label htmlFor="plat-image" className="text-sm font-medium mb-1 block">{dict.restaurateur.imageUrl}</label>
              <Input
                id="plat-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                aria-label={dict.restaurateur.imageUrl}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={dict.restaurateur.createPlat}
              >
                {dict.restaurateur.createPlat}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push(`/${lang}/restaurateur/plats`)}
                aria-label={dict.common.cancel}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {dict.common.cancel}
              </Button>
            </div>
          </form>
        </div>

        {showSuccess && (
          <Message
            type="success"
            message={dict.restaurateur.platSuccess}
            onClose={() => {
              setShowSuccess(false);
              router.push(`/${lang}/restaurateur/plats`);
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

