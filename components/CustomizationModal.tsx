import React, { useState, useMemo, useEffect } from 'react';
import { Product, Adicional, CartItem, Category } from '../types';
import { CloseIcon, PlusIcon } from './Icons';

interface CustomizationModalProps {
  product: Product | null;
  variant: { label: string; price: number } | null;
  adicionales: Adicional[];
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

const singularizeCategory = (category: Category): string => {
    if (category === Category.Papas_Locas) return 'Papas Locas';
    if (category === Category.Sandwiches) return 'Sandwich';
    
    // A simple approach for Spanish pluralization for -s and -es
    if (category.endsWith('es')) {
        return category.slice(0, -2);
    }
    if (category.endsWith('s')) {
        return category.slice(0, -1);
    }
    return category;
}


const CustomizationModal: React.FC<CustomizationModalProps> = ({ product, variant, adicionales, onClose, onAddToCart }) => {
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [added, setAdded] = useState<Adicional[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setCurrentVariant(variant);
    // Reset customizations when modal opens for a new product
    setAdded([]);
    setRemoved([]);
    setNotes('');
  }, [product, variant]);


  const handleToggleAdicional = (adicional: Adicional) => {
    setAdded(prev => 
      prev.some(a => a.id === adicional.id)
        ? prev.filter(a => a.id !== adicional.id)
        : [...prev, adicional]
    );
  };
  
  const handleToggleRemoved = (ingredient: string) => {
    setRemoved(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleAddFries = () => {
    if (product && product.secondaryPrice && product.secondaryPriceLabel) {
        setCurrentVariant({
            label: product.secondaryPriceLabel,
            price: product.secondaryPrice,
        });
    }
  };

  const finalPrice = useMemo(() => {
    if (!currentVariant) return 0;
    const addonsPrice = added.reduce((sum, item) => sum + item.price, 0);
    return currentVariant.price + addonsPrice;
  }, [currentVariant, added]);

  const handleConfirmAddToCart = () => {
    if (!product || !currentVariant) return;

    const newItem: CartItem = {
      id: Date.now(),
      product,
      quantity: 1,
      variant: currentVariant,
      customizations: {
          added,
          removed,
          notes,
      }
    };
    onAddToCart(newItem);
    onClose();
  };

  if (!product || !currentVariant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-brand-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-brand-dark flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-brand-light">Personaliza tu {singularizeCategory(product.category)} {product.name}</h2>
            <p className="text-brand-gray">{currentVariant.label}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-brand-orange transition-colors">
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {product.secondaryPrice && product.priceLabel && currentVariant.label === product.priceLabel && (
            <div className="mb-6">
                <button 
                    onClick={handleAddFries}
                    className="w-full flex items-center justify-between py-3 px-4 bg-green-500/20 text-green-400 font-bold rounded-xl hover:bg-green-500/30 transition-colors duration-300"
                >
                    <span><PlusIcon className="w-5 h-5 inline-block mr-2"/> Adiciona Papas</span>
                    <span>{formatCurrency(product.secondaryPrice - product.price)}</span>
                </button>
            </div>
          )}

          {adicionales.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg text-brand-orange mb-3">Añadir Ingredientes</h3>
              <div className="space-y-2">
                {adicionales.map(adicional => (
                  <label key={adicional.id} htmlFor={`adicional-${adicional.id}`} className="flex justify-between items-center bg-brand-dark p-3 rounded-lg cursor-pointer hover:bg-opacity-80">
                    <div>
                      <span className="font-medium text-brand-light">{adicional.name}</span>
                      <span className="text-brand-gray ml-2">({formatCurrency(adicional.price)})</span>
                    </div>
                    <input
                      type="checkbox"
                      id={`adicional-${adicional.id}`}
                      checked={added.some(a => a.id === adicional.id)}
                      onChange={() => handleToggleAdicional(adicional)}
                      className="h-5 w-5 rounded-md bg-brand-surface border-brand-gray text-brand-orange focus:ring-brand-orange focus:ring-offset-brand-surface"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

         {product.baseIngredients && product.baseIngredients.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg text-brand-orange mb-3">Quitar Ingredientes</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.baseIngredients.map(ing => (
                  <button
                    key={ing}
                    onClick={() => handleToggleRemoved(ing)}
                    className={`p-3 text-center rounded-lg border-2 transition-all duration-200 ${removed.includes(ing) ? 'bg-red-500/20 border-red-500 text-red-400 line-through' : 'bg-brand-dark border-brand-dark text-brand-light'}`}
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
             <h3 className="font-bold text-lg text-brand-orange mb-3">Notas Especiales</h3>
             <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: la carne bien cocida, sin tomate..."
                className="w-full p-3 bg-brand-dark rounded-lg text-brand-light border border-brand-gray/50 focus:ring-brand-orange focus:border-brand-orange transition"
                rows={3}
             />
          </div>

        </div>
        <div className="p-6 mt-auto bg-brand-dark/50 border-t border-black/50">
          <button
            onClick={handleConfirmAddToCart}
            className="w-full flex justify-between items-center py-4 px-6 bg-brand-orange text-brand-dark font-bold rounded-xl hover:bg-opacity-90 transition-colors duration-300 text-lg"
          >
            <div className="flex items-center gap-2">
                <PlusIcon className="w-6 h-6" />
                <span>Agregar al Pedido</span>
            </div>
            <span>{formatCurrency(finalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;