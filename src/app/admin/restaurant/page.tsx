'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/store/authStore";
import { useState } from "react";

export default function Page() {
  const { register } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    codePostal: '',
    city: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.password, formData.name, 'restaurateur');
      alert('Restaurateur créé avec succès!');
      setFormData({
        name: '',
        address: '',
        codePostal: '',
        city: '',
        email: '',
        password: '',
      });
    } catch (error) {
      alert('Erreur lors de la création du restaurateur');
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <h1 className="text-lg font-semibold">Ajouter un restaurateur</h1>
        <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
          <Input
            placeholder="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            placeholder="Adresse"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <Input
            placeholder="Code Postal"
            value={formData.codePostal}
            onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
          />
          <Input
            placeholder="Ville"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
          />
          <Button type="submit" className="h-9 rounded-md bg-primary px-4 text-white text-sm">
            Ajouter
          </Button>
        </form>
      </div>
    </ProtectedRoute>
  );
}


