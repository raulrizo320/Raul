import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, Category, CartItem, Adicional, OrderStatus, OrderType } from './types';
import { MENU_DATA } from './constants';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CustomizationModal from './components/CustomizationModal';
import DrinkModal from './components/DrinkModal';
import OrderTypeModal from './components/OrderTypeModal'; // Importar el nuevo modal
import { CartIcon, ChevronDownIcon, ShieldCheckIcon, CloseIcon } from './components/Icons';
import { db, firebaseConfig } from './firebaseConfig';
import { serverTimestamp, collection, addDoc } from 'firebase/firestore';


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

interface DeliveryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, phone: string) => void;
  isLoading: boolean;
}

const DeliveryInfoModal: React.FC<DeliveryInfoModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!name.trim() || !phone.trim()) {
            setError('Por favor, completa ambos campos.');
            return;
        }
        setError('');
        onConfirm(name, phone);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-brand-surface rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-brand-dark flex justify-between items-center">
                    <h2 className="text-2xl font-display font-extrabold text-brand-light">Información de Domicilio</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-brand-orange transition-colors">
                        <CloseIcon className="w-8 h-8" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-brand-gray">Necesitamos tus datos para notificarte cuando tu pedido esté listo.</p>
                    <div>
                        <label htmlFor="customerName" className="font-bold text-lg text-brand-orange mb-2 block">Nombre</label>
                        <input 
                            id="customerName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre completo"
                            className="w-full p-3 bg-brand-dark rounded-lg text-brand-light border border-brand-gray/50 focus:ring-brand-orange focus:border-brand-orange transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="customerPhone" className="font-bold text-lg text-brand-orange mb-2 block">Celular</label>
                        <input 
                            id="customerPhone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Tu número de celular"
                            className="w-full p-3 bg-brand-dark rounded-lg text-brand-light border border-brand-gray/50 focus:ring-brand-orange focus:border-brand-orange transition"
                        />
                    </div>
                     {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
                <div className="p-6 mt-auto bg-brand-dark/50 border-t border-black/50">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-4 px-6 bg-brand-orange text-brand-dark font-bold rounded-xl hover:bg-opacity-90 transition-colors duration-300 text-lg disabled:bg-brand-gray"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-6 w-6 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Confirmar Pedido'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};


const CustomerApp: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>(Category.Hamburguesas);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [customizingProduct, setCustomizingProduct] = useState<{ product: Product, variant: { label: string; price: number } } | null>(null);
    const [addingDrinkTo, setAddingDrinkTo] = useState<number | null>(null);
    const [isCategoryNavOpen, setIsCategoryNavOpen] = useState(false);
    const navTimerRef = useRef<number | null>(null);
    const [orderStatus, setOrderStatus] = useState<'idle' | 'placing' | 'success' | 'error'>('idle');
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false);


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
    
    const handleInitiateOrder = () => {
        if (cart.length === 0 || orderStatus === 'placing') return;
        
        if (firebaseConfig.apiKey.startsWith("AIzaSyXXX")) {
            alert("¡Error de Configuración!\n\nPor favor, abre el archivo 'firebaseConfig.ts' y reemplaza los datos de ejemplo con las credenciales reales de tu proyecto de Firebase para poder enviar pedidos.");
            return;
        }
        setIsOrderTypeModalOpen(true);
    };

    const placeOrder = async (orderData: any) => {
        setOrderStatus('placing');
         try {
            const orderItems = cart.map(item => ({
                productName: item.product.name,
                quantity: item.quantity,
                variant: item.variant.label,
                price: item.variant.price,
                added: item.customizations.added.map(a => a.name),
                removed: item.customizations.removed,
                notes: item.customizations.notes,
                comboDrink: item.comboDrink ? item.comboDrink.name : null,
            }));

            await addDoc(collection(db, "orders"), {
                items: orderItems,
                total: cartTotal,
                status: OrderStatus.Pending,
                createdAt: serverTimestamp(),
                ...orderData
            });

            setOrderStatus('success');
        } catch (error) {
            console.error("Error al enviar el pedido: ", error);
            if (error instanceof Error && error.message.includes("Missing or insufficient permissions")) {
                 alert("Error de permisos de Firebase: No se pudo conectar a la base de datos. Asegúrate de que las reglas de seguridad de Firestore permitan escrituras. Ve a tu consola de Firebase -> Firestore Database -> Reglas y permite la escritura (para desarrollo, puedes usar 'allow write: if true;').");
            } else {
                 alert("No se pudo enviar el pedido. Por favor, revisa la consola para más detalles e inténtalo de nuevo.");
            }
            setOrderStatus('error');
        } finally {
            setIsDeliveryModalOpen(false);
            setIsOrderTypeModalOpen(false);
        }
    }
    
    const handleConfirmDeliveryOrder = (name: string, phone: string) => {
        placeOrder({
            orderType: 'delivery' as OrderType,
            customerName: name,
            customerPhone: phone,
        });
    };
    
    const handleConfirmInStoreOrder = (tableNumber: number) => {
        placeOrder({
            orderType: 'in-store' as OrderType,
            tableNumber: tableNumber
        });
    };


    const handleResetOrder = () => {
        setCart([]);
        setOrderStatus('idle');
        setIsCartOpen(false);
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
                onPlaceOrder={handleInitiateOrder}
                onAddDrink={handleOpenDrinkModal}
                onRemoveDrink={handleRemoveDrink}
                onAddFries={handleAddFriesToCartItem}
                onRemoveFries={handleRemoveFriesFromCartItem}
                orderStatus={orderStatus}
                onResetOrder={handleResetOrder}
                confirmButtonText="Enviar Pedido"
            />

            <DrinkModal
                isOpen={addingDrinkTo !== null}
                onClose={() => setAddingDrinkTo(null)}
                drinks={drinks}
                onSelectDrink={handleSelectDrink}
            />

             <OrderTypeModal
                isOpen={isOrderTypeModalOpen}
                onClose={() => setIsOrderTypeModalOpen(false)}
                onConfirmDelivery={() => {
                    setIsOrderTypeModalOpen(false);
                    setIsDeliveryModalOpen(true);
                }}
                onConfirmInStore={(tableNumber) => {
                     setIsOrderTypeModalOpen(false);
                     handleConfirmInStoreOrder(tableNumber);
                }}
                isLoading={orderStatus === 'placing'}
            />

            <DeliveryInfoModal
                isOpen={isDeliveryModalOpen}
                onClose={() => {
                    setIsDeliveryModalOpen(false)
                    if(orderStatus === 'placing') setOrderStatus('idle');
                }}
                onConfirm={handleConfirmDeliveryOrder}
                isLoading={orderStatus === 'placing'}
            />
            
            {cartItemCount > 0 && orderStatus !== 'success' && (
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

export default CustomerApp;