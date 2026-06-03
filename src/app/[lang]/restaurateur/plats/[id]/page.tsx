'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useMyMenu } from '@/hooks/useMenu';
import { useDictionary } from '@/components/i18n/DictionaryProvider';
import Image from 'next/image';
import type { Plat } from '@/types/restaurants.type';

export default function EditPlatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const lang = pathname?.split('/')[1] || 'fr';
  const dict = useDictionary();

  const platId = params?.id as string;
  const { dishes, isLoading, editDish, removeDish } = useMyMenu(user?.id ?? '');

  const [dish, setDish] = useState<Plat | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', image: '', category: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isLoading && dishes.length > 0) {
      const found = dishes.find((d) => d.id === platId);
      if (found) {
        setDish(found);
        setFormData({
          name: found.name,
          price: String(found.price),
          image: found.image ?? '',
          category: found.category ?? '',
        });
      }
    }
  }, [dishes, isLoading, platId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const price = parseFloat(formData.price);
    if (!formData.name || isNaN(price) || price <= 0) {
      setError(dict.validation?.required ?? 'Champs invalides');
      return;
    }
    setIsSaving(true);
    try {
      const updated = await editDish(platId, {
        name: formData.name,
        price,
        image: formData.image || null,
        category: formData.category || 'Plat',
      });
      setDish(updated);
      setIsEditing(false);
      setSuccess('Plat mis à jour avec succès!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${dish?.name}" ?`)) return;
    setIsDeleting(true);
    try {
      await removeDish(platId);
      router.push(`/${lang}/restaurateur/plats`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute requiredRole={['restaurateur', 'admin']}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">
            {isEditing ? dict.common.edit : dish?.name ?? '…'}
          </h1>
          <Button
            variant="outline"
            onClick={() => router.push(`/${lang}/restaurateur/plats`)}
            aria-label={dict.common.back}
          >
            {dict.common.back}
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm" role="status">
            {success}
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : !dish ? (
          <p className="text-muted-foreground">Plat introuvable.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {!isEditing && dish.image && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label htmlFor="plat-name" className="text-sm font-medium mb-1 block">
                    {dict.restaurateur.platName}
                  </label>
                  <Input
                    id="plat-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="plat-price" className="text-sm font-medium mb-1 block">
                    {dict.restaurateur.price}
                  </label>
                  <Input
                    id="plat-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="plat-category" className="text-sm font-medium mb-1 block">
                    Catégorie
                  </label>
                  <Input
                    id="plat-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Pizza, Pasta, Dessert…"
                  />
                </div>
                <div>
                  <label htmlFor="plat-image" className="text-sm font-medium mb-1 block">
                    {dict.restaurateur.imageUrl}
                  </label>
                  <Input
                    id="plat-image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1" disabled={isSaving}>
                    {isSaving ? 'Enregistrement…' : dict.common.save}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setIsEditing(false); setError(''); }}
                  >
                    {dict.common.cancel}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prix</span>
                  <span className="font-semibold">{dish.price.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Catégorie</span>
                  <span>{dish.category}</span>
                </div>
                {dish.description && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Description</span>
                    <span className="text-right max-w-xs">{dish.description}</span>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" onClick={() => setIsEditing(true)}>
                    {dict.common.edit}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label={`${dict.common.delete} ${dish.name}`}
                  >
                    {isDeleting ? 'Suppression…' : dict.common.delete}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
