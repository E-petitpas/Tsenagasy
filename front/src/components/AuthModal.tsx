import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { getDemoUser } from '../config/demo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; type: 'client' | 'vendor'; accessToken?: string; id?: string }) => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [userType, setUserType] = useState<'client' | 'vendor'>('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    businessName: '',
    businessType: 'pme'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo mode - if no email/password provided, use demo credentials
    if (!formData.email || !formData.password) {
      const demoUser = {
        name: 'Utilisateur Demo',
        type: 'client' as const,
        accessToken: 'demo-token',
        id: 'demo-user-id'
      };
      onLogin(demoUser);
      onClose();
      return;
    }
    
    // Mode démo - utilise les utilisateurs prédéfinis
    const demoUser = formData.email && formData.password ? 
      {
        ...getDemoUser(userType),
        name: formData.name || getDemoUser(userType).name
      } : 
      {
        name: formData.name || 'Utilisateur Demo',
        type: userType,
        accessToken: 'demo-token',
        id: 'demo-user-id'
      };
    
    onLogin(demoUser);
    onClose();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo mode - if minimal info provided, create demo user
    if (!formData.email || !formData.password || !formData.name) {
      const demoUser = {
        name: formData.name || 'Nouveau Utilisateur',
        type: userType,
        accessToken: 'demo-token',
        id: 'demo-user-id'
      };
      onLogin(demoUser);
      onClose();
      return;
    }
    
    // Mode démo - crée un utilisateur de démonstration
    const demoUser = {
      ...getDemoUser(userType),
      name: formData.name || getDemoUser(userType).name
    };
    onLogin(demoUser);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-[#2D8A47]">
            Rejoindre Tsena.mg
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Connectez-vous ou créez un compte pour découvrir le meilleur de Madagascar
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Se connecter</TabsTrigger>
            <TabsTrigger value="register">S'inscrire</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email ou Téléphone</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.mg (ou laissez vide pour le mode démo)"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
              </div>

              <div className="text-right">
                <a href="#" className="text-sm text-[#2D8A47] hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              <Button type="submit" className="w-full bg-[#2D8A47] hover:bg-[#245A35]">
                Se connecter
              </Button>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                💡 Astuce : Laissez les champs vides pour accéder au mode démo
              </p>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            {/* User Type Selection */}
            <div>
              <Label>Je suis :</Label>
              <RadioGroup
                value={userType}
                onValueChange={(value) => setUserType(value as 'client' | 'vendor')}
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="client" id="client" />
                  <Label htmlFor="client" className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Client
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vendor" id="vendor" />
                  <Label htmlFor="vendor" className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    Vendeur
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="Votre nom complet"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reg-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="votre@email.mg"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="+261 xx xxx xx xx"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Localisation</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="Antananarivo, Madagascar"
                    className="pl-10"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>

              {userType === 'vendor' && (
                <>
                  <div>
                    <Label htmlFor="businessName">Nom de l'entreprise/Commerce</Label>
                    <Input
                      id="businessName"
                      placeholder="Votre commerce ou entreprise"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Type de commerce</Label>
                    <RadioGroup
                      value={formData.businessType}
                      onValueChange={(value) => handleInputChange('businessType', value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pme" id="pme" />
                        <Label htmlFor="pme">PME</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="freelance" id="freelance" />
                        <Label htmlFor="freelance">Freelance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="particulier" id="particulier" />
                        <Label htmlFor="particulier">Particulier</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="reg-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
              </div>

              <Button 
                type="button" 
                onClick={handleSignup}
                className="w-full bg-[#2D8A47] hover:bg-[#245A35]"
              >
                S'inscrire
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-500 mt-4">
          En vous inscrivant, vous acceptez nos{' '}
          <a href="#" className="text-[#2D8A47] hover:underline">Conditions d'utilisation</a>
        </div>
      </DialogContent>
    </Dialog>
  );
}