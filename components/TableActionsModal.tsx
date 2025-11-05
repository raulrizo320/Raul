import React from 'react';
import { Order, OrderStatus } from '../types';
import { CloseIcon, PlusIcon, CurrencyDollarIcon, TrashIcon } from './Icons';
import Timer from './Timer';

interface TableActionsModalProps {
  order: Order | null;
  onClose: () => void;
  onAddItems: () => void;
  onMarkAsCompleted: () => void;
  onCancelOrder: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
};

const TableActionsModal: React.FC<TableActionsModalProps> = ({ order, onClose, onAddItems, onMarkAsCompleted, onCancelOrder }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-brand-surface rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-brand-dark flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-display font-extrabold text-brand-light">Gestionar Mesa {order.tableNumber}</h2>
                <p className="text-brand-gray">Pedido #{order.id.substring(0, 5).toUpperCase()}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-brand-orange transition-colors">
                <CloseIcon className="w-8 h-8" />
            </button>
        </div>
        <div className="p-6">
            <div className="bg-brand-dark rounded-lg p-4 mb-6 flex justify-between items-center">
                <div>
                    <span className="text-sm text-brand-gray">Total Actual</span>
                    <p className="text-3xl font-bold text-brand-orange">{formatCurrency(order.total)}</p>
                </div>
                <div>
                    <span className="text-sm text-brand-gray text-right block">Tiempo Activo</span>
                    <Timer startTime={order.createdAt} />
                </div>
            </div>
            
            <div className="space-y-4">
                <button
                    onClick={onAddItems}
                    className="w-full flex items-center gap-4 text-left p-4 bg-brand-dark rounded-lg hover:bg-black/40 transition-colors"
                >
                    <PlusIcon className="w-8 h-8 text-brand-orange flex-shrink-0" />
                    <div>
                        <span className="font-bold text-lg text-brand-light">Agregar al Pedido</span>
                        <p className="text-sm text-brand-gray">Añadir más productos a esta mesa.</p>
                    </div>
                </button>
                <button
                    onClick={onMarkAsCompleted}
                    className="w-full flex items-center gap-4 text-left p-4 bg-brand-dark rounded-lg hover:bg-black/40 transition-colors"
                >
                    <CurrencyDollarIcon className="w-8 h-8 text-green-400 flex-shrink-0" />
                    <div>
                        <span className="font-bold text-lg text-brand-light">Pagar y Entregar</span>
                        <p className="text-sm text-brand-gray">Finalizar el pedido y liberar la mesa.</p>
                    </div>
                </button>
                 <button
                    onClick={onCancelOrder}
                    className="w-full flex items-center gap-4 text-left p-4 bg-brand-dark rounded-lg hover:bg-black/40 transition-colors"
                >
                    <TrashIcon className="w-8 h-8 text-red-400 flex-shrink-0" />
                    <div>
                        <span className="font-bold text-lg text-brand-light">Cancelar Pedido</span>
                        <p className="text-sm text-brand-gray">Anula el pedido y libera la mesa.</p>
                    </div>
                </button>
            </div>
        </div>
         <div className="p-6 mt-auto bg-brand-dark/50 border-t border-black/50">
            <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-brand-surface text-brand-light font-bold rounded-xl hover:bg-opacity-80 transition-colors duration-300"
            >
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};

export default TableActionsModal;