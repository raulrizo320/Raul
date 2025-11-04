
import React from 'react';
import { CartItem } from '../types';
import { CloseIcon, PlusIcon, MinusIcon, TrashIcon, CartIcon } from './Icons';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onPlaceOrder: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(value);
};

const CartItemDetails: React.FC<{ item: CartItem, onUpdateQuantity: (id: number, q: number) => void, onRemoveItem: (id: number) => void }> = ({ item, onUpdateQuantity, onRemoveItem }) => (
    <div className="flex items-start gap-4 py-4">
        <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover" />
        <div className="flex-grow">
            <h4 className="font-bold text-brand-light">{item.product.name}</h4>
            {item.variant.label && <p className="text-sm text-brand-gray capitalize">{item.variant.label}</p>}
            <p className="text-sm text-brand-orange font-semibold">{formatCurrency(item.variant.price)}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center bg-brand-dark rounded-full">
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 text-brand-gray hover:text-brand-orange"><MinusIcon className="w-5 h-5"/></button>
                <span className="px-2 font-bold text-sm text-brand-light">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 text-brand-gray hover:text-brand-orange"><PlusIcon className="w-5 h-5"/></button>
            </div>
            <button onClick={() => onRemoveItem(item.id)} className="text-brand-gray hover:text-brand-orange"><TrashIcon className="w-5 h-5"/></button>
        </div>
    </div>
);


const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onPlaceOrder }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
    const total = subtotal;

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-surface text-brand-light shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 flex justify-between items-center border-b border-brand-dark">
                        <h2 className="text-2xl font-display font-extrabold text-brand-light">Tu Pedido</h2>
                        <button onClick={onClose} className="text-brand-gray hover:text-brand-orange transition-colors">
                            <CloseIcon className="w-8 h-8" />
                        </button>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                            <CartIcon className="w-24 h-24 text-brand-dark mb-4"/>
                            <h3 className="text-xl font-bold text-gray-400">Tu carrito está vacío</h3>
                            <p className="text-brand-gray mt-2">Agrega productos del menú para empezar tu pedido.</p>
                        </div>
                    ) : (
                        <div className="flex-grow overflow-y-auto px-6 divide-y divide-brand-dark">
                           {cartItems.map(item => (
                               <CartItemDetails key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemoveItem={onRemoveItem} />
                           ))}
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="p-6 bg-brand-dark border-t-2 border-black/50 shadow-top-lg">
                            <div className="flex justify-between items-center text-lg mb-4">
                                <span className="text-brand-gray">Subtotal</span>
                                <span className="font-bold text-brand-light">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-2xl font-bold mb-6">
                                <span className="text-brand-light">Total</span>
                                <span className="text-brand-orange">{formatCurrency(total)}</span>
                            </div>
                            <button onClick={onPlaceOrder} className="w-full py-4 px-6 bg-brand-orange text-brand-dark font-bold rounded-xl text-lg hover:bg-opacity-90 transition-colors duration-300">
                                Realizar Pedido
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Cart;
