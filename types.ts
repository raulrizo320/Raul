import { FirebaseApp } from "firebase/app";

export enum Category {
  Hamburguesas = 'Hamburguesas',
  Perros = 'Perros',
  Salchipapas = 'Salchipapas',
  Choripapas = 'Choripapas',
  Papas_Locas = 'Papas Locas',
  Sandwiches = 'Sandwiches',
  Alternativas = 'Alternativas',
  Bebidas = 'Bebidas',
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
  comboDrink?: Product; // The drink added as a combo
}

// Represents an order stored in Firebase
export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  OutForDelivery = 'out-for-delivery',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export interface OrderItem {
  productName: string;
  quantity: number;
  variant: string;
  price: number;
  added: string[];
  removed: string[];
  notes: string;
  comboDrink: string | null;
}

export type OrderType = 'in-store' | 'delivery';

export interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
    completedAt?: Date;
    orderType: OrderType;
    customerName?: string;
    customerPhone?: string;
    tableNumber?: number;
}