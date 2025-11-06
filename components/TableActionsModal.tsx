import React from 'react';
import { Order, OrderItem, Category } from '../types';
import { CloseIcon, PlusIcon, CurrencyDollarIcon, TrashIcon, MinusIcon } from './Icons';
import Timer from './Timer';
import { MENU_DATA } from '../constants';

interface TableActionsModalProps {
  order: Order | null;
  onClose: () => void;
  onAddItems: () => void;
  onMarkAsCompleted: () => void;
  onCancelOrder: () => void;
  onUpdateItemQuantity: (itemIndex: number, newQuantity: number) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
};

const getFullItemPrice = (item: OrderItem): number => {
    let fullPrice = item.price; 
    
    item.added.forEach(addonName => {
        const addonProduct = MENU_DATA.find(p => p.category === Category.Adicionales && p.name === addonName);
        if (addonProduct) {
            fullPrice += addonProduct.price;
        }
    });

    if (item.comboDrink) {
        const drinkProduct = MENU_DATA.find(p => p.category === Category.Bebidas && p.name === item.comboDrink);
        if (drinkProduct) {
            fullPrice += drinkProduct.price;
        }
    }
    return fullPrice;
};


const TableActionsModal: React.FC<TableActionsModalProps> = ({ order, onClose, onAddItems, onMarkAsCompleted, onCancelOrder, onUpdateItemQuantity }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-brand-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-brand-dark flex justify-between items-center flex-shrink-0">
            <div>
                <h2 className="text-2xl font-display font-extrabold text-brand-light">Gestionar Mesa {order.tableNumber}</h2>
                <p className="text-brand-gray">Pedido #{order.id.substring(0, 5).toUpperCase()}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-brand-orange transition-colors">
                <CloseIcon className="w-8 h-8" />
            </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
            <div className="bg-brand-dark rounded-lg p-4 mb-4 flex justify-between items-center">
                <div>
                    <span className="text-sm text-brand-gray">Total Actual</span>
                    <p className="text-3xl font-bold text-brand-orange">{formatCurrency(order.total)}</p>
                </div>
                <div>
                    <span className="text-sm text-brand-gray text-right block">Tiempo Activo</span>
                    <Timer startTime={order.createdAt} />
                </div>
            </div>

            <h4 className="font-bold text-lg text-brand-orange mb-2">Resumen del Pedido</h4>
             <div className="space-y-1 divide-y divide-brand-dark/50">
                {order.items.length > 0 ? order.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 pt-3">
                        <div className="flex-grow">
                            <p className="font-semibold text-brand-light">{item.productName}</p>
                            <div className="text-xs text-brand-gray mt-1 pl-2 border-l-2 border-brand-dark/50">
                                <div>{item.variant}</div>
                                {item.comboDrink && <div>+ Bebida: {item.comboDrink}</div>}
                                {item.added.map(name => <div key={name}>+ {name}</div>)}
                                {item.removed.map(name => <div key={name}>- Sin {name}</div>)}
                                {item.notes && <div className="italic">"{item.notes}"</div>}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-2">
                            <div className="font-bold text-brand-light text-sm whitespace-nowrap">{formatCurrency(getFullItemPrice(item) * item.quantity)}</div>
                             <div className="flex items-center bg-brand-dark rounded-full">
                                <button onClick={() => onUpdateItemQuantity(index, item.quantity - 1)} className="p-1 text-brand-gray hover:text-brand-orange"><MinusIcon className="w-5 h-5"/></button>
                                <span className="px-2 font-bold text-sm text-brand-light">{item.quantity}</span>
                                <button onClick={() => onUpdateItemQuantity(index, item.quantity + 1)} className="p-1 text-brand-gray hover:text-brand-orange"><PlusIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <p className="text-brand-gray text-center py-4">No hay productos en este pedido aún.</p>
                )}
            </div>
        </div>

        <div className="p-6 mt-auto bg-brand-dark/50 border-t border-black/50 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                    onClick={onAddItems}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-brand-dark rounded-lg hover:bg-black/40 transition-colors"
                >
                    <PlusIcon className="w-6 h-6 text-brand-orange" />
                    <span className="font-bold text-base text-brand-light">Agregar</span>
                </button>
                <button
                    onClick={onCancelOrder}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-brand-dark rounded-lg hover:bg-black/40 transition-colors"
                >
                    <TrashIcon className="w-6 h-6 text-red-400" />
                    <span className="font-bold text-base text-brand-light">Cancelar</span>
                </button>
            </div>
            <button
                onClick={onMarkAsCompleted}
                className="w-full flex items-center justify-center gap-3 p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
                <CurrencyDollarIcon className="w-7 h-7" />
                <span className="font-bold text-lg">Pagar y Liberar Mesa</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default TableActionsModal;