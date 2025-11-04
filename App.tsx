import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, Category, CartItem, Adicional } from './types';
import { MENU_DATA } from './constants';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CustomizationModal from './components/CustomizationModal';
import DrinkModal from './components/DrinkModal';
import { CartIcon, ChevronDownIcon, ShieldCheckIcon } from './components/Icons';

// Helper to compare customizations
const areCustomizationsEqual = (custA: CartItem['customizations'], custB: CartItem['customizations']) => {
    if (custA.notes !== custB.notes) return false;
    if (custA.removed.length !== custB.removed.length || !custA.removed.every(item => custB.removed.includes(item))) return false;
    if (custA.added.length !== custB.added.length || !custA.added.every(item => custB.added.find(bItem => bItem.id === item.id))) return false;
    return true;
};

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-dark py-8 mt-6">
            <div className="container mx-auto px-4 text-center text-brand-gray">
                <div className="flex justify-center mb-3">
                    <ShieldCheckIcon className="w-12 h-12 text-brand-orange" />
                </div>
                <h3 className="text-2xl font-display font-bold text-brand-light mb-2">
                    Preparado al Momento, Para Ti
                </h3>
                <p className="max-w-2xl mx-auto">
                    Preparamos tu pedido con rapidez porque sabemos que el hambre no espera.
                    Todos nuestros productos son frescos y se preparan al instante para garantizar el mejor sabor.
                </p>
                <p className="mt-2 font-semibold text-brand-light/90">
                    En Alex Burger, la calidad y tu satisfacción son nuestro ingrediente principal.
                </p>
            </div>
        </footer>
    );
};


