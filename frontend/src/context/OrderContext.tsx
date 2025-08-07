import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, CartItem } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], customerInfo: { phone: string; location: string; address?: string; name?: string }) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  
  const createOrder = (items: CartItem[], customerInfo: { phone: string; location: string; address?: string; name?: string }) => {
    console.log('createOrder chaqirildi:', { items, customerInfo });
    
    const newOrder: Order = {
      id: Date.now().toString(),
      items,
      total: items.reduce((sum, item) => sum + (Number((item as any).price ?? (item as any).product?.price ?? 0) * Number(item.quantity)), 0),
      status: 'pending',
      createdAt: new Date(),
      customerInfo
    };
    
    console.log('Yaratilgan buyurtma:', newOrder);
    setOrders(prev => [newOrder, ...prev]);
    
    // API ga yuborish
    console.log('API ga yuborish boshlanmoqda...');
    fetch('https://otkirbekshop.uz/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    })
      .then(res => {
        console.log('API javobi status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Buyurtma yuborildi:', data);
      })
      .catch(error => {
        console.error('Buyurtma yuborishda xatolik:', error);
      });
  };
  
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };
  
  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };
  
  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      getOrderById
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}