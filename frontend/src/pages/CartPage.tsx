import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, MapPin, Phone, User, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { formatPrice } from '../utils/formatters';

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { createOrder } = useOrders();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    phone: '',
    location: '',
    address: '',
    name: ''
  });
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  
  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowCheckout(true);
  };
  
  const handleShareLocation = () => {
    setIsLocationSharing(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCustomerInfo(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          setIsLocationSharing(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocationSharing(false);
          alert('Lokatsiyani olishda xatolik yuz berdi. Iltimos, qo\'lda kiriting.');
        }
      );
    } else {
      setIsLocationSharing(false);
      alert('Brauzeringiz geolokatsiyani qo\'llab-quvvatlamaydi.');
    }
  };
  
  const handleShareContact = () => {
    // Telegram Web App API for sharing contact
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.requestContact((contact: any) => {
        if (contact) {
          setCustomerInfo(prev => ({
            ...prev,
            phone: contact.phone_number,
            name: `${contact.first_name} ${contact.last_name || ''}`.trim()
          }));
        }
      });
    } else {
      // Fallback for non-Telegram environment
      alert('Telegram muhitida kontakt ulashish mumkin. Hozircha qo\'lda kiriting.');
    }
  };
  
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.phone || !customerInfo.location) return;
    
    createOrder(items, customerInfo);
    clearCart();
    setShowCheckout(false);
    setCustomerInfo({ phone: '', location: '', address: '', name: '' });
    
    alert('Buyurtma muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
  };
  
  if (items.length === 0 && !showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link to="/" className="flex items-center text-gray-600 hover:text-pink-600">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Orqaga
              </Link>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Savat bo'sh</h1>
            <p className="text-gray-600 mb-6">Mahsulotlarni qo'shing va xarid qiling</p>
            <Link
              to="/"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
            >
              Xarid qilishni boshlash
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex items-center text-gray-600 hover:text-pink-600"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Orqaga
              </button>
            </div>
          </div>
        </header>
        
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Buyurtma berish</h1>
            
            <form onSubmit={handleOrderSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Ism familiya
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ismingizni kiriting"
                  />
                  <button
                    type="button"
                    onClick={handleShareContact}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Send className="h-4 w-4" />
                    <span>Kontakt</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Telefon raqami
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="+998 90 123 45 67"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Joylashuv
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={customerInfo.location}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, location: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Shahar, tuman yoki koordinatalar"
                  />
                  <button
                    type="button"
                    onClick={handleShareLocation}
                    disabled={isLocationSharing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center space-x-1"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{isLocationSharing ? 'Yuklanmoqda...' : 'Lokatsiya'}</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manzil (ixtiyoriy)
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={3}
                  placeholder="To'liq manzil, orientir..."
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="text-lg font-semibold text-gray-900 mb-4">
                  Jami: {formatPrice(total)}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-700 transition-colors"
                >
                  Buyurtma berish
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center text-gray-600 hover:text-pink-600">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Orqaga
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Savat</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1 bg-gray-100 rounded font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Buyurtma xulosasi</h2>
            
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Jami:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-700 transition-colors"
            >
              Sotib olish
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}