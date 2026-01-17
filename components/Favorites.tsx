import React from 'react';
import { Product } from '../types';

interface FavoritesProps {
  items: Product[];
  onRemove: (id: string) => void;
  onView: (product: Product) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ items, onRemove, onView }) => {
  if (items.length === 0) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-full pt-32">
        <div className="w-24 h-24 bg-pink-50 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
           <svg className="w-10 h-10 text-[#b33951]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-[#2c3e50] mb-3 tracking-tight">لا توجد قطع مفضلة</h2>
        <p className="text-gray-400 text-sm mb-10 font-medium">ابدئي بإضافة ما يعجبكِ إلى القائمة</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-up">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-[#2c3e50] tracking-tight">قائمة أمنياتك</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Your Curated Collection</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map(product => (
          <div key={product.id} className="bg-white p-3 rounded-[2rem] border border-pink-50/50 shadow-sm relative group">
            <div onClick={() => onView(product)} className="h-48 rounded-[1.5rem] overflow-hidden mb-3 cursor-pointer">
              <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
            </div>
            <h3 className="text-xs font-bold text-[#2c3e50] mb-1 truncate">{product.name}</h3>
            <p className="text-[#b33951] font-bold text-[11px]">{product.price.toLocaleString()} DZD</p>
            <button 
              onClick={() => onRemove(product.id)}
              className="absolute top-4 left-4 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-rose-500 shadow-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;