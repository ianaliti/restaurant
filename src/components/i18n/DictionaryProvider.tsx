'use client';

import { createContext, useContext, ReactNode } from 'react';

type Dictionary = typeof import('@/app/dictionaries/fr.json');

const DictionaryContext = createContext<Dictionary | null>(null);

export function DictionaryProvider({ 
  dictionary, 
  children 
}: { 
  dictionary: Dictionary; 
  children: ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const dict = useContext(DictionaryContext);
  if (!dict) {
    console.warn('useDictionary called outside DictionaryProvider, using empty dict');
    return {} as typeof import('@/app/dictionaries/fr.json');
  }
  return dict;
}
