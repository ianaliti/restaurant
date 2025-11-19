'use client';

import { useState } from 'react';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/store/authStore";
import { usePlatStore } from "@/app/store/platStore";
import { useRouter } from "next/navigation";
import { Message } from "@/components/ui/Message";

export default function NewPlatPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const createPlat = usePlatStore(state => state.createPlat);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !user?.id) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert('Le prix doit être un nombre valide');
      return;
    }

    try {
      createPlat({
        userId: user.id,
        name: formData.name,
        price: price,
        image: formData.image || '/placeholder-plat.jpg',
      });
      
      setFormData({
        name: '',
        price: '',
        image: '',
      });
      setShowSuccess(true);
    } catch (error) {
      alert('Erreur lors de la création du plat');
    }
  };

  return (
    <ProtectedRoute requiredRole={['restaurateur', 'admin']}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Nouveau plat</h1>
          <Button variant="outline" onClick={() => router.push('/restaurateur/plats')}>
            Retour
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nom du plat</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du plat"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Prix (€)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Prix"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">URL de l'image</label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Créer le plat
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/restaurateur/plats')}
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>

        {showSuccess && (
          <Message
            type="success"
            message="Plat ajouté avec succès!"
            onClose={() => {
              setShowSuccess(false);
              router.push('/restaurateur/plats');
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

