import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, CartItem } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], customerInfo: { phone: string; location: string; address?: string }) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  
  const createOrder = (items: CartItem[], customerInfo: { phone: string; location: string; address?: string }) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      items,
      total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      status: 'pending',
      createdAt: new Date(),
      customerInfo
    };
    
    setOrders(prev => [newOrder, ...prev]);
    
    // Simulate sending to admin (in real app, this would be an API call)
    console.log('Order sent to admin:', newOrder);
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