'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(email, password);
      const user = useAuthStore.getState().user;
      if (user?.role === 'admin') {
        router.push('/admin');
      } else if (user?.role === 'restaurateur') {
        router.push('/restaurateur');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <main id="main-content" className='min-h-screen flex items-center justify-center px-4'>
              <Button variant="secondary" onClick={() => router.push('/restaurants')} aria-label="Retour à la page précédente" className='absolute z-10 left-5 top-5'><ArrowLeft /></Button>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8'>
        <h1 className='text-2xl font-semibold mb-2'>Se Connecter</h1>
        <p className='text-sm text-muted-foreground mb-6'>
          Connectez-vous à votre compte RestoDigital
        </p>

        {(error || validationError) && (
          <div 
            className='mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm'
            role="alert"
            aria-live="assertive"
          >
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4' aria-label="Formulaire de connexion">
          <div>
            <label htmlFor="login-email" className="sr-only">
              Email
            </label>
            <Input
              id="login-email"
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Adresse email"
              aria-invalid={!!(error || validationError)}
            />
          </div>
          
          <div>
            <label htmlFor="login-password" className="sr-only">
              Mot de passe
            </label>
            <Input
              id="login-password"
              type='password'
              placeholder='Mot de passe'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Mot de passe"
              aria-invalid={!!(error || validationError)}
            />
          </div>

          <Button
            type='submit'
            className='mt-2 w-full h-12 rounded-3xl'
            disabled={isLoading}
            aria-label={isLoading ? 'Connexion en cours...' : 'Se connecter'}
          >
            {isLoading ? 'Connexion...' : 'Se Connecter'}
          </Button>
        </form>

        <p className='mt-6 text-center text-sm text-muted-foreground'>
          Pas encore de compte?{' '}
          <Link 
            href='login/register' 
            className='text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'
            aria-label="Créer un nouveau compte"
          >
            Créer un compte
          </Link>
        </p>

        <div className='mt-6 pt-6 border-t'>
          <p className='text-xs text-muted-foreground mb-2'>Test accounts:</p>
          <div className='text-xs space-y-1'>
            <p><strong>Admin:</strong> admin@restodigital.com / admin123</p>
            <p><strong>Restaurateur:</strong> restaurateur@restodigital.com / resto123</p>
          </div>
        </div>
      </div>
    </main>
  );
}