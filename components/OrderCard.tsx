import React from 'react';
import { Order, OrderStatus } from '../types';
import Timer from './Timer';
import { PhoneIcon } from './Icons';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
};

const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
        case OrderStatus.Pending: return OrderStatus.Preparing;
        case OrderStatus.Preparing: return OrderStatus.Ready;
        case OrderStatus.Ready: return OrderStatus.Completed;
        default: return null;
    }
}

const getActionTextAndStyle = (currentStatus: OrderStatus): { text: string, style: string } => {
    switch (currentStatus) {
        case OrderStatus.Pending: return { text: 'Empezar Preparación', style: 'bg-blue-600 hover:bg-blue-700' };
        case OrderStatus.Preparing: return { text: 'Marcar como Listo', style: 'bg-yellow-600 hover:bg-yellow-700' };
        case OrderStatus.Ready: return { text: 'Entregar y Archivar', style: 'bg-green-600 hover:bg-green-700' };
        default: return { text: 'Acción', style: 'bg-gray-600 hover:bg-gray-700' };
    }
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus }) => {
  const handleActionClick = () => {
    const nextStatus = getNextStatus(order.status);
    if (nextStatus) {
      onUpdateStatus(order.id, nextStatus);
    }
  };
  
  const { text: actionText, style: actionStyle } = getActionTextAndStyle(order.status);

  return (
    <div className="bg-brand-surface rounded-lg shadow-md p-4 flex flex-col gap-3 animate-fade-in-up">
      <div className="flex justify-between items-start pb-2 border-b border-brand-dark">
        <div>
          <h3 className="font-bold text-lg text-brand-light">Pedido #{order.id.substring(0, 5).toUpperCase()}</h3>
          <p className="text-sm text-brand-orange font-semibold">{formatCurrency(order.total)}</p>
        </div>
        {order.status !== OrderStatus.Completed && <Timer startTime={order.createdAt} />}
      </div>

      {order.orderType === 'delivery' && (
        <div className="bg-brand-dark p-3 rounded-lg">
          <p className="font-bold text-brand-light text-base">{order.customerName}</p>
          <div className="flex items-center gap-2 text-brand-gray text-sm">
            <PhoneIcon className="w-4 h-4" />
            <span>{order.customerPhone}</span>
          </div>
        </div>
      )}
      
      <div className="space-y-2 text-sm">
        {order.items.map((item, index) => (
          <div key={index}>
            <p className="font-semibold text-brand-light">
                <span className="inline-block text-center mr-2 font-mono bg-brand-dark text-brand-orange rounded px-1.5 py-0.5 text-xs">{item.quantity}x</span>
                {item.productName}
            </p>
            {(item.added.length > 0 || item.removed.length > 0 || item.notes) && (
              <div className="text-xs text-brand-gray mt-1 pl-4 border-l-2 border-brand-dark/50">
                {item.added.map(name => <div key={name}>+ {name}</div>)}
                {item.removed.map(name => <div key={name}>- Sin {name}</div>)}
                {item.notes && <div className="italic">"{item.notes}"</div>}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {order.status !== OrderStatus.Completed && (
        <div className="mt-2">
            <button 
            onClick={handleActionClick}
            className={`w-full py-2 px-4 text-white font-bold rounded-lg transition-colors duration-200 ${actionStyle}`}
            >
            {actionText}
            </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;