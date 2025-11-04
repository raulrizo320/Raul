export enum Category {
  Hamburguesas = 'Hamburguesas',
  Perros = 'Perros',
  Salchipapas = 'Salchipapas',
  Choripapas = 'Choripapas',
  Papas_Locas = 'Papas Locas',
  Sandwiches = 'Sandwiches',
  Alternativas = 'Alternativas',
  Adicionales = 'Adicionales',
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
  baseIngredients?: string[];
}

// Represents an item added from the Adicionales category
export interface Adicional extends Product {
    category: Category.Adicionales;
}

export interface CartItem {
  id: number; // Unique ID for this specific item in the cart
  product: Product;
  quantity: number;
  variant: {
    label: string;
    price: number;
  };
  customizations: {
    added: Adicional[];
    removed: string[];
    notes: string;
  };
}