import React from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContentWide } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export const ViewProductModal: React.FC<ViewProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* 🔹 Modal avec border-radius et bordure visible comme dans ModifyProductModal */}
      <DialogContentWide className="max-w-3xl bg-white rounded-3xl shadow-lg px-10 py-8 border border-gray-200 overflow-y-auto" style={{ borderRadius: "8px" }}>
        
        {/* 🔹 Titre vert */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-700 mb-4">
            {product.nom}
          </DialogTitle>
        </DialogHeader>

        {/* 🔹 Description */}
        {product.description && (
          <p className="text-gray-800 text-sm leading-relaxed mb-2">
            {product.description}
          </p>
        )}

        {/* 🔹 Tags bleus */}
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag: string, index: number) => (
              <span key={index} className="text-blue-600 text-sm font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 🔹 Images */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {(product.images || [product.image]).map((img: string, index: number) => (
            <div
              key={index}
              className="aspect-square w-24 rounded-lg border border-gray-200 bg-gray-50 shadow-sm overflow-hidden flex items-center justify-center"
            >
              <ImageWithFallback
                src={img}
                alt={`${product.nom}-${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* 🔹 Infos principales sur 2 lignes */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md">
            <span className="font-medium text-gray-900">Prix :</span>
            <span>{new Intl.NumberFormat("mg-MG").format(product.price)} Ar</span>
          </div>

          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md">
            <span className="font-medium text-gray-900">Stock :</span>
            <span>{product.stock || "—"}</span>
          </div>

          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md">
            <span className="font-medium text-gray-900">Vues :</span>
            <span>{product.views}</span>
          </div>

          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md">
            <span className="font-medium text-gray-900">Statut :</span>
            <span>{product.status}</span>
          </div>
        </div>
      </DialogContentWide>
    </Dialog>
  );
};
