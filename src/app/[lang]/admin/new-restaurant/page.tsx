'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LazyMessage as Message } from "@/components/ui/LazyComponents";
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import { apiFetch } from "@/lib/api/apiClient";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const dict = useDictionary();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
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
      const res = await apiFetch('/api/restaurants', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          image: formData.image || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to create restaurant');
      }

      setFormData({ name: '', email: '', password: '', image: '' });
      setShowSuccess(true);
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <h1 className="text-lg font-semibold">{dict.admin.addRestaurateur}</h1>

        {validationError && (
          <div className='mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm' role='alert' aria-live='assertive'>
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 max-w-sm" aria-label={dict.admin.addRestaurateur}>
          <div>
            <label htmlFor='restaurant-name' className='sr-only'>{dict.profile.name}</label>
            <Input id='restaurant-name' placeholder={dict.profile.name} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="restaurant-email" className="sr-only">{dict.profile.email}</label>
            <Input id="restaurant-email" type="email" placeholder={dict.profile.email} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div>
            <label htmlFor='restaurant-password' className="sr-only">{dict.auth.login.password}</label>
            <Input id='restaurant-password' type="password" placeholder={dict.auth.login.password} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
          </div>
          <div>
            <label htmlFor='restaurant-image' className='sr-only'>{dict.restaurateur.imageUrl}</label>
            <Input id='restaurant-image' placeholder={dict.restaurateur.imageUrl} value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
          </div>

          <Button type="submit" className='h-9 rounded-md bg-primary px-4 text-white text-sm'>
            {dict.common.add}
          </Button>

          {showSuccess && (
            <Message type="success" message={dict.admin.addSuccess} onClose={() => { setShowSuccess(false); router.push(`/${lang}/admin`); }} />
          )}
        </form>

        <Button variant="outline" onClick={() => router.push(`/${lang}/admin`)} className="h-9 rounded-md px-4 text-sm">
          {dict.common.back} {dict.admin.title}
        </Button>
      </div>
    </ProtectedRoute>
  );
}
