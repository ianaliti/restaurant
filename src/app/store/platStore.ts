export interface PlatData {
  id: string;
  userId: string;
  name: string;
  price: number;
  image: string;
}

const MOCK_PLATS_KEY = 'mock-plats-storage';

const getMockPlats = (): PlatData[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(MOCK_PLATS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

const saveMockPlats = (plats: PlatData[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_PLATS_KEY, JSON.stringify(plats));
};

export const createPlat = (platData: Omit<PlatData, 'id'>) => {
  const plats = getMockPlats();
  const newPlat: PlatData = {
    ...platData,
    id: Date.now().toString(),
  };
  plats.push(newPlat);
  saveMockPlats(plats);
  return newPlat;
};

export const getPlatsByUserId = (userId: string): PlatData[] => {
  const plats = getMockPlats();
  return plats.filter(p => p.userId === userId);
};

export const updatePlat = (platId: string, updates: Partial<Omit<PlatData, 'id' | 'userId'>>) => {
  const plats = getMockPlats();
  const index = plats.findIndex(p => p.id === platId);
  if (index >= 0) {
    plats[index] = { ...plats[index], ...updates };
    saveMockPlats(plats);
    return plats[index];
  }
  return null;
};

export const deletePlat = (platId: string) => {
  const plats = getMockPlats();
  const filtered = plats.filter(p => p.id !== platId);
  saveMockPlats(filtered);
};

export const deletePlatsByUserId = (userId: string) => {
  const plats = getMockPlats();
  const filtered = plats.filter(p => p.userId !== userId);
  saveMockPlats(filtered);
};

