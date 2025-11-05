import { Product, Category } from './types';

export const MENU_DATA: Product[] = [
  // Hamburguesas
  {
    id: 1, name: 'Clasica',
    description: 'Deliciosa carne de res de 120 gr, cebolla grille, lechuga, tomate, queso, arepa, papa a la francesa y salsas de la casa.',
    price: 14000, priceLabel: 'Sin Papa', secondaryPrice: 16000, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Cebolla', 'Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 2, name: 'Especial',
    description: 'Deliciosa carne de res de 120 gr, pollo desmechado, queso, arepa, papa ripia, cebolla grille, tocineta, lechuga, tomate, papas a la francesa y salsas de la casa.',
    price: 17000, priceLabel: 'Sin Papa', secondaryPrice: 19000, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Cebolla Grille', 'Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 3, name: 'Especial Bacon',
    description: 'Deliciosa carne de res de 120 gr, pollo desmechado en salsa tártara, tocineta, cebolla grille, lechuga, tomate, queso, arepa, papas a la francesa y salsas de la casa.',
    price: 19000, priceLabel: 'Sin Papa', secondaryPrice: 21000, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Cebolla Grille', 'Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 4, name: 'Ranchera',
    description: 'Deliciosa carne de res de 120 gr, chorizo, aro de cebolla apanado, carne desmechada con hogao de la casa, cebolla grille, lechuga, tomate, queso, arepa, papas a la francesa y salsas de la casa.',
    price: 23500, priceLabel: 'Sin Papa', secondaryPrice: 26500, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Cebolla Grille', 'Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 5, name: 'Doble Carne',
    description: 'Dos deliciosas carnes de res de 120 gr, cebolla grille, lechuga, tomate, queso, arepa, papas a la francesa y salsas de la casa.',
    price: 19000, priceLabel: 'Sin Papa', secondaryPrice: 23000, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Cebolla Grille', 'Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 6, name: 'Doble Mixta',
    description: 'Dos deliciosas carnes de res de 120 gr, pollo desmechado en salsa tártara, cebolla grille, lechuga, tomate, queso, arepa, papas a la francesa y salsas de la casa.',
    price: 23000, priceLabel: 'Sin Papa', secondaryPrice: 26000, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Cebolla Grille', 'Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 7, name: 'Bistec a Caballo',
    description: 'Deliciosa carne de res de 120 gr, huevo, tocineta, hogao, cebolla grille, lechuga, tomate, queso, arepa, papa a la francesa y salsas de la casa.',
    price: 15500, priceLabel: 'Sin Papa', secondaryPrice: 18000, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Cebolla Grille', 'Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 8, name: 'Madurito',
    description: 'Deliciosa carne de res de 120 gr, tajadas de maduro, aros de cebolla apanados, tocineta, chorizo, cebolla grille, lechuga, tomate, queso, papa a la francesa y salsas de la casa.',
    price: 22500, priceLabel: 'Sin Papa', secondaryPrice: 25500, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Cebolla Grille', 'Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 9, name: 'Campeche',
    description: 'Deliciosa carne de res de 120 gr, maíz, aros de cebolla apanados, tocineta, cebolla grille, lechuga, tomate, queso, papa a la francesa y salsas de la casa.',
    price: 20000, priceLabel: 'Sin Papa', secondaryPrice: 23000, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Cebolla Grille', 'Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 10, name: 'Burcalifa',
    description: 'Tres deliciosas carnes de res de 150 gr, aros de cebolla, tocineta, filete de pechuga, chorizo, pollo desmechado, cebolla grille, papa ripida con lechuga, tomate, queso, arepa, papa a la francesa y salsas de la casa.',
    price: 42000, priceLabel: 'Sin Papa', secondaryPrice: 46000, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 11, name: 'Volcan Cheese',
    description: 'Dos deliciosas carnes de res de 150 gr, chorizo, tocineta, pollo desmechado, filete de pechuga, hogao, mucho queso gratinado, cebolla grille, papa ripida con lechuga, tomate, papa a la francesa y salsas de la casa.',
    price: 35000, priceLabel: 'Sin Papa', secondaryPrice: 39000, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 12, name: 'Burger House',
    description: 'Deliciosa carne de res de 120 gr, tajadas de maduro, chorizo, tocineta, carne desmechada, aros de cebolla maíz, cebolla grille, lechuga, tomate, queso, arepa, papa a la francesa y salsas de la casa.',
    price: 30000, priceLabel: 'Sin Papa', secondaryPrice: 34000, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Cebolla Grille', 'Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 13, name: 'Chicken Bros',
    description: 'Deliciosa carne de res de 120 gr, pollo apañado, tocineta, aros de cebolla, lechuga, tomate, queso, arepa, papa a la francesa y salsas de la casa.',
    price: 25000, priceLabel: 'Sin Papa', secondaryPrice: 28000, secondaryPriceLabel: 'Con Papa',
    image: '/images/burger-placeholder.svg', category: Category.Hamburguesas,
    baseIngredients: ['Lechuga', 'Tomate', 'Salsas']
  },
  // Perros
  {
    id: 14, name: 'Tradicional',
    description: 'Pan, salchicha tradicional, cebolla grille, ripido, queso rayado, papas a la francesa y salsas de la casa.',
    price: 8500, priceLabel: 'Sin Papa', secondaryPrice: 12000, secondaryPriceLabel: 'Con Papa',
    image: '/images/generic-placeholder.svg', category: Category.Perros,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  {
    id: 15, name: 'Tradicional Americano',
    description: 'Pan, salchicha americana, cebolla grille, ripido, queso rayado, papas a la francesa y salsas de la casa.',
    price: 11500, priceLabel: 'Sin Papa', secondaryPrice: 14000, secondaryPriceLabel: 'Con Papa',
    image: '/images/generic-placeholder.svg', category: Category.Perros,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  {
    id: 16, name: 'Especial',
    description: 'Pan, salchicha tradicional, pollo desmechado, cebolla grille, ripido, queso, papas a la francesa y salsas de la casa.',
    price: 13500, priceLabel: 'Sin Papa', secondaryPrice: 16500, secondaryPriceLabel: 'Con Papa',
    image: '/images/generic-placeholder.svg', category: Category.Perros,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  {
    id: 17, name: 'Especial Bacon',
    description: 'Pan, salchicha tradicional, pollo desmechado, tocineta, cebolla grille, ripido, queso, papas a la francesa y salsas de la casa.',
    price: 16500, priceLabel: 'Sin Papa', secondaryPrice: 19500, secondaryPriceLabel: 'Con Papa',
    image: '/images/generic-placeholder.svg', category: Category.Perros,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  {
    id: 18, name: 'Especial Americano',
    description: 'Pan, salchicha americana, pollo desmechado, cebolla grille, ripido, queso, papas a la francesa y salsas de la casa.',
    price: 15500, priceLabel: 'Sin Papa', secondaryPrice: 18500, secondaryPriceLabel: 'Con Papa',
    image: '/images/generic-placeholder.svg', category: Category.Perros,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  {
    id: 19, name: 'Choriperro',
    description: 'Pan, chorizo, cebolla grille, ripido, queso, papas a la francesa y salsas de la casa.',
    price: 12000, priceLabel: 'Sin Papa', secondaryPrice: 15000, secondaryPriceLabel: 'Con Papa',
    image: '/images/generic-placeholder.svg', category: Category.Perros,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  {
    id: 20, name: 'Choriperro Especial',
    description: 'Pan, chorizo, pollo desmechado, cebolla grille, ripido, queso, papas a la francesa y salsas de la casa.',
    price: 16500, priceLabel: 'Sin Papa', secondaryPrice: 19500, secondaryPriceLabel: 'Con Papa',
    image: '/images/generic-placeholder.svg', category: Category.Perros,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  {
    id: 21, name: 'Perro Loco',
    description: 'Pan, salchicha zenu, pollo desmechado, carne picada, pechuga picada, tocineta, cebolla grille, ripido, queso, papas a la francesa y salsas de la casa.',
    price: 19000, priceLabel: 'Sin Papa', secondaryPrice: 22000, secondaryPriceLabel: 'Con Papa',
    image: '/images/generic-placeholder.svg', category: Category.Perros,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  {
    id: 22, name: 'Perro Loco Especial',
    description: 'Pan, salchicha americana, pollo desmechado, carne picada, pechuga picada, tocineta, cebolla grille, ripido, queso, papas a la francesa y salsas de la casa.',
    price: 23000, priceLabel: 'Sin Papa', secondaryPrice: 26000, secondaryPriceLabel: 'Con Papa',
    image: '/images/generic-placeholder.svg', category: Category.Perros,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  // Salchipapas
  {
    id: 23, name: 'Salchipapa',
    description: 'Salchicha tradicional, papas a la francesa, salsas de la casa y queso rayado.',
    price: 12000, image: '/images/fries-placeholder.svg', category: Category.Salchipapas,
    baseIngredients: ['Salsas']
  },
  {
    id: 24, name: 'Salchipollo',
    description: 'Salchicha tradicional, pollo desmechado, queso, cebolla grille, papas a la francesa y salsas de la casa.',
    price: 17500, image: '/images/fries-placeholder.svg', category: Category.Salchipapas,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  {
    id: 25, name: 'Salchichoripollo',
    description: 'Salchicha zenu, chorizo, pollo desmechado, queso, verdura picada, papa ripida, cebolla grille, tocineta, papas a la francesa y salsas de la casa.',
    price: 28000, image: '/images/fries-placeholder.svg', category: Category.Salchipapas,
    baseIngredients: ['Verdura Picada', 'Cebolla Grille', 'Salsas']
  },
  // Choripapas
  {
    id: 26, name: 'Choripapa',
    description: 'Chorizo, queso rayado, papas a la francesa y salsas de la casa.',
    price: 13000, image: '/images/fries-placeholder.svg', category: Category.Choripapas,
    baseIngredients: ['Salsas']
  },
  {
    id: 27, name: 'Choripollo',
    description: 'Chorizo, pollo desmechado, queso, cebolla grille, papas a la francesa y salsas de la casa.',
    price: 18500, image: '/images/fries-placeholder.svg', category: Category.Choripapas,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  // Papas Locas
  {
    id: 28, name: 'Papas Locas Normales',
    description: 'Pollo desmechado, queso, tocineta, cebolla grille, papas a la fracesa y salsas de la casa.',
    price: 16000, priceLabel: '1 Persona', secondaryPrice: 26500, secondaryPriceLabel: '2 Personas',
    image: '/images/fries-placeholder.svg', category: Category.Papas_Locas,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  {
    id: 29, name: 'Papas Locas Especiales',
    description: 'Pollo desmechado, queso, tocineta, salchicha, chorizo, cebolla grille, papas a la francesa y salsas de la casa.',
    price: 19500, priceLabel: '1 Persona', secondaryPrice: 31500, secondaryPriceLabel: '2 Personas',
    image: '/images/fries-placeholder.svg', category: Category.Papas_Locas,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
  // Sandwiches
  {
    id: 30, name: 'Sandwich Tradicional',
    description: 'Pan artesanal, queso, lechuga, tomate, papas a la francesa y salsas de la casa.',
    price: 9000, image: '/images/generic-placeholder.svg', category: Category.Sandwiches,
    baseIngredients: ['Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 31, name: 'Sandwich de Pollo',
    description: 'Pan artesanal, pollo desmechado, queso, lechuga tomate, papas a la francesa y salsas de la casa.',
    price: 16000, image: '/images/generic-placeholder.svg', category: Category.Sandwiches,
    baseIngredients: ['Lechuga', 'Tomate', 'Salsas']
  },
  {
    id: 32, name: 'Sandwich Ranchero',
    description: 'Pan artesanal, carne desmechada, maíz, queso, lechuga, tomate, papas a la francesa y salsas de la casa.',
    price: 18500, image: '/images/generic-placeholder.svg', category: Category.Sandwiches,
    baseIngredients: ['Lechuga', 'Tomate', 'Salsas']
  },
  // Alternativas
  {
    id: 33, name: 'Picada',
    description: 'Salchicha, chorizo, pechuga, queso rayado, lechuga, tomate, cebolla grille, papas a la francesa y salsas de la casa.',
    price: 40000, image: '/images/generic-placeholder.svg', category: Category.Alternativas,
    baseIngredients: ['Lechuga', 'Tomate', 'Cebolla Grille', 'Salsas']
  },
  {
    id: 34, name: 'Alitas BBQ',
    description: 'Alitas en salsa BBQ, ensalada, papas a la francesa y salsas de la casa.',
    price: 19500, image: '/images/generic-placeholder.svg', category: Category.Alternativas
  },
  {
    id: 35, name: 'Pechuga a la Plancha',
    description: 'Pechuga, ensalada, papas a la francesa y salsas de la casa.',
    price: 21000, image: '/images/generic-placeholder.svg', category: Category.Alternativas
  },
  {
    id: 36, name: 'Carne a la Plancha',
    description: 'Carne, ensalada, papas a la francesa y salsas de la casa.',
    price: 24500, image: '/images/generic-placeholder.svg', category: Category.Alternativas
  },
  {
    id: 37, name: 'Desgranado',
    description: 'Pollo desmechado, maíz, chorizo, queso, cebolla grille, papas a la francesa y salsas de la casa.',
    price: 19500, priceLabel: '1 Persona', secondaryPrice: 33500, secondaryPriceLabel: '2 Personas',
    image: '/images/generic-placeholder.svg', category: Category.Alternativas,
    baseIngredients: ['Cebolla Grille', 'Salsas']
  },
   // Bebidas
  {
    id: 46, name: 'Coca-Cola', description: 'Personal 400ml', price: 4000, image: '/images/drink-placeholder.svg', category: Category.Bebidas
  },
  {
    id: 47, name: 'Jugo de Mora en Agua', description: 'Natural', price: 5000, image: '/images/drink-placeholder.svg', category: Category.Bebidas
  },
  {
    id: 48, name: 'Jugo de Mora en Leche', description: 'Natural', price: 6000, image: '/images/drink-placeholder.svg', category: Category.Bebidas
  },
  {
    id: 49, name: 'Limonada Natural', description: 'Refrescante', price: 5000, image: '/images/drink-placeholder.svg', category: Category.Bebidas
  },
  {
    id: 50, name: 'Cerveza Club Colombia', description: 'Dorada', price: 6000, image: '/images/drink-placeholder.svg', category: Category.Bebidas
  },
  // Adicionales
  {
    id: 38, name: 'Pollo Desmechado', description: '', price: 4000, image: '/images/generic-placeholder.svg', category: Category.Adicionales
  },
  {
    id: 39, name: 'Maíz Dulce', description: '', price: 4000, image: '/images/generic-placeholder.svg', category: Category.Adicionales
  },
  {
    id: 40, name: 'Aros de Cebolla', description: '', price: 3500, image: '/images/generic-placeholder.svg', category: Category.Adicionales
  },
  {
    id: 41, name: 'Porción de Papa Francesa', description: '', price: 7000, image: '/images/fries-placeholder.svg', category: Category.Adicionales
  },
  {
    id: 42, name: 'Chorizo', description: '', price: 4000, image: '/images/generic-placeholder.svg', category: Category.Adicionales
  },
  {
    id: 43, name: 'Salchicha', description: '', price: 4000, image: '/images/generic-placeholder.svg', category: Category.Adicionales
  },
  {
    id: 44, name: 'Carne de Hamburguesa', description: '', price: 6000, image: '/images/burger-placeholder.svg', category: Category.Adicionales
  },
  {
    id: 45, name: 'Tocineta', description: '', price: 3500, image: '/images/generic-placeholder.svg', category: Category.Adicionales
  },
];