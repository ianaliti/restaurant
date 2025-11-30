'use client';

import { useState, useEffect, use } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/store/authStore';
import { LazyMessage as Message } from '@/components/ui/LazyComponents';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useDictionary } from '@/components/i18n/DictionaryProvider';

export default function ProfilePage({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en' }>;
}) {
  const { lang: _lang } = use(params);
  const { user, updateProfile, isLoading, error } = useAuthStore();
  const [name, setName] = useState(() => user?.name || '');
  const [email, setEmail] = useState(() => user?.email || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const dict = useDictionary();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      return;
    }

    try {
      await updateProfile(name, email);
      setShowSuccess(true);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <ProtectedRoute requiredRole="customer">
      <main id="main-content" className='max-w-lg mx-auto px-4 sm:px-6 py-8 flex justify-between flex-col'>
        <div className='text-3xl flex justify-center mb-8 font-bold'>{dict.profile.welcome.replace('{{name}}', user?.name || '')}</div>
        <h1 className='text-xl mb-6'>{dict.profile.title}</h1>
      
        {error && (
          <div 
            className='mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm'
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4' aria-label="Formulaire de mise à jour du profil">
          <div>
            <label htmlFor="profile-name" className="sr-only">
              {dict.profile.name}
            </label>
            <Input
              id="profile-name"
              placeholder={dict.profile.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-label={dict.profile.name}
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="sr-only">
              {dict.profile.email}
            </label>
            <Input
              id="profile-email"
              type='email'
              placeholder={dict.profile.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label={dict.profile.email}
            />
          </div>
          <div className='flex justify-center align-center'>
            <Button 
              type='submit'
              className='mt-6 h-12 rounded-3xl px-8'
              disabled={isLoading}
              aria-label={isLoading ? dict.profile.updating : dict.profile.update}
            >
              {isLoading ? dict.profile.updating : dict.profile.update}
            </Button>
          </div>
        </form>

        {showSuccess && (
          <Message
            type="success"
            message={dict.profile.updateSuccess}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}
