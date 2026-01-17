
import React, { useState } from 'react';
import { CartItem } from '../types';
import { playClickSound, CURRENCY } from '../constants';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string, size: string, color: string) => void;
  onUpdateQuantity: (id: string, size: string, color: string, delta: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdateQuantity, onCheckout }) => {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeDeliveryThreshold = 20000;
  const delivery = subtotal >= freeDeliveryThreshold ? 0 : 600;
  const total = subtotal + delivery;
  const progressToFree = Math.min((subtotal / freeDeliveryThreshold) * 100, 100);

  const handleRemove = (id: string, size: string, color: string) => {
    playClickSound('sharp');
    setRemovingId(`${id}-${size}-${color}`);
    setTimeout(() => {
      onRemove(id, size, color);
      setRemovingId(null);
    }, 350);
  };

  const handleUpdate = (id: string, size: string, color: string, delta: number, currentQty: number) => {
    if (currentQty + delta < 1) return;
    playClickSound('soft');
    const key = `${id}-${size}-${color}`;
    setUpdatingId(key);
    onUpdateQuantity(id, size, color, delta);
    setTimeout(() => setUpdatingId(null), 400);
  };

  if (items.length === 0) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-full pt-32 animate-fade-up">
        <div className="w-40 h-40 bg-pink-50 dark:bg-slate-800 rounded-[3.5rem] flex items-center justify-center mb-8 shadow-inner relative">
           <svg className="w-16 h-16 text-[#b33951] opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
           <div className="absolute -top-2 -right-2 w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-xl animate-bounce">
              <span className="text-2xl">✨</span>
           </div>
        </div>
        <h2 className="text-2xl font-black text-[#2c3e50] dark:text-white mb-3 tracking-tighter">حقيبتكِ فارغة تماماً</h2>
        <p className="text-gray-400 dark:text-slate-500 text-sm mb-10 font-bold max-w-[220px] leading-relaxed italic">"الأناقة تبدأ بقطعة واحدة، ابحثي عن إلهامكِ الآن"</p>
        <button 
          onClick={() => window.location.hash = 'sales'} 
          className="bg-[#b33951] text-white px-12 py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-[#b33951]/30 active:scale-95 transition-all hover:bg-[#a02f45]"
        >
          ابدئي التسوق
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-up pb-40">
      <div className="text-center">
        <h1 className="text-3xl font-black text-[#2c3e50] dark:text-white tracking-tighter">حقيبة التسوق</h1>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="w-1.5 h-1.5 bg-[#c9a063] rounded-full animate-pulse"></span>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Curated Elegance</p>
          <span className="w-1.5 h-1.5 bg-[#c9a063] rounded-full animate-pulse"></span>
        </div>
      </div>
      
      <div className="space-y-5">
        {items.map((item) => {
          const itemKey = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
          const isRemoving = removingId === itemKey;
          const isUpdating = updatingId === itemKey;

          return (
            <div 
              key={itemKey} 
              className={`bg-white dark:bg-slate-800 p-4 rounded-[2.8rem] flex gap-5 border border-pink-50/50 dark:border-slate-700 shadow-sm relative group transition-all duration-500 ${isRemoving ? 'opacity-0 scale-90 -translate-x-full' : 'opacity-100 scale-100'}`}
            >
              <div className="w-28 h-32 flex-shrink-0 rounded-[2rem] overflow-hidden shadow-md relative">
                <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div className="flex-grow py-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-[#2c3e50] dark:text-white text-sm mb-1 truncate max-w-[120px]">{item.name}</h3>
                    <button 
                      onClick={() => handleRemove(item.id, item.selectedSize, item.selectedColor)}
                      className="text-gray-300 dark:text-slate-600 hover:text-rose-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#b33951] font-black text-lg">{(item.price * item.quantity).toLocaleString()}</span>
                    <span className="text-[9px] font-black text-[#b33951]/40 uppercase">{CURRENCY}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-[1.2rem] p-1 border border-gray-100 dark:border-slate-700">
                    <button 
                      onClick={() => handleUpdate(item.id, item.selectedSize, item.selectedColor, 1, item.quantity)} 
                      className="text-[#b33951] font-black w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90"
                    >
                      +
                    </button>
                    <span className={`mx-3 text-xs font-black transition-all duration-300 ${isUpdating ? 'scale-150 text-[#b33951] brightness-125' : 'scale-100 dark:text-white'}`}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => handleUpdate(item.id, item.selectedSize, item.selectedColor, -1, item.quantity)} 
                      className="text-gray-400 font-black w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90"
                    >
                      -
                    </button>
                  </div>
                  <div className="flex items-center gap-2 bg-pink-50/30 dark:bg-slate-700/30 px-3 py-2 rounded-full border border-pink-100/50">
                     <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: item.colors.find(c => c.name === item.selectedColor)?.hex || '#ccc' }}></div>
                     <span className="text-[10px] font-black text-[#b33951] dark:text-pink-300 uppercase">{item.selectedSize}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Summary Section */}
      <div className="bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-2xl p-8 rounded-[3.5rem] border border-pink-50 dark:border-slate-700 shadow-2xl mt-12 space-y-7 relative overflow-hidden group/summary">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#b33951]/5 rounded-full blur-3xl group-hover/summary:bg-[#b33951]/10 transition-colors"></div>
        
        {/* Progress Bar for Free Delivery */}
        <div className="space-y-3">
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className={subtotal >= freeDeliveryThreshold ? "text-green-500 flex items-center gap-1" : "text-gray-400"}>
                {subtotal >= freeDeliveryThreshold ? "✅ الشحن المجاني مفعّل" : "خطواتكِ نحو الشحن المجاني"}
              </span>
              <span className="text-[#c9a063] font-black">
                {subtotal >= freeDeliveryThreshold ? "مبارك!" : `${(freeDeliveryThreshold - subtotal).toLocaleString()} ${CURRENCY}`}
              </span>
           </div>
           <div className="h-2.5 w-full bg-pink-50 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#b33951] via-[#f48fb1] to-[#c9a063] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressToFree}%` }}
              ></div>
           </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-pink-50 dark:border-slate-800">
          <div className="flex justify-between items-center text-gray-500 dark:text-slate-400">
            <span className="font-bold text-xs uppercase tracking-widest">مجموع القطع</span>
            <span className="font-black text-sm">{subtotal.toLocaleString()} {CURRENCY}</span>
          </div>
          <div className="flex justify-between items-center text-gray-500 dark:text-slate-400">
            <span className="font-bold text-xs uppercase tracking-widest">رسوم التوصيل والخدمة</span>
            <span className={`font-black text-sm ${delivery === 0 ? 'text-green-500 underline decoration-double' : ''}`}>
              {delivery === 0 ? 'مجاني تماماً' : `${delivery.toLocaleString()} ${CURRENCY}`}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="font-black text-sm text-[#2c3e50] dark:text-white uppercase tracking-tighter">المبلغ المستحق</span>
          <div className="text-left flex items-baseline gap-1 animate-pulse">
            <span className="font-black text-4xl text-[#b33951] tracking-tighter">{total.toLocaleString()}</span>
            <span className="text-[12px] font-black text-[#b33951] uppercase">{CURRENCY}</span>
          </div>
        </div>
        
        <div className="relative pt-4">
          <button 
            onClick={() => { playClickSound('success'); onCheckout(); }}
            className="w-full bg-gradient-to-r from-[#b33951] to-[#922b40] text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-[#b33951]/20 transform active:scale-95 transition-all overflow-hidden group"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000"></div>
            <span className="relative z-10">تأكيد الطلب الآن</span>
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-4 opacity-40 grayscale pt-2 border-t border-pink-50/50 dark:border-slate-800">
           <div className="h-6 w-10 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
           <div className="h-6 w-10 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
           <div className="h-6 w-10 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