const App: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>(Category.Hamburguesas);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [customizingProduct, setCustomizingProduct] = useState<{ product: Product, variant: { label: string; price: number } } | null>(null);
    const [addingDrinkTo, setAddingDrinkTo] = useState<number | null>(null);
    const [isCategoryNavOpen, setIsCategoryNavOpen] = useState(false);
    const navTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isCategoryNavOpen) {
            if (navTimerRef.current) {
                clearTimeout(navTimerRef.current);
            }
            navTimerRef.current = window.setTimeout(() => {
                setIsCategoryNavOpen(false);
            }, 5000); // Auto-hide after 5 seconds
        }

        return () => {
            if (navTimerRef.current) {
                clearTimeout(navTimerRef.current);
            }
        };
    }, [isCategoryNavOpen]);


    const filteredProducts = useMemo(() => {
        return MENU_DATA.filter(p => p.category === activeCategory);
    }, [activeCategory]);

    const adicionales = useMemo(() => {
        return MENU_DATA.filter(p => p.category === Category.Adicionales) as Adicional[];
    }, []);

    const drinks = useMemo(() => {
        return MENU_DATA.filter(p => p.category === Category.Bebidas);
    }, []);
    
    const handleOpenCustomizeModal = (product: Product, variant: { label: string; price: number }) => {
        setCustomizingProduct({ product, variant });
    };

    const handleAddToCart = (newItem: CartItem) => {
        const existingItemIndex = cart.findIndex(item => 
            item.product.id === newItem.product.id &&
            item.variant.label === newItem.variant.label &&
            areCustomizationsEqual(item.customizations, newItem.customizations) &&
            !item.comboDrink
        );

        if (existingItemIndex > -1) {
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity++;
            setCart(updatedCart);
        } else {
            setCart(prevCart => [...prevCart, newItem]);
        }
        setIsCartOpen(true);
    };

    const handleAddToCartDirectly = (product: Product) => {
        const existingItemIndex = cart.findIndex(item => 
            item.product.id === product.id &&
            item.customizations.added.length === 0 &&
            item.customizations.removed.length === 0 &&
            item.customizations.notes.trim() === '' &&
            !item.comboDrink
        );
    
        if (existingItemIndex > -1) {
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity++;
            setCart(updatedCart);
        } else {
            const newItem: CartItem = {
                id: Date.now(),
                product,
                quantity: 1,
                variant: { label: product.name, price: product.price },
                customizations: {
                    added: [],
                    removed: [],
                    notes: '',
                }
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
    
    const handleOpenDrinkModal = (itemId: number) => {
        setAddingDrinkTo(itemId);
        setIsCartOpen(true); // Ensure cart stays open
    };

    const handleSelectDrink = (drink: Product) => {
        if (!addingDrinkTo) return;
        setCart(cart.map(item => item.id === addingDrinkTo ? { ...item, comboDrink: drink } : item));
        setAddingDrinkTo(null);
    };

    const handleRemoveDrink = (itemId: number) => {
        setCart(cart.map(item => {
            if (item.id === itemId) {
                const { comboDrink, ...rest } = item;
                return rest;
            }
            return item;
        }));
    };

    const handleAddFriesToCartItem = (itemId: number) => {
        setCart(cart.map(item => {
            if (item.id === itemId && item.product.secondaryPrice && item.product.secondaryPriceLabel) {
                return {
                    ...item,
                    variant: {
                        label: item.product.secondaryPriceLabel,
                        price: item.product.secondaryPrice,
                    }
                };
            }
            return item;
        }));
    };

    const handleRemoveFriesFromCartItem = (itemId: number) => {
        setCart(cart.map(item => {
            if (item.id === itemId && item.product.priceLabel) {
                return {
                    ...item,
                    variant: {
                        label: item.product.priceLabel,
                        price: item.product.price,
                    }
                };
            }
            return item;
        }));
    };

    const cartItemCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const addonsTotal = item.customizations.added.reduce((sum, ad) => sum + ad.price, 0);
            const drinkTotal = item.comboDrink ? item.comboDrink.price : 0;
            const itemTotal = (item.variant.price + addonsTotal + drinkTotal) * item.quantity;
            return total + itemTotal;
        }, 0);
    }, [cart]);
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };
    
    const handlePlaceOrder = () => {
        const phoneNumber = "573208550880";
        let message = "Hola Alex Burger, quiero hacer el siguiente pedido:\n\n";
        cart.forEach(item => {
            const variantLabel = item.variant.label !== item.product.name ? ` (${item.variant.label})` : '';
            const addonsTotal = item.customizations.added.reduce((sum, ad) => sum + ad.price, 0);
            const drinkTotal = item.comboDrink ? item.comboDrink.price : 0;
            const itemPrice = item.variant.price + addonsTotal + drinkTotal;

            message += `*${item.quantity}x ${item.product.name}${variantLabel}* (${formatCurrency(itemPrice * item.quantity)})\n`;

            if (item.customizations.added.length > 0) {
                message += `  Adiciones: ${item.customizations.added.map(a => a.name).join(', ')}\n`;
            }
            if (item.customizations.removed.length > 0) {
                message += `  Sin: ${item.customizations.removed.join(', ')}\n`;
            }
            if (item.comboDrink) {
                message += `  Bebida: ${item.comboDrink.name}\n`;
            }
            if (item.customizations.notes) {
                message += `  Nota: ${item.customizations.notes}\n`;
            }
        });
        message += `\n*Total del Pedido: ${formatCurrency(cartTotal)}*`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-brand-dark text-brand-light pb-32">
            <header className="sticky top-0 bg-brand-dark/80 backdrop-blur-md z-30 shadow-lg shadow-black/20">
                <div className="container mx-auto px-4 pt-4 pb-2">
                    <h1 className="text-4xl font-display font-extrabold text-brand-orange text-center tracking-tight">
                        ALEX BURGER
                    </h1>
                     <h2 className="text-xl font-display font-semibold text-brand-light text-center mt-2 uppercase tracking-wider opacity-80">
                        {activeCategory}
                    </h2>
                </div>
                <div className="text-center">
                    <button
                        onClick={() => setIsCategoryNavOpen(!isCategoryNavOpen)}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-brand-surface rounded-b-xl text-brand-gray hover:text-brand-orange transition-all duration-300 shadow-lg"
                    >
                        <span className="font-semibold text-sm tracking-wider">CAMBIAR MENÚ</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isCategoryNavOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                <nav className={`border-t border-brand-surface mt-2 transition-all duration-300 ease-in-out overflow-hidden ${isCategoryNavOpen ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="container mx-auto px-2 py-3">
                         <div className="flex items-center gap-3 overflow-x-auto pb-2">
                            {Object.values(Category).map(category => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setActiveCategory(category);
                                        setIsCategoryNavOpen(false);
                                    }}
                                    className={`px-4 py-1.5 text-sm font-display font-semibold rounded-full whitespace-nowrap transition-all duration-300 ${activeCategory === category ? 'bg-brand-orange text-brand-dark shadow-md' : 'text-brand-gray hover:bg-brand-surface'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onCustomize={handleOpenCustomizeModal}
                            onAddToCartDirectly={handleAddToCartDirectly}
                        />
                    ))}
                </div>
            </main>

            <Footer />

            {customizingProduct && (
                 <CustomizationModal
                    product={customizingProduct.product}
                    variant={customizingProduct.variant}
                    adicionales={adicionales}
                    onClose={() => setCustomizingProduct(null)}
                    onAddToCart={handleAddToCart}
                />
            )}

            <Cart 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cartItems={cart} 
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onPlaceOrder={handlePlaceOrder}
                onAddDrink={handleOpenDrinkModal}
                onRemoveDrink={handleRemoveDrink}
                onAddFries={handleAddFriesToCartItem}
                onRemoveFries={handleRemoveFriesFromCartItem}
            />

            <DrinkModal
                isOpen={addingDrinkTo !== null}
                onClose={() => setAddingDrinkTo(null)}
                drinks={drinks}
                onSelectDrink={handleSelectDrink}
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