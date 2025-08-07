import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, MapPin, Phone, User, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { formatPrice } from '../utils/formatters';
import { Header } from '../components/Header';

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { createOrder } = useOrders();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    phone: '+998',
    location: '',
    address: '',
    name: ''
  });
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Telegram Web App MainButton ni o'chiramiz
    const telegram = window.Telegram.WebApp;
    telegram.MainButton.hide();

    return () => {
      telegram.MainButton.hide();
    };
  }, [items]);
  
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
  
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validatsiya
    if (!customerInfo.phone || !customerInfo.location) {
      alert('Iltimos, telefon raqami va lokatsiyani to\'ldiring');
      return;
    }
    
    // Telefon raqami validatsiyasi (9 ta raqam +998 bilan)
    if (!customerInfo.phone.match(/^\+998\d{9}$/)) {
      alert('Iltimos, to\'g\'ri telefon raqami kiriting (9 ta raqam)');
      return;
    }
    
    createOrder(items, customerInfo);
    clearCart();
    setShowCheckout(false);
    setCustomerInfo({ phone: '+998', location: '', address: '', name: '' });
    
    alert('Buyurtma muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
  };
  
  if (items.length === 0 && !showCheckout) {
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
          
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Savat bo'sh</h2>
            <p className="text-gray-600 mb-4">Sizning savatchangizda hozircha mahsulot yo'q</p>
            <Link
              to="/"
              className="inline-block bg-[#7000FF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6000E0] transition-colors"
            >
              Xarid qilishni boshlash
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-[#F4F5F5]">
        <Header />
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex items-center text-gray-600 hover:text-[#7000FF]"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Orqaga
              </button>
            </div>
          </div>
        </header>
        
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Buyurtma berish</h1>
            
            <form onSubmit={handleOrderSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Ism familiya
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7000FF] focus:border-transparent"
                  placeholder="Ismingizni kiriting"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Telefon raqami *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 pointer-events-none">+998 </span>
                  <input
                    type="text"
                    required
                    value={customerInfo.phone.replace('+998', '')}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Faqat raqamlarni qabul qilish
                      value = value.replace(/[^\d]/g, '');
                      // Maksimal 9 ta raqam
                      value = value.slice(0, 9);
                      setCustomerInfo(prev => ({ ...prev, phone: '+998' + value }));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-16 focus:ring-2 focus:ring-[#7000FF] focus:border-transparent"
                    maxLength={9}
                  />
                </div>
                {customerInfo.phone && customerInfo.phone.length < 13 && (
                  <p className="text-red-500 text-sm mt-1">To'g'ri telefon raqami kiriting (9 ta raqam)</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Joylashuv *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={customerInfo.location}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, location: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7000FF] focus:border-transparent"
                    placeholder="Shahar, tuman yoki lokatsiya tugmasini bosing"
                  />
                  <button
                    type="button"
                    onClick={handleShareLocation}
                    disabled={isLocationSharing}
                    className="px-4 py-2 bg-[#7000FF] text-white rounded-lg hover:bg-[#6000E0] transition-colors disabled:bg-gray-400 flex items-center space-x-1"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{isLocationSharing ? 'Yuklanmoqda...' : 'Lokatsiya'}</span>
                  </button>
                </div>
                {!customerInfo.location && (
                  <p className="text-red-500 text-sm mt-1">Lokatsiyani kiriting yoki lokatsiya tugmasini bosing</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manzil (ixtiyoriy)
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7000FF] focus:border-transparent"
                  rows={3}
                  placeholder="Ko'cha, uy, xonadon..."
                />
              </div>
               
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Mahsulotlar ({items.length})</span>
                  <span className="font-medium">{formatPrice(totalPrice)} so'm</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-600">Yetkazib berish</span>
                  <span className="font-medium text-[#00C853]">Bepul</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Jami</span>
                  <span>{formatPrice(totalPrice)} so'm</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={!customerInfo.phone || !customerInfo.location || customerInfo.phone.length < 13}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    customerInfo.phone && customerInfo.location && customerInfo.phone.length >= 13
                      ? 'bg-[#7000FF] text-white hover:bg-[#6000E0]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {!customerInfo.phone || !customerInfo.location || customerInfo.phone.length < 13
                    ? 'Telefon va lokatsiyani to\'ldiring'
                    : 'Buyurtma berish'
                  }
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }
  
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
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center">
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                    </Link>
                    
                    <div className="ml-4 flex-1">
                      <Link to={`/product/${item.id}`} className="block">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      </Link>
                      
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1 hover:text-[#7000FF]"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-2 py-1 min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:text-[#7000FF]"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(item.originalPrice * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 lg:mt-0 lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Buyurtma ma'lumotlari</h2>
              
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-200">
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Mahsulotlar ({items.length})</dt>
                    <dd className="font-medium text-gray-900">{formatPrice(totalPrice)}</dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Yetkazib berish</dt>
                    <dd className="font-medium text-gray-900">Bepul</dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-base font-medium text-gray-900">Jami</dt>
                    <dd className="text-base font-medium text-gray-900">{formatPrice(totalPrice)}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#7000FF] text-white py-3 px-4 rounded-lg hover:bg-[#6000E0] font-medium"
                >
                  Buyurtma berish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}