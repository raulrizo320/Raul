import React, { useState, useEffect } from 'react';
import CustomerApp from './CustomerApp';
import CashierApp from './CashierApp';

const Router: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  switch (route) {
    case '#/cliente':
      return <CustomerApp />;
    default:
      return <CashierApp />;
  }
};

export default Router;
