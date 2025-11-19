'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRestaurantStore } from "@/app/store/restaurantStore";
import { createUserWithoutLogin } from "@/app/store/userStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Message } from "@/components/ui/Message";

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

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setValidationError('Veuillez remplir tous les champs obligatoires');
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
        {validationError && (
          <div 
            className='mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm'
            role='alert'
            aria-live='assertive'
          >
            {validationError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3 max-w-sm" aria-label="Formulaire d'ajout de restaurateur">
          <div>
            <label htmlFor='restaurant-name' className='sr-only'>Nom</label>
            <Input
              id='restaurant-name'
              placeholder="Nom"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              aria-label='Nom du restaurateur'
              aria-invalid={!!validationError}
            />
          </div>
          <div>
            <label htmlFor='restaurant-address' className='sr-only'>Adresse</label>
            <Input
              id='restaurant-address'
              placeholder="Adresse"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              aria-label='Adresse'
            />
          </div>
          <div>
            <label htmlFor='restaurant-codePostal' className='sr-only'>Code Postal</label>
            <Input
              id='restaurant-codePostal'
              placeholder="Code Postal"
              value={formData.codePostal}
              onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
              aria-label='Code postal'
            />
          </div>
          <div>
            <label htmlFor='restaurant-city' className='sr-only'>Ville</label>
            <Input
              id='restaurant-city'
              placeholder="Ville"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              aria-label='Ville'
            />
          </div>
          <div>
            <label htmlFor='restaurant-email' className='sr-only'>Email</label>
            <Input
              id="restaurant-email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              aria-label='Adresse email'
              aria-invalid={!!validationError}
            />
          </div>
          <div>
            <label htmlFor='restaurant-image' className='sr-only'>URL de l'image</label>
            <Input
              id='restaurant-image'
              type="text"
              placeholder="URL de l'image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              aria-label="URL de l'image du restaurant"
            />
          </div>
          <div>
            <label htmlFor="restaurant-password" className="sr-only">Mot de passe</label>
            <Input
              id='restaurant-password'
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              aria-label='Mot de passe (minimum 6 caractères)'
              aria-invalid={!!validationError}
            />
          </div>
          <Button 
            type="submit" 
            className='h-9 rounded-md bg-primary px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            aria-label='Ajouter le restaurateur'
          >
            Ajouter
          </Button>
          {showSuccess && (
            <Message
              type="success"
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
            className="h-9 rounded-md px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Retour à la page d'administration"
          >
            Retour à l'administration
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}


