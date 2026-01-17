
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { CategoryIcon, Icons } from './CategoryIcons';
import { getFashionAdvice } from '../services/geminiService';
import { playClickSound } from '../constants';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart?: (product: Product, size: string) => void;
  onDelete?: (id: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiAdvice = async () => {
    playClickSound('success');
    setIsAiLoading(true);
    setAiAdvice(null);
    const advice = await getFashionAdvice(`أعطني نصيحة تنسيق لمنتج "${product.name}" من قسم "${product.category}". ما الذي يناسبه من إكسسوارات أو أحذية؟`);
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  const handleAdd = () => {
    playClickSound('success');
    if (onAddToCart) {
      onAddToCart(product, selectedSize);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      playClickSound('sharp');
      if (window.confirm('⚠️ هل أنت متأكد من حذف هذه السلعة نهائياً من المخزون؟')) {
        onDelete(product.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white dark:bg-[#0f172a] flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
        <button onClick={onClose} className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg flex items-center justify-center text-[#2c3e50] dark:text-white active:scale-90 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        {onDelete && (
          <button 
            onClick={handleDelete}
            className="w-10 h-10 bg-red-50/90 dark:bg-red-900/40 rounded-full shadow-lg flex items-center justify-center text-red-500 active:scale-90 transition-transform"
          >
            <Icons.Trash className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <div className="relative aspect-[4/5] bg-gray-100 dark:bg-slate-900">
          <img src={product.images[currentImageIndex]} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {product.images.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`h-1.5 rounded-full transition-all ${currentImageIndex === idx ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        </div>

        <div className="p-8 space-y-6 -mt-6 bg-white dark:bg-[#1e293b] rounded-t-[3rem] relative z-10 shadow-2xl pb-32">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <span className="bg-pink-50 dark:bg-slate-700 text-[#b33951] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{product.category}</span>
            </div>
            <h1 className="text-2xl font-black text-[#2c3e50] dark:text-white">{product.name}</h1>
            <p className="text-2xl font-black text-[#b33951]">{product.price.toLocaleString()} DA</p>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="text-xs font-black text-[#c9a063] uppercase tracking-widest">المستشار الذكي</h3>
               <button 
                onClick={handleAiAdvice}
                disabled={isAiLoading}
                className="bg-gradient-to-r from-[#b33951] to-[#c9a063] text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg disabled:opacity-50 flex items-center gap-2"
               >
                 {isAiLoading ? 'جاري التحليل...' : 'استشارة الموضة AI'}
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </button>
             </div>
             {aiAdvice && (
               <div className="bg-pink-50/50 dark:bg-slate-800 p-4 rounded-2xl border border-pink-100 dark:border-slate-700 animate-in fade-in duration-500">
                  <p className="text-xs font-bold text-[#b33951] dark:text-slate-200 leading-relaxed italic">"{aiAdvice}"</p>
               </div>
             )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#c9a063] uppercase tracking-widest">اختر المقاس</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => { playClickSound('soft'); setSelectedSize(size); }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs transition-all ${selectedSize === size ? 'bg-[#b33951] text-white shadow-lg scale-105' : 'bg-gray-50 dark:bg-slate-800 text-gray-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#c9a063] uppercase tracking-widest">الوصف</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-[#1e293b] border-t border-pink-50 dark:border-slate-800 flex gap-4 absolute bottom-0 left-0 right-0 z-50">
        <button 
          onClick={handleAdd}
          className="flex-1 bg-[#b33951] text-white py-5 rounded-[1.8rem] font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          إضافة إلى السلة
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
