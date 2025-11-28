export type WithId<T> = T & { id: string | number };

export type WithoutId<T> = Omit<T, 'id'>;

export type UpdateData<T> = Partial<WithoutId<T>>;

export type ApiResponse<T> = { 
  data: T; 
  error?: string;
};

export type StoreSelector<T> = (state: T) => T[keyof T];

export function findByUserId<T extends { userId: string }>(
  items: T[],
  userId: string
): T[] {
  return items.filter((item) => item.userId === userId);
}

export function findById<T extends { id: string | number }>(
  items: T[],
  id: string | number
): T | undefined {
  return items.find((item) => item.id === id);
}

