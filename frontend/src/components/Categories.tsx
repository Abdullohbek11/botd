import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategories } from '../context/CategoryContext';

export function Categories() {
  const { categories } = useCategories();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? containerRef.current.scrollLeft - scrollAmount
        : containerRef.current.scrollLeft + scrollAmount;
      
      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  // Avtomatik slayd
  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        if (scrollLeft >= scrollWidth - clientWidth) {
          containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 5000); // Har 5 sekundda

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
      )}
      
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide space-x-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* 'Hammasi' kategoriyasi */}
        <div
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer transition-colors border-2 ${
            selectedCategory === null
              ? 'bg-[#7000FF] border-[#7000FF] text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:text-[#7000FF]'
          }`}
          style={{ width: '100px', borderRadius: '24px', padding: '12px 0' }}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 ${
            selectedCategory === null ? 'bg-white' : 'bg-gray-100'
          }`}>
            <span className={`text-2xl ${selectedCategory === null ? 'text-[#7000FF]' : 'text-gray-700'}`}>🛍️</span>
          </div>
          <span className="text-xs text-center font-semibold">Hammasi</span>
        </div>
        {/* Boshqa kategoriyalar */}
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer transition-colors border-2 ${
              selectedCategory === category.id
                ? 'bg-[#7000FF] border-[#7000FF] text-white'
                : 'bg-white border-gray-200 text-gray-700 hover:text-[#7000FF]'
            }`}
            style={{ width: '100px', borderRadius: '24px', padding: '12px 0' }}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 ${
              selectedCategory === category.id ? 'bg-white' : 'bg-gray-100'
            }`}>
              {category.image ? (
                <img src={category.image} alt={category.name} className="w-10 h-10 object-cover rounded-full" />
              ) : (
                <span className={`text-2xl ${selectedCategory === category.id ? 'text-[#7000FF]' : 'text-gray-700'}`}>{category.icon}</span>
              )}
            </div>
            <span className="text-xs text-center font-semibold line-clamp-2">{category.name}</span>
          </div>
        ))}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      )}
    </div>
  );
} 