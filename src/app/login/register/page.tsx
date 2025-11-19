'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'restaurateur'>('customer');
  
  const { register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!email || !password || !name) {
      setValidationError('Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setValidationError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await register(email, password, name, role);
      const user = useAuthStore.getState().user;
      
      console.log('Registered user role:', user?.role, 'Selected role:', role);
      
      if (user?.role === 'restaurateur') {
        router.push('/restaurant');
      } else if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <main id="main-content" className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8'>
        <h1 className='text-2xl font-semibold mb-2'>Créer un compte</h1>
        <p className='text-sm text-muted-foreground mb-6'>
          Rejoignez RestoDigital et commencez à commander
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

        <form onSubmit={handleSubmit} className='flex flex-col gap-4' aria-label="Formulaire de création de compte">
          <div>
            <label htmlFor="register-name" className="sr-only">
              Nom complet
            </label>
            <Input
              id="register-name"
              placeholder='Nom complet'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-label="Nom complet"
              aria-invalid={!!(error || validationError)}
            />
          </div>
          
          <div>
            <label htmlFor="register-email" className="sr-only">
              Email
            </label>
            <Input
              id="register-email"
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
            <label htmlFor="register-password" className="sr-only">
              Mot de passe
            </label>
            <Input
              id="register-password"
              type='password'
              placeholder='Mot de passe'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              aria-label="Mot de passe (minimum 6 caractères)"
              aria-invalid={!!(error || validationError)}
            />
          </div>
          
          <div>
            <label htmlFor="register-confirm-password" className="sr-only">
              Confirmer le mot de passe
            </label>
            <Input
              id="register-confirm-password"
              type='password'
              placeholder='Confirmer le mot de passe'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              aria-label="Confirmer le mot de passe"
              aria-invalid={!!(error || validationError)}
            />
          </div>

          <Button
            type='submit'
            className='mt-2 w-full h-12 rounded-3xl'
            disabled={isLoading}
            aria-label={isLoading ? 'Création du compte en cours...' : 'Créer un compte'}
          >
            {isLoading ? 'Création...' : 'Créer un compte'}
          </Button>
        </form>

        <p className='mt-6 text-center text-sm text-muted-foreground'>
          Déjà un compte?{' '}
          <Link 
            href='/login' 
            className='text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'
            aria-label="Aller à la page de connexion"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}

