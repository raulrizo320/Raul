import React from 'react';
import { Product } from '../types';
import { CloseIcon } from './Icons';

interface DrinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  drinks: Product[];
  onSelectDrink: (drink: Product) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
};

const DrinkModal: React.FC<DrinkModalProps> = ({ isOpen, onClose, drinks, onSelectDrink }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-brand-surface rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-brand-dark flex justify-between items-center">
            <h2 className="text-2xl font-display font-extrabold text-brand-light">Elige tu Bebida</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-brand-orange transition-colors">
                <CloseIcon className="w-8 h-8" />
            </button>
        </div>
        <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {drinks.map(drink => (
                    <button 
                        key={drink.id} 
                        onClick={() => onSelectDrink(drink)}
                        className="bg-brand-dark rounded-lg overflow-hidden text-left hover:bg-black/40 transition-all duration-300 transform hover:scale-105"
                    >
                        <img src={drink.image} alt={drink.name} className="w-full h-24 object-cover"/>
                        <div className="p-3">
                            <h4 className="font-bold text-brand-light">{drink.name}</h4>
                            <p className="text-sm text-brand-gray">{drink.description}</p>
                            <p className="font-semibold text-brand-orange mt-1">{formatCurrency(drink.price)}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkModal;