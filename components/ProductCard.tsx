
import React from 'react';
import { Product } from '../types';
import { PlusIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: { label: string; price: number }) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
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
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
        {!product.secondaryPrice && (
            <div className="absolute top-0 right-0 bg-brand-orange text-brand-dark font-bold text-lg py-2 px-4 rounded-bl-2xl">
                {mainPriceFormatted}
            </div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-display font-extrabold text-brand-light">{product.name}</h3>
        {product.description && <p className="text-brand-gray mt-2 flex-grow">{product.description}</p>}
        <div className="mt-6 flex flex-col gap-3">
            {product.secondaryPrice && product.secondaryPriceLabel && product.priceLabel ? (
                <>
                    <button
                        onClick={() => onAddToCart(product, { label: product.priceLabel as string, price: product.price })}
                        className="w-full flex items-center justify-between py-3 px-4 bg-brand-orange/20 text-brand-orange font-bold rounded-xl hover:bg-brand-orange/30 transition-colors duration-300"
                    >
                        <span><PlusIcon className="w-5 h-5 inline-block mr-2"/> {product.priceLabel}</span>
                        <span>{mainPriceFormatted}</span>
                    </button>
                     <button
                        onClick={() => onAddToCart(product, { label: product.secondaryPriceLabel, price: product.secondaryPrice })}
                        className="w-full flex items-center justify-between py-3 px-4 bg-brand-orange/20 text-brand-orange font-bold rounded-xl hover:bg-brand-orange/30 transition-colors duration-300"
                    >
                        <span><PlusIcon className="w-5 h-5 inline-block mr-2"/> {product.secondaryPriceLabel}</span>
                        <span>{formatCurrency(product.secondaryPrice)}</span>
                    </button>
                </>
            ) : (
                 <button
                    onClick={() => onAddToCart(product, { label: '', price: product.price })}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-orange text-brand-dark font-bold rounded-xl hover:bg-opacity-90 transition-colors duration-300"
                >
                    <PlusIcon className="w-5 h-5" />
                    Agregar
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
