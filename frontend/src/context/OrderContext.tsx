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
    const newOrder: Order = {
      id: Date.now().toString(),
      items,
      total: items.reduce((sum, item) => sum + (Number((item as any).price ?? (item as any).product?.price ?? 0) * Number(item.quantity)), 0),
      status: 'pending',
      createdAt: new Date(),
      customerInfo
    };
    setOrders(prev => [newOrder, ...prev]);
    // API ga yuborish
    fetch('http://localhost:8001/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    })
      .then(res => res.json())
      .then(data => {
        // xabar chiqaring yoki local state yangilang
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