'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/store/authStore";
import { useState } from "react";

export default function RestaurantPage() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: 'Le clos des sens',
    address: '18 Rue Jean Mermoz',
    codePostal: '74000',
    city: 'Annecy',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Restaurant mis à jour avec succès!');
  };

  return (
    <ProtectedRoute requiredRole={['restaurateur', 'admin']}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Mon Restaurant</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-muted-foreground mb-4">
            Bienvenue, {user?.name}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="text-sm font-medium mb-1 block">Nom du restaurant</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du restaurant"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Adresse</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Adresse"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Code Postal</label>
                <Input
                  value={formData.codePostal}
                  onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                  placeholder="Code Postal"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Ville</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ville"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              Modifier
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}


