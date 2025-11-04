import React, { useState } from 'react';
import { Product, Category } from '../types';
import { PlusIcon, ChevronDownIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  onCustomize: (product: Product, variant: { label: string; price: number }) => void;
  onAddToCartDirectly: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCustomize, onAddToCartDirectly }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  const mainPriceFormatted = formatCurrency(product.price);

  return (
    <div className="bg-brand-surface rounded-2xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="relative cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <h3 className="text-2xl font-display font-extrabold text-brand-light pr-4 flex-grow">{product.name}</h3>
            {product.description && (
                <ChevronDownIcon className={`w-6 h-6 text-brand-gray flex-shrink-0 mt-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            )}
        </div>

        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-screen' : 'max-h-0'}`}>
             {product.description && <p className="text-brand-gray mt-2">{product.description}</p>}
       
            <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-brand-dark">
                {product.secondaryPrice && product.secondaryPriceLabel && product.priceLabel ? (
                    <>
                        <button
                            onClick={() => onCustomize(product, { label: product.priceLabel as string, price: product.price })}
                            className="w-full flex items-center justify-between py-3 px-4 bg-brand-orange/20 text-brand-orange font-bold rounded-xl hover:bg-brand-orange/30 transition-colors duration-300"
                        >
                            <span><PlusIcon className="w-5 h-5 inline-block mr-2"/> {product.priceLabel}</span>
                            <span>{mainPriceFormatted}</span>
                        </button>
                         <button
                            onClick={() => onCustomize(product, { label: product.secondaryPriceLabel, price: product.secondaryPrice })}
                            className="w-full flex items-center justify-between py-3 px-4 bg-brand-orange/20 text-brand-orange font-bold rounded-xl hover:bg-brand-orange/30 transition-colors duration-300"
                        >
                            <span><PlusIcon className="w-5 h-5 inline-block mr-2"/> {product.secondaryPriceLabel}</span>
                            <span>{formatCurrency(product.secondaryPrice)}</span>
                        </button>
                    </>
                ) : (
                     <button
                        onClick={() => {
                            if (product.category === Category.Bebidas || product.category === Category.Adicionales) {
                                onAddToCartDirectly(product);
                            } else {
                                onCustomize(product, { label: product.name, price: product.price });
                            }
                        }}
                        className="w-full flex items-center justify-between py-3 px-4 bg-brand-orange text-brand-dark font-bold rounded-xl hover:bg-opacity-90 transition-colors duration-300"
                    >
                        <span>
                            <PlusIcon className="w-5 h-5 inline-block mr-2" />
                            Agregar
                        </span>
                        <span>{mainPriceFormatted}</span>
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;