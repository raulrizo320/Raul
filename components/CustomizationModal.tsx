
import React, { useState, useMemo } from 'react';
import { Product, Ingredient, CartItem } from '../types';
import { CloseIcon, PlusIcon } from './Icons';

interface CustomizationModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
};

const CustomizationModal: React.FC<CustomizationModalProps> = ({ product, onClose, onAddToCart }) => {
  const [customizations, setCustomizations] = useState<{ added: Ingredient[], removed: Ingredient[] }>({ added: [], removed: [] });

  const handleToggleAddon = (ingredient: Ingredient) => {
    setCustomizations(prev => {
      const isAdded = prev.added.some(i => i.id === ingredient.id);
      if (isAdded) {
        return { ...prev, added: prev.added.filter(i => i.id !== ingredient.id) };
      } else {
        return { ...prev, added: [...prev.added, ingredient] };
      }
    });
  };

  const handleToggleRemoval = (ingredient: Ingredient) => {
    setCustomizations(prev => {
      const isRemoved = prev.removed.some(i => i.id === ingredient.id);
      if (isRemoved) {
        return { ...prev, removed: prev.removed.filter(i => i.id !== ingredient.id) };
      } else {
        return { ...prev, removed: [...prev.removed, ingredient] };
      }
    });
  };

  const finalPrice = useMemo(() => {
    const addonsPrice = customizations.added.reduce((sum, item) => sum + item.price, 0);
    return product.price + addonsPrice;
  }, [product.price, customizations.added]);

  // FIX: Correctly structure the new cart item to conform to the CartItem type.
  // This involves creating a `variant` object with the final price and a descriptive label,
  // and passing the `customizations` object, fixing the type error on creation.
  const handleConfirmAddToCart = () => {
    const newItem: CartItem = {
      id: Date.now(),
      product,
      quantity: 1,
      variant: {
        label: 'Personalizado',
        price: finalPrice,
      },
      customizations,
    };
    onAddToCart(newItem);
    onClose();
  };

  const baseIngredients = product.customizableIngredients?.filter(i => i.price === 0) || [];
  const extraIngredients = product.customizableIngredients?.filter(i => i.price > 0) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-brand-light rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-display font-extrabold text-brand-dark">Personaliza tu {product.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-brand-red transition-colors">
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {baseIngredients.length > 0 && (
            <div>
              <h3 className="font-bold text-lg text-brand-dark mb-3">Quitar ingredientes</h3>
              <div className="grid grid-cols-2 gap-3">
                {baseIngredients.map(ing => (
                  <button
                    key={ing.id}
                    onClick={() => handleToggleRemoval(ing)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${customizations.removed.some(i => i.id === ing.id) ? 'bg-red-100 border-brand-red text-brand-red line-through' : 'bg-white border-gray-200'}`}
                  >
                    {ing.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {extraIngredients.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-lg text-brand-dark mb-3">Agregar extras</h3>
              {extraIngredients.map(ing => (
                <div key={ing.id} className="flex justify-between items-center bg-white p-3 rounded-lg mb-2 border-2 border-transparent has-[:checked]:border-brand-gold">
                  <label htmlFor={String(ing.id)} className="flex-grow cursor-pointer">
                    <span className="font-medium">{ing.name}</span>
                    <span className="text-gray-500 ml-2">({formatCurrency(ing.price)})</span>
                  </label>
                  <input
                    type="checkbox"
                    id={String(ing.id)}
                    checked={customizations.added.some(i => i.id === ing.id)}
                    onChange={() => handleToggleAddon(ing)}
                    className="h-6 w-6 rounded-md border-gray-300 text-brand-gold focus:ring-brand-gold"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-6 mt-auto bg-white/50 border-t border-gray-200 rounded-b-2xl">
          <button
            onClick={handleConfirmAddToCart}
            className="w-full flex justify-between items-center py-4 px-6 bg-brand-red text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors duration-300 text-lg"
          >
            <div className="flex items-center gap-2">
                <PlusIcon className="w-6 h-6" />
                <span>Agregar al carrito</span>
            </div>
            <span>{formatCurrency(finalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
