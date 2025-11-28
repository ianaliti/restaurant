'use client';

import React, { useState, use } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useDictionary } from '@/components/i18n/DictionaryProvider';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';

export default function LoginPage({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en' }>;
}) {
  const { lang } = use(params);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const [validationError, setValidationError] = useState('');
  const dict = useDictionary();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!email || !password) {
      setValidationError(dict.auth.login.fillAllFields);
      return;
    }

    try {
      await login(email, password);
      const user = useAuthStore.getState().user;
      if (user?.role === 'admin') {
        router.push(`/${lang}/admin`);
      } else if (user?.role === 'restaurateur') {
        router.push(`/${lang}/restaurateur`);
      } else {
        router.push(`/${lang}/restaurants`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setValidationError(dict.auth.login.invalidCredentials);
    }
  };

  return (
    <main id="main-content" className='min-h-screen flex items-center justify-center px-4'>
      <Button variant="secondary" onClick={() => router.push(`/${lang}/restaurants`)} aria-label={dict.common.back} className='absolute z-10 left-5 top-5'><ArrowLeft /></Button>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8 relative'>
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <h1 className='text-2xl font-semibold mb-2'>{dict.auth.login.title}</h1>
        <p className='text-sm text-muted-foreground mb-6'>
          {dict.auth.login.subtitle}
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

        <form onSubmit={handleSubmit} className='flex flex-col gap-4' aria-label={dict.auth.login.formLabel}>
          <div>
            <label htmlFor="login-email" className="sr-only">
              {dict.auth.login.email}
            </label>
            <Input
              id="login-email"
              type='email'
              placeholder={dict.auth.login.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label={dict.auth.login.email}
              aria-invalid={!!(error || validationError)}
            />
          </div>
          
          <div>
            <label htmlFor="login-password" className="sr-only">
              {dict.auth.login.password}
            </label>
            <Input
              id="login-password"
              type='password'
              placeholder={dict.auth.login.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label={dict.auth.login.password}
              aria-invalid={!!(error || validationError)}
            />
          </div>

          <Button
            type='submit'
            className='mt-2 w-full h-12 rounded-3xl'
            disabled={isLoading}
            aria-label={isLoading ? dict.auth.login.submitting : dict.auth.login.submit}
          >
            {isLoading ? dict.auth.login.submitting : dict.auth.login.submit}
          </Button>
        </form>

        <p className='mt-6 text-center text-sm text-muted-foreground'>
          {dict.auth.login.noAccount}{' '}
          <Link 
            href={`/${lang}/login/register`} 
            className='text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'
            aria-label={dict.auth.login.createAccount}
          >
            {dict.auth.login.createAccount}
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
