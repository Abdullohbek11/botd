import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { Header } from '../components/Header';
import { formatPrice, formatDate, getOrderStatusText, getOrderStatusColor } from '../utils/formatters';

export function OrdersPage() {
  const { orders, updateOrderStatus } = useOrders();
  
  const handleMarkAsDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered');
  };
  
  return (
    <div className="min-h-screen bg-[#F4F5F5]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Link to="/" className="flex items-center text-gray-600 hover:text-[#7000FF]">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Orqaga
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Buyurtmalarim</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Buyurtmalar yo'q</h2>
            <p className="text-gray-600 mb-6">Hali birorta ham buyurtma bermagansiz</p>
            <Link
              to="/"
              className="inline-block bg-[#7000FF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6000E0] transition-colors"
            >
              Xarid qilishni boshlash
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Buyurtma #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusText(order.status)}
                    </span>
                    
                    {order.status === 'shipping' && (
                      <button
                        onClick={() => handleMarkAsDelivered(order.id)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Keldi</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span>{item.product.name}</span>
                      </div>
                      <div className="text-right">
                        <div>{item.quantity} x {formatPrice(item.product.price)}</div>
                        <div className="font-medium">{formatPrice(item.product.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Jami:</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Telefon:</strong> {order.customerInfo.phone}</p>
                    <p><strong>Joylashuv:</strong> {order.customerInfo.location}</p>
                    {order.customerInfo.address && (
                      <p><strong>Manzil:</strong> {order.customerInfo.address}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}