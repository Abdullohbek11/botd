export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  discount: number;
  inStock: boolean;
  costPrice?: number; // asl narxi (tannarxi), faqat admin uchun
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
} 