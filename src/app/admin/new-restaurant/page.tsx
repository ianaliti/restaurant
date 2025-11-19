'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRestaurantStore } from "@/app/store/restaurantStore";
import { createUserWithoutLogin } from "@/app/store/userStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SuccessMessage } from "@/components/ui/SuccessMessage";

export default function Page() {
  const router = useRouter();
  const createRestaurant = useRestaurantStore(state => state.createRestaurant);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    codePostal: '',
    city: '',
    email: '',
    password: '',
    image: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const newUser = createUserWithoutLogin(
        formData.email,
        formData.password,
        formData.name,
        'restaurateur'
      );
      
      const restaurantData = {
        userId: newUser.id,
        name: formData.name,
        address: formData.address,
        codePostal: formData.codePostal,
        city: formData.city,
        email: formData.email,
        image: formData.image || '/default-restaurant.jpg',
      };
      
      createRestaurant(restaurantData);
      
      setFormData({
        name: '',
        address: '',
        codePostal: '',
        city: '',
        email: '',
        password: '',
        image: ''
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating restaurateur:', error);;
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
            type="text"
            placeholder="URL de l'image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
          {showSuccess && (
            <SuccessMessage
              message="Restaurateur ajouté avec succès!"
              onClose={() => {
                setShowSuccess(false);
                router.push('/admin');
              }}
            />
          )}
        </form>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin')}
            className="h-9 rounded-md px-4 text-sm"
          >
            Retour à l'administration
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}


