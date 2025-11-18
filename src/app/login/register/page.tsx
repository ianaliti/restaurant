'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'restaurateur'>('customer');
  
  const { register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password || !name) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
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
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8'>
        <h1 className='text-2xl font-semibold mb-2'>Créer un compte</h1>
        <p className='text-sm text-muted-foreground mb-6'>
          Rejoignez RestoDigital et commencez à commander
        </p>

        {error && (
          <div className='mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <Input
            placeholder='Nom complet'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type='password'
            placeholder='Mot de passe'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          
          <Input
            type='password'
            placeholder='Confirmer le mot de passe'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className='flex gap-2'>
            <Button
              type='button'
              variant={role === 'customer' ? 'default' : 'outline'}
              className='flex-1'
              onClick={() => setRole('customer')}
            >
              Client
            </Button>
            <Button
              type='button'
              variant={role === 'restaurateur' ? 'default' : 'outline'}
              className='flex-1'
              onClick={() => setRole('restaurateur')}
            >
              Restaurateur
            </Button>
          </div>

          <Button
            type='submit'
            className='mt-2 w-full h-12 rounded-3xl'
            disabled={isLoading}
          >
            {isLoading ? 'Création...' : 'Créer un compte'}
          </Button>
        </form>

        <p className='mt-6 text-center text-sm text-muted-foreground'>
          Déjà un compte?{' '}
          <Link href='/login' className='text-primary hover:underline'>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

