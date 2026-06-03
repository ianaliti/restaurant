'use client';

import { useState } from 'react';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyMenu } from "@/hooks/useMenu";
import { useRouter, usePathname } from "next/navigation";
import { LazyMessage as Message } from "@/components/ui/LazyComponents";
import { useDictionary } from "@/components/i18n/DictionaryProvider";

export default function NewPlatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const dict = useDictionary();

  const { addDish } = useMyMenu(user?.id ?? '');
  const [formData, setFormData] = useState({ name: '', price: '', image: '', category: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.name || !formData.price) {
      setValidationError(dict.auth.register.fillAllFields);
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setValidationError(dict.validation.required);
      return;
    }

    try {
      await addDish({
        name: formData.name,
        price,
        image: formData.image || '/placeholder-plat.jpg',
        category: formData.category || 'Plat',
      });
      setFormData({ name: '', price: '', image: '', category: '' });
      setShowSuccess(true);
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Erreur lors de la création du plat');
    }
  };

  return (
    <ProtectedRoute requiredRole={['restaurateur', 'admin']}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">{dict.restaurateur.addPlat}</h1>
          <Button variant="outline" onClick={() => router.push(`/${lang}/restaurateur/plats`)} aria-label={`${dict.common.back} ${dict.restaurateur.plats}`}>
            {dict.common.back}
          </Button>
        </div>

        {validationError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm" role="alert" aria-live="assertive">
            {validationError}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4" aria-label={dict.restaurateur.addPlat}>
            <div>
              <label htmlFor="plat-name" className="text-sm font-medium mb-1 block">{dict.restaurateur.platName}</label>
              <Input id="plat-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={dict.restaurateur.platName} required />
            </div>
            <div>
              <label htmlFor="plat-price" className="text-sm font-medium mb-1 block">{dict.restaurateur.price}</label>
              <Input id="plat-price" type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder={dict.restaurateur.price} required />
            </div>
            <div>
              <label htmlFor="plat-category" className="text-sm font-medium mb-1 block">Catégorie</label>
              <Input id="plat-category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Pizza, Pasta, Dessert…" />
            </div>
            <div>
              <label htmlFor="plat-image" className="text-sm font-medium mb-1 block">{dict.restaurateur.imageUrl}</label>
              <Input id="plat-image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://example.com/image.jpg" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">{dict.restaurateur.createPlat}</Button>
              <Button type="button" variant="outline" onClick={() => router.push(`/${lang}/restaurateur/plats`)}>{dict.common.cancel}</Button>
            </div>
          </form>
        </div>

        {showSuccess && (
          <Message
            type="success"
            message={dict.restaurateur.platSuccess}
            onClose={() => { setShowSuccess(false); router.push(`/${lang}/restaurateur/plats`); }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
