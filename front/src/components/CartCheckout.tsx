import React, { useState } from 'react';
import { Minus, Plus, Trash2, CreditCard, Smartphone, ChevronLeft, MapPin, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendor: string;
}

interface CartCheckoutProps {
  onBack: () => void;
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Tissu Lamba traditionnel - Soie sauvage',
    price: 45000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1660695828374-4ff51ac9df5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwdGV4dGlsZXMlMjBjb2xvcmZ1bCUyMGZhYnJpY3xlbnwxfHx8fDE3NTY2NzgxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    vendor: 'Artisan Malagasy'
  },
  {
    id: '2',
    name: 'Panier artisanal en raphia',
    price: 25000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1606077089838-0ac4a27fc96f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRhZ2FzY2FyJTIwaGFuZGNyYWZ0JTIwYXJ0aXNhbiUyMHByb2R1Y3RzfGVufDF8fHx8MTc1NjY3ODE3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    vendor: 'Tana Craft'
  }
];

export function CartCheckout({ onBack }: CartCheckoutProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [paymentMethod, setPaymentMethod] = useState('mvola');
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment'>('cart');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('mg-MG').format(price) + ' Ar';
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50000 ? 0 : 3000; // Free delivery over 50,000 Ar
  const total = subtotal + deliveryFee;

  const paymentOptions = [
    { 
      id: 'mvola', 
      name: 'MVola', 
      icon: '📱',
      color: 'text-red-600',
      description: 'Paiement mobile sécurisé'
    },
    { 
      id: 'orangemoney', 
      name: 'Orange Money', 
      icon: '🧡',
      color: 'text-orange-600',
      description: 'Paiement via Orange Money'
    },
    { 
      id: 'airtelmoney', 
      name: 'Airtel Money', 
      icon: '🔴',
      color: 'text-red-700',
      description: 'Paiement via Airtel Money'
    },
    { 
      id: 'card', 
      name: 'Carte bancaire', 
      icon: '💳',
      color: 'text-blue-600',
      description: 'Visa, Mastercard'
    }
  ];

  if (step === 'cart') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={onBack} className="mb-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Continuer les achats
            </Button>
            <h1 className="text-2xl font-bold">Mon panier ({cartItems.length} articles)</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">Votre panier est vide</p>
                      <Button onClick={onBack}>Continuer les achats</Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">Par {item.vendor}</p>
                            <p className="font-bold text-[#2D8A47]">{formatPrice(item.price)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 0)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                      {deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {deliveryFee === 0 && subtotal > 50000 && (
                    <p className="text-sm text-green-600">
                      🎉 Livraison gratuite appliquée !
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#2D8A47]">{formatPrice(total)}</span>
                  </div>
                  <Button 
                    className="w-full bg-[#2D8A47] hover:bg-[#245A35]"
                    onClick={() => setStep('shipping')}
                    disabled={cartItems.length === 0}
                  >
                    Passer la commande
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'shipping') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => setStep('cart')} className="mb-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour au panier
            </Button>
            <h1 className="text-2xl font-bold">Adresse de livraison</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input id="firstName" placeholder="Votre prénom" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input id="lastName" placeholder="Votre nom" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" placeholder="+261 xx xxx xx xx" />
                    </div>
                    <div>
                      <Label htmlFor="address">Adresse complète</Label>
                      <Input id="address" placeholder="Lot, rue, quartier..." />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input id="city" placeholder="Antananarivo" />
                      </div>
                      <div>
                        <Label htmlFor="district">District/Commune</Label>
                        <Input id="district" placeholder="Votre district" />
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Options de livraison</span>
                      </div>
                      <RadioGroup defaultValue="standard">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard">Standard (2-3 jours) - Gratuit</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express">Express (24h) - 5 000 Ar</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Résumé</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>{deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-[#2D8A47]">{formatPrice(total)}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-[#2D8A47] hover:bg-[#245A35]"
                    onClick={() => setStep('payment')}
                  >
                    Continuer vers le paiement
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => setStep('shipping')} className="mb-2">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour à la livraison
          </Button>
          <h1 className="text-2xl font-bold">Paiement sécurisé</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Choisir un mode de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  {paymentOptions.map((option) => (
                    <div key={option.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <Label htmlFor={option.id} className={`font-medium ${option.color}`}>
                              {option.name}
                            </Label>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      {paymentMethod === option.id && option.id !== 'card' && (
                        <div className="mt-4 space-y-3">
                          <div>
                            <Label>Numéro de téléphone</Label>
                            <Input placeholder="+261 xx xxx xx xx" />
                          </div>
                          <p className="text-sm text-gray-600">
                            Vous recevrez un message de confirmation pour valider le paiement.
                          </p>
                        </div>
                      )}
                      
                      {paymentMethod === option.id && option.id === 'card' && (
                        <div className="mt-4 space-y-3">
                          <div>
                            <Label>Numéro de carte</Label>
                            <Input placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Date d'expiration</Label>
                              <Input placeholder="MM/YY" />
                            </div>
                            <div>
                              <Label>CVV</Label>
                              <Input placeholder="123" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Finaliser la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total à payer</span>
                    <span className="text-[#2D8A47]">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg text-sm">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Paiement 100% sécurisé</span>
                  </div>
                  <p className="text-green-600 text-xs mt-1">
                    Vos données sont protégées par un cryptage SSL
                  </p>
                </div>

                <Button className="w-full bg-[#2D8A47] hover:bg-[#245A35] text-lg py-3">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payer maintenant
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  En continuant, vous acceptez nos conditions d'utilisation et de vente
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}