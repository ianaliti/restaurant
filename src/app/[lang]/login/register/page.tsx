'use client';

import React, { useState, use } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDictionary } from '@/components/i18n/DictionaryProvider';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';

export default function RegisterPage({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en' }>;
}) {
  const { lang } = use(params);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'restaurateur'>('customer');
  
  const { register, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const dict = useDictionary();

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!email || !password || !name) {
      setValidationError(dict.auth.register.fillAllFields);
      return;
    }

    if (password !== confirmPassword) {
      setValidationError(dict.auth.register.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setValidationError(dict.auth.register.passwordTooShort);
      return;
    }

    try {
      await register(email, password, name, role);
      const user = useAuthStore.getState().user;
      
      if (user?.role === 'restaurateur') {
        router.push(`/${lang}/restaurateur`);
      } else if (user?.role === 'admin') {
        router.push(`/${lang}/admin`);
      } else {
        router.push(`/${lang}/restaurants`);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setValidationError(err instanceof Error ? err.message : dict.auth.register.emailTaken);
    }
  };

  return (
    <main id="main-content" className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8 relative'>
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <h1 className='text-2xl font-semibold mb-2'>{dict.auth.register.title}</h1>
        <p className='text-sm text-muted-foreground mb-6'>
          {dict.auth.register.subtitle}
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

        <form onSubmit={handleSubmit} className='flex flex-col gap-4' aria-label={dict.auth.register.formLabel}>
          <div>
            <label htmlFor="register-name" className="sr-only">
              {dict.auth.register.fullName}
            </label>
            <Input
              id="register-name"
              placeholder={dict.auth.register.fullName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-label={dict.auth.register.fullName}
              aria-invalid={!!(error || validationError)}
            />
          </div>
          
          <div>
            <label htmlFor="register-email" className="sr-only">
              {dict.auth.register.email}
            </label>
            <Input
              id="register-email"
              type='email'
              placeholder={dict.auth.register.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label={dict.auth.register.email}
              aria-invalid={!!(error || validationError)}
            />
          </div>
          
          <div>
            <label htmlFor="register-password" className="sr-only">
              {dict.auth.register.password}
            </label>
            <Input
              id="register-password"
              type='password'
              placeholder={dict.auth.register.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              aria-label={dict.auth.register.password}
              aria-invalid={!!(error || validationError)}
            />
          </div>
          
          <div>
            <label htmlFor="register-confirm-password" className="sr-only">
              {dict.auth.register.confirmPassword}
            </label>
            <Input
              id="register-confirm-password"
              type='password'
              placeholder={dict.auth.register.confirmPassword}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              aria-label={dict.auth.register.confirmPassword}
              aria-invalid={!!(error || validationError)}
            />
          </div>

          <Button
            type='submit'
            className='mt-2 w-full h-12 rounded-3xl'
            disabled={isLoading}
            aria-label={isLoading ? dict.auth.register.submitting : dict.auth.register.submit}
          >
            {isLoading ? dict.auth.register.submitting : dict.auth.register.submit}
          </Button>
        </form>

        <p className='mt-6 text-center text-sm text-muted-foreground'>
          {dict.auth.register.hasAccount}{' '}
          <Link 
            href={`/${lang}/login`} 
            className='text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'
            aria-label={dict.auth.register.login}
          >
            {dict.auth.register.login}
          </Link>
        </p>
      </div>
    </main>
  );
}
