import { Product, Category } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Kosmetika', icon: '💄', productCount: 156 },
  { id: '2', name: 'Parfyumeriya', icon: '🌸', productCount: 89 },
  { id: '3', name: 'Soch parvarishi', icon: '💇‍♀️', productCount: 134 },
  { id: '4', name: 'Teri parvarishi', icon: '🧴', productCount: 198 },
  { id: '5', name: 'Maishiy kimyo', icon: '🧽', productCount: 76 },
  { id: '6', name: 'Salomatlik', icon: '💊', productCount: 112 },
  { id: '7', name: 'Aksessuarlar', icon: '👜', productCount: 67 },
  { id: '8', name: 'Erkaklar uchun', icon: '🧔', productCount: 45 },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Dior Sauvage Eau de Toilette 100ml',
    price: 850000,
    originalPrice: 950000,
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '2',
    description: 'Dior Sauvage - erkaklar uchun zamonaviy va jozibali atir. Uzoq davom etuvchi va noyob hid.',
    rating: 4.8,
    reviews: 324,
    discount: 11,
    inStock: true
  },
  {
    id: '2',
    name: 'Chanel No.5 Eau de Parfum 50ml',
    price: 1200000,
    originalPrice: 1350000,
    image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '2',
    description: 'Chanel No.5 - dunyoning eng mashhur ayollar atiri. Klassik va nafis hid.',
    rating: 4.9,
    reviews: 567,
    discount: 11,
    inStock: true
  },
  {
    id: '3',
    name: 'MAC Ruby Woo Lipstick',
    price: 320000,
    originalPrice: 380000,
    image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '1',
    description: 'MAC Ruby Woo - klassik qizil lab bo\'yog\'i. Uzoq davom etuvchi va to\'yingan rang.',
    rating: 4.7,
    reviews: 189,
    discount: 16,
    inStock: true
  },
  {
    id: '4',
    name: 'L\'Oreal Paris Revitalift Serum',
    price: 180000,
    originalPrice: 220000,
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '4',
    description: 'L\'Oreal Revitalift - anti-aging serum. Terini yoshartiradi va elastikligini oshiradi.',
    rating: 4.6,
    reviews: 412,
    discount: 18,
    inStock: true
  },
  {
    id: '5',
    name: 'Pantene Pro-V Shampoo 400ml',
    price: 45000,
    originalPrice: 55000,
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '3',
    description: 'Pantene Pro-V - sochni mustahkamlash va parlatish uchun shampun. Barcha soch turlari uchun.',
    rating: 4.5,
    reviews: 167,
    discount: 18,
    inStock: true
  },
  {
    id: '6',
    name: 'Nivea Soft Moisturizing Cream',
    price: 25000,
    originalPrice: 32000,
    image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '4',
    description: 'Nivea Soft - yumshoq namlantiruvchi krem. Teri uchun kundalik parvarish.',
    rating: 4.4,
    reviews: 289,
    discount: 22,
    inStock: true
  },
  {
    id: '7',
    name: 'Fairy Bulaşık Deterjanı 500ml',
    price: 18000,
    image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '5',
    description: 'Fairy - kuchli va samarali idish-tovoq yuvish vositasi. Yog\'ni oson olib tashlaydi.',
    rating: 4.3,
    reviews: 156,
    inStock: true
  },
  {
    id: '8',
    name: 'Gillette Fusion5 Razor',
    price: 85000,
    originalPrice: 100000,
    image: 'https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '8',
    description: 'Gillette Fusion5 - erkaklar uchun 5 pichoqli ustara. Yumshoq va aniq soqol olish.',
    rating: 4.6,
    reviews: 234,
    discount: 15,
    inStock: true
  },
  {
    id: '9',
    name: 'Vitamin C 1000mg Tablets',
    price: 65000,
    image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '6',
    description: 'Vitamin C 1000mg - immunitetni mustahkamlash uchun vitamin qo\'shimchasi. 60 ta tablet.',
    rating: 4.5,
    reviews: 123,
    inStock: true
  },
  {
    id: '10',
    name: 'Michael Kors Handbag',
    price: 450000,
    originalPrice: 520000,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: '7',
    description: 'Michael Kors - zamonaviy va nafis ayollar sumkasi. Yuqori sifatli materialdan tayyorlangan.',
    rating: 4.7,
    reviews: 89,
    discount: 13,
    inStock: true
  }
];