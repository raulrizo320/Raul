
// FIX: Add Ingredient type for product customizations.
export interface Ingredient {
  id: string | number;
  name: string;
  price: number;
}

export enum Category {
  Hamburguesas = '🍔 Hamburguesas',
  Perros = '🌭 Perros',
  Salchipapas = '🍟 Salchipapas',
  Choripapas = '🍖 Choripapas',
  Papas_Locas = '🤯 Papas Locas',
  Sandwiches = '🥪 Sandwiches',
  Alternativas = '✨ Alternativas',
  Adicionales = '➕ Adicionales',
}

export interface Product {
  id: number;
  name:string;
  description: string;
  price: number;
  priceLabel?: string;
  secondaryPrice?: number;
  secondaryPriceLabel?: string;
  image: string;
  category: Category;
  // FIX: Add optional customizableIngredients to Product interface.
  customizableIngredients?: Ingredient[];
}

export interface CartItem {
  id: number; // Unique ID for this specific item in the cart
  product: Product;
  quantity: number;
  variant: {
    label: string;
    price: number;
  };
  // FIX: Add optional customizations to CartItem interface.
  customizations?: {
    added: Ingredient[];
    removed: Ingredient[];
  };
}
