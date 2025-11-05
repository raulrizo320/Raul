import React, { useState } from 'react';
import { CloseIcon, TableCellsIcon, TruckIcon } from './Icons';

interface OrderTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmDelivery: () => void;
    onConfirmInStore: (tableNumber: number) => void;
    isLoading: boolean;
}

const OrderTypeModal: React.FC<OrderTypeModalProps> = ({ isOpen, onClose, onConfirmDelivery, onConfirmInStore, isLoading }) => {
    const [selectedType, setSelectedType] = useState<'delivery' | 'in-store' | null>(null);
    const [tableNumber, setTableNumber] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (selectedType === 'in-store') {
            const num = parseInt(tableNumber, 10);
            if (!tableNumber || isNaN(num) || num <= 0) {
                setError('Por favor, ingresa un número de mesa válido.');
                return;
            }
            setError('');
            onConfirmInStore(num);
        } else if (selectedType === 'delivery') {
            setError('');
            onConfirmDelivery();
        } else {
            setError('Por favor, selecciona una opción.');
        }
    };
    
    if (!isOpen) return null;

    const getButtonClass = (type: 'in-store' | 'delivery') => {
        const base = "flex flex-col items-center justify-center p-6 rounded-2xl border-4 transition-all duration-300 w-full text-left";
        if (selectedType === type) {
            return `${base} bg-brand-orange/20 border-brand-orange`;
        }
        return `${base} bg-brand-dark border-brand-surface hover:border-brand-gray`;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-brand-surface rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-brand-dark flex justify-between items-center">
                    <h2 className="text-2xl font-display font-extrabold text-brand-light">¿Cómo quieres tu pedido?</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-brand-orange transition-colors">
                        <CloseIcon className="w-8 h-8" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setSelectedType('in-store')} className={getButtonClass('in-store')}>
                            <TableCellsIcon className="w-12 h-12 mb-2 text-brand-orange"/>
                            <span className="font-bold text-lg text-brand-light">Para Comer Aquí</span>
                            <span className="text-sm text-brand-gray">Pedir desde mi mesa</span>
                        </button>
                        <button onClick={() => setSelectedType('delivery')} className={getButtonClass('delivery')}>
                            <TruckIcon className="w-12 h-12 mb-2 text-brand-orange"/>
                            <span className="font-bold text-lg text-brand-light">Para Domicilio</span>
                             <span className="text-sm text-brand-gray">Recibir en mi casa</span>
                        </button>
                    </div>

                    {selectedType === 'in-store' && (
                        <div className="pt-4 animate-fade-in-up">
                            <label htmlFor="tableNumber" className="font-bold text-lg text-brand-orange mb-2 block">Número de Mesa</label>
                            <input
                                id="tableNumber"
                                type="number"
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                placeholder="Ingresa el número de tu mesa"
                                className="w-full p-3 bg-brand-dark rounded-lg text-brand-light border border-brand-gray/50 focus:ring-brand-orange focus:border-brand-orange transition"
                            />
                        </div>
                    )}
                    {error && <p className="text-red-400 text-sm pt-2">{error}</p>}
                </div>
                 <div className="p-6 mt-auto bg-brand-dark/50 border-t border-black/50">
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading || !selectedType}
                        className="w-full flex justify-center items-center py-4 px-6 bg-brand-orange text-brand-dark font-bold rounded-xl hover:bg-opacity-90 transition-colors duration-300 text-lg disabled:bg-brand-gray disabled:cursor-not-allowed"
                    >
                         {isLoading ? (
                            <svg className="animate-spin h-6 w-6 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Continuar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderTypeModal;
