'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/store/authStore';
import { Message } from '@/components/ui/Message';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ProfilePage() {
  const { user, updateProfile, isLoading, error } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

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
        <div className='text-3xl flex justify-center mb-8 font-bold'>Bienvenue, {user?.name || ''}</div>
        <h1 className='text-xl mb-6'>Mon Profil</h1>
      
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
              Nom
            </label>
            <Input
              id="profile-name"
              placeholder='Nom'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-label="Nom"
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="sr-only">
              Email
            </label>
            <Input
              id="profile-email"
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
            />
          </div>
          <div className='flex justify-center align-center'>
            <Button 
              type='submit'
              className='mt-6 h-12 rounded-3xl px-8'
              disabled={isLoading}
              aria-label={isLoading ? 'Mise à jour en cours...' : 'Mettre à jour le profil'}
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>

        {showSuccess && (
          <Message
            type="success"
            message="Profil mis à jour avec succès!"
            onClose={() => setShowSuccess(false)}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}