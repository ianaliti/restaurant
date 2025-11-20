'use client';

import { Input } from '@/components/ui/input';

interface SearchInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}

export function SearchInput({
  id,
  placeholder,
  value,
  onChange,
  ariaLabel,
  className = 'rounded-3xl h-12',
}: SearchInputProps) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Input
        id={id}
        className={className}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

