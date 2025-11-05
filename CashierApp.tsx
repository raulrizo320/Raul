import React from 'react';

const CashierApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-surface text-brand-light">
      <header className="bg-brand-dark shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-display font-extrabold text-brand-orange tracking-tight">
            Panel de Cocina - Alex Burger
          </h1>
          <p className="text-brand-gray">Pedidos entrantes en tiempo real</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-20 bg-brand-dark rounded-lg">
            <h2 className="text-2xl font-bold text-brand-light">Esperando nuevos pedidos...</h2>
            <p className="text-brand-gray mt-2">Cuando un cliente envíe un pedido, aparecerá aquí automáticamente.</p>
        </div>
      </main>
    </div>
  );
};

export default CashierApp;