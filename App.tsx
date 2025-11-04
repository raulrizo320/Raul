
import React, { useState, useMemo } from 'react';
import { Product, Category, CartItem } from './types';
import { MENU_DATA } from './constants';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import { CartIcon } from './components/Icons';

const App: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>(Category.Hamburguesas);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        return MENU_DATA.filter(p => p.category === activeCategory);
    }, [activeCategory]);
    
    const handleAddToCart = (product: Product, variant: { label: string; price: number }) => {
        const existingItemIndex = cart.findIndex(item => 
            item.product.id === product.id && item.variant.label === variant.label
        );

        if (existingItemIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity++;
            setCart(updatedCart);
        } else {
            const newItem: CartItem = {
                id: Date.now(),
                product,
                quantity: 1,
                variant,
            };
            setCart(prevCart => [...prevCart, newItem]);
        }
        setIsCartOpen(true);
    };

    const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveFromCart(itemId);
        } else {
            setCart(cart.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
        }
    };
    
    const handleRemoveFromCart = (itemId: number) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const cartItemCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + item.variant.price * item.quantity, 0);
    }, [cart]);
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };
    
    const handlePlaceOrder = () => {
        const phoneNumber = "573112488013"; // Updated phone number from the menu
        let message = "Hola Alex Burger, quiero hacer el siguiente pedido:\n\n";
        cart.forEach(item => {
            const variantLabel = item.variant.label ? ` (${item.variant.label})` : '';
            message += `*${item.quantity}x ${item.product.name}${variantLabel}* (${formatCurrency(item.variant.price * item.quantity)})\n`;
        });
        message += `\n*Total del Pedido: ${formatCurrency(cartTotal)}*`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-brand-dark text-brand-light pb-32">
            <header className="sticky top-0 bg-brand-dark/80 backdrop-blur-md z-30 shadow-lg shadow-black/20">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-4xl font-display font-extrabold text-brand-orange text-center tracking-tight">
                        ALEX BURGER
                    </h1>
                </div>
                <nav className="overflow-x-auto border-t border-b border-brand-surface">
                    <div className="flex items-center justify-center space-x-2 sm:space-x-4 p-2">
                        {Object.values(Category).map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 font-display font-semibold rounded-full whitespace-nowrap transition-all duration-300 ${activeCategory === category ? 'bg-brand-orange text-brand-dark shadow-md' : 'text-brand-gray hover:bg-brand-surface'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </main>

            <Cart 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cartItems={cart} 
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onPlaceOrder={handlePlaceOrder}
            />
            
            {cartItemCount > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent z-40 pointer-events-none">
                     <div className="w-full max-w-lg mx-auto pointer-events-auto">
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="w-full flex items-center justify-between py-4 px-6 bg-brand-surface text-brand-light rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 border border-brand-dark"
                        >
                            <div className="flex items-center gap-3">
                                <CartIcon className="w-6 h-6 text-brand-orange"/>
                                <span className="bg-brand-orange text-brand-dark text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{cartItemCount}</span>
                                <span className="font-bold text-lg">Ver mi pedido</span>
                            </div>
                            <span className="font-bold text-lg">{formatCurrency(cartTotal)}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
