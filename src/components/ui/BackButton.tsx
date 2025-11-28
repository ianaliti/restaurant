'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useDictionary } from '@/components/i18n/DictionaryProvider';

interface BackButtonProps {
  lang: 'fr' | 'en';
}

export function BackButton({ lang }: BackButtonProps) {
  const router = useRouter();
  const dict = useDictionary();

  return (
    <Button 
      variant="secondary" 
      onClick={() => router.back()} 
      className='w-15' 
      aria-label={dict.common.back}
    >
      <ArrowLeft />
    </Button>
  );
}

