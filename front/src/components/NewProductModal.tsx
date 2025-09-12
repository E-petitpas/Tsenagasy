import React, { useState } from 'react';
import { X, Upload, DollarSign, Package, Tag, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
}

const categories = [
  { id: 'artisanat', name: 'Artisanat' },
  { id: 'alimentation', name: 'Alimentation' },
  { id: 'textiles', name: 'Textiles' },
  { id: 'cosmetiques', name: 'Cosmétiques' },
  { id: 'bijoux', name: 'Bijoux' },
  { id: 'decoration', name: 'Décoration' },
  { id: 'autre', name: 'Autre' }
];

export function NewProductModal({ isOpen, onClose, onSave }: NewProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [] as string[],
    tags: '',
    weight: '',
    dimensions: '',
    materials: ''
  });

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      // Simulation d'upload d'images
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...imageUrls] 
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      images: formData.images,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      status: 'draft',
      sales: 0,
      views: 0,
      weight: formData.weight,
      dimensions: formData.dimensions,
      materials: formData.materials,
      createdAt: new Date().toISOString()
    };

    onSave(newProduct);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      images: [],
      tags: '',
      weight: '',
      dimensions: '',
      materials: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#2D8A47]">
            Nouveau produit
          </DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau produit à votre catalogue Tsena.mg
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Lamba traditionnel malgache"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre produit, ses caractéristiques, son origine..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Prix (Ar) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="25000"
                      className="pl-10"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="stock">Stock *</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="stock"
                      type="number"
                      placeholder="10"
                      className="pl-10"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="tags"
                    placeholder="traditionnel, fait main, madagascar"
                    className="pl-10"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Images et détails */}
            <div className="space-y-4">
              <div>
                <Label>Images du produit</Label>
                <Card
                  className={`border-2 border-dashed transition-colors ${
                    dragActive ? 'border-[#2D8A47] bg-green-50' : 'border-gray-300'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-sm text-gray-600 mb-4">
                        Glissez-déposez vos images ici ou{' '}
                        <label className="text-[#2D8A47] cursor-pointer hover:underline">
                          parcourez
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files)}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB chacune</p>
                    </div>
                  </CardContent>
                </Card>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Produit ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Poids (g)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="500"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="dimensions">Dimensions (cm)</Label>
                  <Input
                    id="dimensions"
                    placeholder="30x20x10"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="materials">Matériaux</Label>
                <Input
                  id="materials"
                  placeholder="Coton, raphia, bois de rose..."
                  value={formData.materials}
                  onChange={(e) => handleInputChange('materials', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => {
                // Sauvegarder en brouillon
                const draftProduct = { ...formData, status: 'draft' };
                console.log('Saved as draft:', draftProduct);
              }}
            >
              Sauvegarder en brouillon
            </Button>
            <Button 
              type="submit"
              className="bg-[#2D8A47] hover:bg-[#245A35]"
              disabled={!formData.name || !formData.price || !formData.stock || !formData.category}
            >
              Publier le produit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}