export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  discount?: number;
  inStock: boolean;
  costPrice?: number; // asl narxi (tannarxi), faqat admin uchun
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: Date;
  customerInfo: {
    phone: string;
    location: string;
    address?: string;
    name?: string;
  };
}

export interface User {
  id: string;
  name: string;
  phone: string;
  isAdmin: boolean;
}

// Telegram Web App types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        requestContact: (callback: (contact: any) => void) => void;
        ready: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}