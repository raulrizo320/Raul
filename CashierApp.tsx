import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db, firebaseConfig } from './firebaseConfig';
import { query, onSnapshot, orderBy, doc, updateDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { Order, OrderStatus, OrderType, Product, Category, CartItem, Adicional, OrderItem } from './types';
import { MENU_DATA } from './constants';
import OrderCard from './components/OrderCard';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CustomizationModal from './components/CustomizationModal';
import DrinkModal from './components/DrinkModal';
import Timer from './components/Timer';
import { BeakerIcon, BoltIcon, TableCellsIcon, TruckIcon, CartIcon, ChevronDownIcon } from './components/Icons';

// #region --- Vistas y Componentes del Panel ---

type View = 'ventaRapida' | 'mesas' | 'domicilios';

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);


interface VentaRapidaViewProps {
  selectedTable: number | null;
  onOrderPlaced: () => void;
  onSaveOrderLocally: (orderData: Omit<Order, 'id'>) => void;
}


const VentaRapidaView: React.FC<VentaRapidaViewProps> = ({ selectedTable, onOrderPlaced, onSaveOrderLocally }) => {
    // Esta vista replica la lógica del CustomerApp para actuar como un Punto de Venta (POS)
    const [activeCategory, setActiveCategory] = useState<Category>(Category.Hamburguesas);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [customizingProduct, setCustomizingProduct] = useState<{ product: Product, variant: { label: string; price: number } } | null>(null);
    const [addingDrinkTo, setAddingDrinkTo] = useState<number | null>(null);
    const [isCategoryNavOpen, setIsCategoryNavOpen] = useState(false);
    const navTimerRef = useRef<number | null>(null);

     useEffect(() => {
        if (isCategoryNavOpen) {
            navTimerRef.current = window.setTimeout(() => setIsCategoryNavOpen(false), 5000);
        }
        return () => { navTimerRef.current && clearTimeout(navTimerRef.current); };
    }, [isCategoryNavOpen]);

    const filteredProducts = useMemo(() => MENU_DATA.filter(p => p.category === activeCategory), [activeCategory]);
    const adicionales = useMemo(() => MENU_DATA.filter(p => p.category === Category.Adicionales) as Adicional[], []);
    const drinks = useMemo(() => MENU_DATA.filter(p => p.category === Category.Bebidas), []);

    const cartTotal = useMemo(() => cart.reduce((total, item) => {
        const addonsTotal = item.customizations.added.reduce((sum, ad) => sum + ad.price, 0);
        const drinkTotal = item.comboDrink ? item.comboDrink.price : 0;
        return total + (item.variant.price + addonsTotal + drinkTotal) * item.quantity;
    }, 0), [cart]);

    const cartItemCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

    // --- Lógica del Carrito (adaptada de CustomerApp) ---
    const handleAddToCart = (newItem: CartItem) => {
        setCart(prev => [...prev, newItem]);
        setIsCartOpen(true);
    };
    const handleAddToCartDirectly = (product: Product) => {
        const newItem: CartItem = { id: Date.now(), product, quantity: 1, variant: { label: product.name, price: product.price }, customizations: { added: [], removed: [], notes: '' } };
        setCart(prev => [...prev, newItem]);
        setIsCartOpen(true);
    };
    const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity <= 0) setCart(cart.filter(item => item.id !== itemId));
        else setCart(cart.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
    };
    const handleRemoveFromCart = (itemId: number) => setCart(cart.filter(item => item.id !== itemId));
    const handleOpenDrinkModal = (itemId: number) => setAddingDrinkTo(itemId);
    const handleSelectDrink = (drink: Product) => {
        if (addingDrinkTo) {
            setCart(cart.map(item => item.id === addingDrinkTo ? { ...item, comboDrink: drink } : item));
            setAddingDrinkTo(null);
        }
    };
    const handleRemoveDrink = (itemId: number) => setCart(cart.map(item => item.id === itemId ? (({ comboDrink, ...rest }) => rest)(item) : item));
    const handleAddFriesToCartItem = (itemId: number) => setCart(cart.map(item => (item.id === itemId && item.product.secondaryPrice) ? { ...item, variant: { label: item.product.secondaryPriceLabel!, price: item.product.secondaryPrice } } : item));
    const handleRemoveFriesFromCartItem = (itemId: number) => setCart(cart.map(item => (item.id === itemId && item.product.priceLabel) ? { ...item, variant: { label: item.product.priceLabel, price: item.product.price } } : item));
    
    // MODIFICADO: Esta función ahora guarda localmente en lugar de en Firebase.
    const handlePlaceOrder = () => {
        if (!selectedTable) {
            alert("No hay una mesa seleccionada para este pedido.");
            return;
        }

        const orderItems: OrderItem[] = cart.map(item => ({
            productName: item.product.name,
            quantity: item.quantity,
            variant: item.variant.label,
            price: item.variant.price,
            added: item.customizations.added.map(a => a.name),
            removed: item.customizations.removed,
            notes: item.customizations.notes,
            comboDrink: item.comboDrink ? item.comboDrink.name : null,
        }));

        const newOrderData: Omit<Order, 'id'> = {
            items: orderItems,
            total: cartTotal,
            status: OrderStatus.Pending,
            createdAt: new Date(), // Usamos la fecha actual directamente
            orderType: 'in-store' as OrderType,
            tableNumber: selectedTable,
        };
        
        onSaveOrderLocally(newOrderData); // Llama a la función del padre para guardar en el estado local
        onOrderPlaced(); // Navega de vuelta a la vista de mesas
    };
    
    // Se mantiene para el flujo del modal del carrito
    const handleResetOrder = () => {
        setCart([]);
        setIsCartOpen(false);
        onOrderPlaced();
    };

    return (
        <div className="relative">
            <header className="sticky top-[80px] bg-brand-dark/80 backdrop-blur-md z-20 shadow-lg shadow-black/20">
                <div className="container mx-auto px-4 pt-4 pb-2 text-center">
                     {selectedTable && (
                        <div className="text-2xl font-display font-extrabold text-brand-orange tracking-tight mb-2">
                            Creando Pedido para: Mesa {selectedTable}
                        </div>
                    )}
                     <h2 className="text-xl font-display font-semibold text-brand-light uppercase tracking-wider opacity-80">
                        {activeCategory}
                    </h2>
                </div>
                <div className="text-center">
                    <button onClick={() => setIsCategoryNavOpen(!isCategoryNavOpen)} className="inline-flex items-center gap-2 px-5 py-2 bg-brand-surface rounded-b-xl text-brand-gray hover:text-brand-orange">
                        <span className="font-semibold text-sm tracking-wider">CAMBIAR MENÚ</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isCategoryNavOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                <nav className={`border-t border-brand-surface mt-2 transition-all duration-300 ease-in-out overflow-hidden ${isCategoryNavOpen ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="container mx-auto px-2 py-3">
                         <div className="flex items-center gap-3 overflow-x-auto pb-2">
                            {Object.values(Category).map(category => (
                                <button key={category} onClick={() => { setActiveCategory(category); setIsCategoryNavOpen(false); }}
                                    className={`px-4 py-1.5 text-sm font-display font-semibold rounded-full whitespace-nowrap transition-all duration-300 ${activeCategory === category ? 'bg-brand-orange text-brand-dark shadow-md' : 'text-brand-gray hover:bg-brand-surface'}`}>
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product}
                            onCustomize={(p, v) => setCustomizingProduct({ product: p, variant: v })}
                            onAddToCartDirectly={handleAddToCartDirectly} />
                    ))}
                </div>
            </main>

            {customizingProduct && <CustomizationModal product={customizingProduct.product} variant={customizingProduct.variant} adicionales={adicionales} onClose={() => setCustomizingProduct(null)} onAddToCart={handleAddToCart} />}
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
                orderStatus={'idle'} // El estado de carga ya no es necesario para el guardado local
                onResetOrder={handleResetOrder} 
                confirmButtonText="Guardar Pedido"
            />
            <DrinkModal isOpen={addingDrinkTo !== null} onClose={() => setAddingDrinkTo(null)} drinks={drinks} onSelectDrink={handleSelectDrink} />
            
            {cartItemCount > 0 && (
                 <div className="sticky bottom-6 left-0 right-0 p-4 bg-transparent z-40 pointer-events-none">
                     <div className="w-full max-w-lg mx-auto pointer-events-auto">
                        <button onClick={() => setIsCartOpen(true)} className="w-full flex items-center justify-between py-4 px-6 bg-brand-surface text-brand-light rounded-2xl shadow-lg border border-brand-dark">
                            <div className="flex items-center gap-3">
                                <CartIcon className="w-6 h-6 text-brand-orange"/>
                                <span className="bg-brand-orange text-brand-dark text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{cartItemCount}</span>
                                <span className="font-bold text-lg">Ver Pedido</span>
                            </div>
                            <span className="font-bold text-lg">{formatCurrency(cartTotal)}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const MesasView: React.FC<{ orders: Order[], onSelectTable: (tableNumber: number) => void }> = ({ orders, onSelectTable }) => {
    const activeTableOrders = useMemo(() => {
        const tableMap = new Map<number, Order>();
        const inStoreOrders = orders.filter(o => o.orderType === 'in-store' && o.status !== OrderStatus.Completed);
        for (const order of inStoreOrders) {
            if (order.tableNumber) {
                tableMap.set(order.tableNumber, order);
            }
        }
        return tableMap;
    }, [orders]);
    
    return (
        <div className="p-6">
            <h2 className="text-3xl font-display font-bold text-brand-light mb-6">Estado de las Mesas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(tableNumber => {
                    const order = activeTableOrders.get(tableNumber);
                    const isOccupied = !!order;

                    return (
                        <button 
                            key={tableNumber} 
                            onClick={!isOccupied ? () => onSelectTable(tableNumber) : undefined}
                            className={`bg-brand-dark rounded-lg p-4 flex flex-col items-center justify-center aspect-square shadow-lg border-2 transition-all duration-300 ${
                                isOccupied 
                                ? 'border-brand-orange cursor-default' 
                                : 'border-brand-surface hover:border-brand-orange hover:scale-105 cursor-pointer'
                            }`}
                        >
                            <span className="text-3xl font-bold text-brand-light mb-2">Mesa {tableNumber}</span>
                             {isOccupied ? (
                                <div className="text-center">
                                    <div className="text-lg font-bold text-brand-orange mb-2">{formatCurrency(order.total)}</div>
                                    <Timer startTime={order.createdAt} />
                                    <span className="text-xs font-semibold bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-full mt-3 block">Ocupada</span>
                                </div>
                            ) : (
                                <>
                                    <TableCellsIcon className="w-12 h-12 text-brand-gray mb-2" />
                                    <span className="text-sm font-semibold bg-green-500/20 text-green-400 px-3 py-1 rounded-full mt-2">Libre</span>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const DomiciliosView: React.FC<{ orders: Order[], onUpdateStatus: (id: string, status: OrderStatus) => void }> = ({ orders, onUpdateStatus }) => {
    const ordersByStatus = useMemo(() => {
        const deliveryOrders = orders.filter(o => o.orderType === 'delivery');
        return {
            [OrderStatus.Pending]: deliveryOrders.filter(o => o.status === OrderStatus.Pending),
            [OrderStatus.Preparing]: deliveryOrders.filter(o => o.status === OrderStatus.Preparing),
            [OrderStatus.Ready]: deliveryOrders.filter(o => o.status === OrderStatus.Ready),
            [OrderStatus.Completed]: deliveryOrders.filter(o => o.status === OrderStatus.Completed)
                .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)),
        };
    }, [orders]);

    const getStatusColor = (status: OrderStatus) => ({
        [OrderStatus.Pending]: 'border-t-blue-500', [OrderStatus.Preparing]: 'border-t-yellow-500',
        [OrderStatus.Ready]: 'border-t-green-500', [OrderStatus.Completed]: 'border-t-gray-500',
    }[status]);

    const getStatusTitle = (status: OrderStatus) => ({
        [OrderStatus.Pending]: 'Nuevos Pedidos', [OrderStatus.Preparing]: 'En Preparación',
        [OrderStatus.Ready]: 'Listos para Entregar', [OrderStatus.Completed]: 'Completados Hoy',
    }[status]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {[OrderStatus.Pending, OrderStatus.Preparing, OrderStatus.Ready, OrderStatus.Completed].map(status => (
                <div key={status} className="bg-brand-dark rounded-lg">
                    <div className={`p-4 border-t-8 rounded-t-lg ${getStatusColor(status)}`}>
                        <h2 className="text-xl font-display font-bold text-brand-light flex items-center">
                            {getStatusTitle(status)}
                            <span className="ml-2 bg-brand-surface text-brand-orange font-mono text-sm rounded-full w-7 h-7 flex items-center justify-center">
                                {ordersByStatus[status].length}
                            </span>
                        </h2>
                    </div>
                    <div className="p-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
                        {ordersByStatus[status].length === 0 
                            ? <p className="text-brand-gray text-center pt-8">No hay pedidos aquí.</p>
                            : ordersByStatus[status].map(order => <OrderCard key={order.id} order={order} onUpdateStatus={onUpdateStatus} />)
                        }
                    </div>
                </div>
            ))}
        </div>
    );
};

// #endregion

const CashierApp: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('domicilios');
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<number | null>(null);


  useEffect(() => {
    if (firebaseConfig.apiKey.startsWith("AIzaSyXXX")) {
        setError("Firebase no está configurado. La aplicación funcionará en modo local. Los pedidos de domicilio no aparecerán aquí.");
        setLoading(false);
        // No retornamos para permitir que la app funcione localmente.
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const fetchedOrders: Order[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                items: data.items,
                total: data.total,
                status: data.status,
                createdAt: data.createdAt.toDate(),
                completedAt: data.completedAt ? data.completedAt.toDate() : undefined,
                orderType: data.orderType || 'in-store',
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                tableNumber: data.tableNumber,
            };
        }).filter(order => order.status !== OrderStatus.Completed || order.createdAt >= startOfToday);
        
        // Mantenemos los pedidos locales que aún no están en Firebase
        setOrders(prevOrders => {
            const localOnly = prevOrders.filter(p => p.id.startsWith('local_'));
            const fetchedIds = new Set(fetchedOrders.map(f => f.id));
            const existingLocal = localOnly.filter(l => !fetchedIds.has(l.id));
            return [...fetchedOrders, ...existingLocal];
        });

        setLoading(false);
      } catch (err) {
          console.error("Error processing snapshot:", err)
          setError("Hubo un problema al procesar los pedidos.");
          setLoading(false);
      }
    }, (err) => {
        console.error("Error fetching orders:", err);
        if (!firebaseConfig.apiKey.startsWith("AIzaSyXXX")) {
            setError("No se pudo conectar a la base de datos. Revisa tu conexión y la configuración de Firebase.");
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleSelectTable = (tableNumber: number) => {
    setSelectedTableForOrder(tableNumber);
    setActiveView('ventaRapida');
  };

  const handleOrderPlaced = () => {
    setSelectedTableForOrder(null);
    setActiveView('mesas');
  }

  const handleSaveOrderLocally = (orderData: Omit<Order, 'id'>) => {
    const mockOrder: Order = {
        ...orderData,
        id: `local_${Date.now()}`, // ID temporal para uso local
    };
    setOrders(prevOrders => [mockOrder, ...prevOrders]);
  };


  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
      // Si es un pedido local, solo actualizamos el estado
      if (orderId.startsWith('local_')) {
          setOrders(orders.map(o => o.id === orderId ? {...o, status: newStatus} : o));
          return;
      }
      // Si no, lo actualizamos en Firebase
      try {
          const orderRef = doc(db, "orders", orderId);
          const updateData: { status: OrderStatus; completedAt?: any } = { status: newStatus };
          if (newStatus === OrderStatus.Completed) updateData.completedAt = serverTimestamp();
          await updateDoc(orderRef, updateData);
      } catch (err) {
          console.error("Error updating order status:", err);
          alert("No se pudo actualizar el estado del pedido.");
      }
  };

  const handleGenerateTestOrder = async () => {
    // Esta función sí necesita Firebase. Mostramos alerta si no está configurado.
    if (firebaseConfig.apiKey.startsWith("AIzaSyXXX")) {
        alert("¡Error de Configuración!\n\nReemplaza los datos de ejemplo en 'firebaseConfig.ts' para poder generar pedidos de prueba.");
        return;
    }
    try {
        await addDoc(collection(db, "orders"), {
            createdAt: serverTimestamp(), status: OrderStatus.Pending, total: 25500,
            orderType: 'delivery' as OrderType, customerName: 'Cliente de Prueba', customerPhone: '3001234567',
            items: [{ productName: "Especial Bacon", quantity: 1, variant: "Con Papa", price: 21000, added: ["Tocineta"], removed: ["Cebolla Grille"], notes: "La carne bien cocida", comboDrink: "Coca-Cola" }]
        });
    } catch (err) {
        console.error("Error generating test order:", err);
        alert("No se pudo generar el pedido de prueba.");
    }
  };

  const getNavButtonClasses = (viewName: View) => {
    const base = "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-lg font-semibold transition-colors duration-200";
    return activeView === viewName ? `${base} bg-brand-orange text-brand-dark` : `${base} text-brand-light hover:bg-brand-surface`;
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-brand-surface flex items-center justify-center text-center">
            <div>
                <svg className="animate-spin h-10 w-10 text-brand-orange mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-2xl font-bold text-brand-light mt-4">Conectando a la cocina...</h2>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <header className="bg-brand-dark shadow-lg sticky top-0 z-30 flex-shrink-0">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-brand-orange tracking-tight">Panel de Control - Alex Burger</h1>
            <p className="text-brand-gray">Gestión de Pedidos y Ventas</p>
          </div>
          {activeView === 'domicilios' && (
            <button onClick={handleGenerateTestOrder} className="flex items-center gap-2 px-4 py-2 bg-brand-orange/20 text-brand-orange font-semibold rounded-lg hover:bg-brand-orange/30">
              <BeakerIcon className="w-5 h-5" />
              <span>Generar Domicilio de Prueba</span>
            </button>
          )}
        </div>
      </header>
      <div className="flex flex-grow overflow-hidden">
        <aside className="w-72 bg-brand-surface/30 p-4 shadow-lg flex-shrink-0 overflow-y-auto border-r border-black/20">
            <h2 className="text-sm font-bold text-brand-gray uppercase tracking-wider mb-4 px-2">Opciones</h2>
            <nav className="flex flex-col gap-2">
                <button className={getNavButtonClasses('ventaRapida')} onClick={() => { setActiveView('ventaRapida'); setSelectedTableForOrder(null); }}>
                    <BoltIcon className="w-6 h-6"/><span>Venta Rápida</span>
                </button>
                <button className={getNavButtonClasses('mesas')} onClick={() => { setActiveView('mesas'); setSelectedTableForOrder(null); }}>
                    <TableCellsIcon className="w-6 h-6"/><span>Mesas</span>
                </button>
                <button className={getNavButtonClasses('domicilios')} onClick={() => { setActiveView('domicilios'); setSelectedTableForOrder(null); }}>
                    <TruckIcon className="w-6 h-6"/><span>Domicilios</span>
                </button>
            </nav>
        </aside>

        <main className="flex-grow overflow-y-auto bg-brand-surface">
            {error && (
                <div className={`p-4 text-center m-6 rounded-lg ${firebaseConfig.apiKey.startsWith("AIzaSyXXX") ? 'bg-yellow-900/50 border border-yellow-700 text-yellow-300' : 'bg-red-900/50 border border-red-700 text-red-300'}`}>
                    <h2 className="text-xl font-bold">{firebaseConfig.apiKey.startsWith("AIzaSyXXX") ? "Aviso de Configuración" : "Error de Conexión"}</h2>
                    <p className="mt-1">{error}</p>
                </div>
            )}

            {activeView === 'ventaRapida' && <VentaRapidaView selectedTable={selectedTableForOrder} onOrderPlaced={handleOrderPlaced} onSaveOrderLocally={handleSaveOrderLocally} />}
            {activeView === 'mesas' && <MesasView orders={orders} onSelectTable={handleSelectTable} />}
            {activeView === 'domicilios' && <DomiciliosView orders={orders} onUpdateStatus={handleUpdateOrderStatus} />}
        </main>
      </div>
    </div>
  );
};

export default CashierApp;