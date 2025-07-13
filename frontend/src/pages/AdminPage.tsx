import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, X, Upload } from 'lucide-react';
import { Header } from '../components/Header';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { formatPrice } from '../utils/formatters';
import { Product } from '../types';

export function AdminPage() {
  const { products, deleteProduct, addProduct } = useProducts();
  const { categories, setCategories, addCategory, deleteCategory } = useCategories();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
    costPrice: ''
  });
  const [newCategory, setNewCategory] = useState<{ name: string; icon: string; image?: string }>({ name: '', icon: '', image: '' });
  const [selectedCategoryImage, setSelectedCategoryImage] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(null);
  const categoryImageInputRef = useRef<HTMLInputElement>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) setShowAdminLogin(true);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      const timeout = setTimeout(() => {
        localStorage.removeItem('isAdmin');
        setShowAddProduct(false);
        setShowAddCategory(false);
        setShowAdminLogin(true);
      }, 300000);
      return () => clearTimeout(timeout);
    }
  }, [isAdmin]);

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Mahsulotni o\'chirishni tasdiqlaysizmi?')) {
      deleteProduct(productId);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Kategoriyani o\'chirishni tasdiqlaysmi?')) {
      deleteCategory(categoryId);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = newProduct.image;
    if (selectedImage) {
      imageUrl = imagePreview || '';
    }
    const product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      image: imageUrl,
      category_id: newProduct.category,
      description: newProduct.description,
      rating: 5,
      reviews_count: 0,
      discount: 0,
      inStock: true,
      originalPrice: Number(newProduct.costPrice) || 0
    };
    addProduct(product as any);
    setNewProduct({
      name: '',
      price: '',
      image: '',
      category: '',
      description: '',
      costPrice: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
    setShowAddProduct(false);
  };

  const handleCategoryImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCategoryImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryImagePreview(reader.result as string);
        setNewCategory(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveCategoryImage = () => {
    setSelectedCategoryImage(null);
    setCategoryImagePreview(null);
    setNewCategory(prev => ({ ...prev, image: '' }));
    if (categoryImageInputRef.current) {
      categoryImageInputRef.current.value = '';
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const category = {
      id: Date.now().toString(),
      name: newCategory.name,
      icon: newCategory.icon,
      image: newCategory.image,
      productCount: 0
    };
    addCategory(category);
    setNewCategory({ name: '', icon: '', image: '' });
    setSelectedCategoryImage(null);
    setCategoryImagePreview(null);
    setShowAddCategory(false);
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'Ab01221522') {
      localStorage.setItem('isAdmin', 'true');
      setShowAdminLogin(false);
      window.location.reload();
    } else {
      alert('Parol noto‘g‘ri!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F5]">
      <Header />
      {/* Admin login modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4">Admin kirish</h2>
            <input
              type="password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              placeholder="Admin parol"
              className="border px-3 py-2 rounded mb-4"
            />
            <div className="flex space-x-2">
              <button onClick={handleAdminLogin} className="bg-[#7000FF] text-white px-4 py-2 rounded">Kirish</button>
              <button onClick={() => setShowAdminLogin(false)} className="px-4 py-2 border rounded">Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-[#7000FF]">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Orqaga
          </button>
          {isAdmin && (
            <button onClick={() => { navigate('/'); }} className="px-4 py-2 border rounded">Chiqish</button>
          )}
        </div>

        {/* Categories Section */}
        {isAdmin && (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Kategoriyalar</h2>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="bg-[#7000FF] text-white px-4 py-2 rounded-lg hover:bg-[#6000E0] flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Yangi kategoriya
                </button>
              </div>

              {showAddCategory && (
                <form onSubmit={handleAddCategory} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategoriya nomi
                      </label>
                      <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7000FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategoriya rasmi (image)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        ref={categoryImageInputRef}
                        onChange={handleCategoryImageSelect}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7000FF]"
                      />
                      {categoryImagePreview && (
                        <div className="mt-2 flex items-center space-x-2">
                          <img src={categoryImagePreview} alt="Kategoriya rasmi" className="w-12 h-12 object-cover rounded-full" />
                          <button type="button" onClick={handleRemoveCategoryImage} className="text-xs text-red-500">O‘chirish</button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategoriya ikonkasi (emoji, ixtiyoriy)
                      </label>
                      <input
                        type="text"
                        value={newCategory.icon}
                        onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7000FF]"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowAddCategory(false)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="submit"
                        className="bg-[#7000FF] text-white px-4 py-2 rounded-lg hover:bg-[#6000E0]"
                      >
                        Qo'shish
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                      {(category as any).image ? (
                        <img src={(category as any).image} alt={category.name} className="w-16 h-16 object-cover rounded-full" />
                      ) : (
                        <span className="text-3xl">{category.icon}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-center line-clamp-2 mb-1">{category.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-gray-400 hover:text-red-500 mt-1"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Products Section */}
        {isAdmin && (
          <>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Mahsulotlar</h2>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-[#7000FF] text-white px-4 py-2 rounded-lg hover:bg-[#6000E0] flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Yangi mahsulot
                </button>
              </div>

              {showAddProduct && (
                <form onSubmit={handleAddProduct} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mahsulot nomi
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7000FF]"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Narxi
                        </label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7000FF]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Asl narxi (tannarxi)
                        </label>
                        <input
                          type="number"
                          value={newProduct.costPrice || ''}
                          onChange={(e) => setNewProduct({ ...newProduct, costPrice: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7000FF]"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rasm
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg relative">
                        <div className="space-y-1 text-center">
                          {imagePreview ? (
                            <div className="relative">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="mx-auto h-32 w-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) :
                            <>
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-[#7000FF] hover:text-[#6000E0] focus-within:outline-none"
                                >
                                  <span>Rasm yuklash</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    ref={fileInputRef}
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                  />
                                </label>
                                <p className="pl-1">yoki sudrab tashlang</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF gacha 10MB</p>
                            </>
                          }
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategoriya
                      </label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7000FF]"
                        required
                      >
                        <option value="">Kategoriyani tanlang</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tavsif
                      </label>
                      <textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7000FF]"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddProduct(false);
                          setSelectedImage(null);
                          setImagePreview(null);
                          setNewProduct({
                            name: '',
                            price: '',
                            image: '',
                            category: '',
                            description: '',
                            costPrice: ''
                          });
                        }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="submit"
                        className="bg-[#7000FF] text-white px-4 py-2 rounded-lg hover:bg-[#6000E0]"
                      >
                        Qo'shish
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      <div className="flex items-baseline space-x-2 mb-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(Number(product.price))}
                        </span>
                      </div>
                      {isAdmin && (
                        <div className="text-xs text-gray-500 mb-2">
                          Asl narxi: <span className="font-semibold">{formatPrice(Number(product.costPrice) || Number(product.originalPrice) || 0)}</span>
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}