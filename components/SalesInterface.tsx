
import React, { useState, useMemo } from 'react';
import { Product, Customer, CartItem, Category } from '../types';
import { CURRENCY, playClickSound } from '../constants';
import { Icons } from './CategoryIcons';
import CategoryFilter from './CategoryFilter';
import ProductDetail from './ProductDetail';

interface SalesInterfaceProps {
  customers: Customer[];
  products: Product[];
  onCompleteSale: (cart: CartItem[], customerId: string | null, paymentMethod: string, total: number) => void;
}

const SalesInterface: React.FC<SalesInterfaceProps> = ({ customers, products, onCompleteSale }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'credit'>('cash');
  const [isCartBouncing, setIsCartBouncing] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === Category.ALL || p.category === selectedCategory;
      const matchesColor = selectedColors.length === 0 || p.colors.some(c => selectedColors.includes(c.name));
      return matchesSearch && matchesCategory && matchesColor;
    });
  }, [searchQuery, selectedCategory, selectedColors, products]);

  const addToCart = (product: Product, size?: string) => {
    if (product.stock <= 0) {
      alert("عذراً، هذه القطعة نفدت من المخزون.");
      return;
    }
    playClickSound('success');
    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 500);

    setCart(prev => {
      const selectedSize = size || product.sizes[0] || 'N/A';
      const selectedColor = product.colors[0]?.name || 'N/A';
      const existing = prev.find(item => item.id === product.id && item.selectedSize === selectedSize);
      
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === selectedSize) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize, selectedColor }];
    });
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = selectedCustomer?.isPreferred ? (subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const handleConfirmSale = () => {
    onCompleteSale(cart, selectedCustomerId, paymentMethod, total);
    // تفريغ السلة محلياً استعداداً للبيع القادم
    setCart([]);
    setShowCheckout(false);
    setSelectedCustomerId(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#fff5f7] dark:bg-[#0f172a] animate-fade-up">
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={(p, s) => { addToCart(p, s); setSelectedProduct(null); }}
        />
      )}
      
      {showCheckout && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 space-y-6 shadow-2xl animate-in zoom-in duration-300">
              <div className="text-center">
                 <h2 className="text-2xl font-black text-[#2c3e50] dark:text-white">تأكيد العملية</h2>
                 <p className="text-xs text-gray-400 font-bold mt-1">راجعي البيانات قبل إتمام الحجز</p>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">الزبونة</label>
                    <select 
                      className="w-full bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-[#b33951] outline-none dark:text-white transition-all"
                      value={selectedCustomerId || ''}
                      onChange={(e) => setSelectedCustomerId(e.target.value || null)}
                    >
                       <option value="">زبون نقدي</option>
                       {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">طريقة الدفع</label>
                    <div className="grid grid-cols-3 gap-2">
                       {(['cash', 'card', 'credit'] as const).map(m => (
                         <button key={m} onClick={() => setPaymentMethod(m)} className={`py-3 rounded-xl font-black text-[10px] border-2 transition-all ${paymentMethod === m ? 'bg-[#b33951] text-white border-[#b33951]' : 'bg-gray-50 dark:bg-slate-800 text-gray-400 border-transparent'}`}>
                           {m === 'cash' ? 'نقداً' : m === 'card' ? 'بطاقة' : 'دين'}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="bg-pink-50 dark:bg-slate-800 p-6 rounded-[2rem] border border-pink-100 dark:border-slate-700">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-black dark:text-white">المبلغ النهائي:</span>
                    <span className="text-xl font-black text-[#b33951]">{total.toLocaleString()} DA</span>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setShowCheckout(false)} className="flex-1 py-4 text-gray-400 font-bold text-sm">إلغاء</button>
                 <button onClick={handleConfirmSale} className="flex-[2] bg-[#b33951] text-white py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-all">تأكيد البيع</button>
              </div>
           </div>
        </div>
      )}
      
      <div className="p-4 bg-white dark:bg-[#1e293b] border-b border-pink-50 dark:border-slate-800 space-y-4 sticky top-0 z-30 shadow-sm transition-colors duration-500">
        <div className="relative">
          <input 
            type="text" placeholder="ابحثي عن قطعة..." 
            className="w-full bg-pink-50/50 dark:bg-slate-700 border border-pink-100 dark:border-slate-600 rounded-2xl py-4 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-[#b33951] dark:text-white transition-all"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        <CategoryFilter selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      <div className="flex-grow overflow-y-auto p-4 grid grid-cols-2 gap-4 pb-48 custom-scrollbar">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white dark:bg-slate-800 p-3 rounded-[2.5rem] border border-pink-50 dark:border-slate-700 shadow-sm flex flex-col items-center text-center relative group">
            <div onClick={() => setSelectedProduct(product)} className="aspect-[3/4] w-full rounded-[2rem] overflow-hidden mb-3 bg-gray-50 dark:bg-slate-700 cursor-pointer relative">
              <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
              {product.stock <= 5 && product.stock > 0 && <div className="absolute top-2 left-2 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-full">قاربت على النفاد</div>}
              {product.stock === 0 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]"><span className="text-white font-black text-xs -rotate-12 border-2 border-white px-3 py-1 rounded-lg">نفدت الكمية</span></div>}
            </div>
            <h4 className="text-[11px] font-black text-[#2c3e50] dark:text-white truncate w-full px-1">{product.name}</h4>
            <div className="bg-[#b33951] px-5 py-2.5 mt-2 rounded-2xl w-full cursor-pointer active:scale-95 transition-transform flex items-center justify-center gap-2" onClick={() => addToCart(product)}>
              <span className="text-white font-black text-xs">{product.price.toLocaleString()} {CURRENCY}</span>
              <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            </div>
          </div>
        ))}
      </div>

      <div className={`fixed bottom-24 left-0 right-0 max-w-md mx-auto px-4 pointer-events-none transition-transform duration-300 ${isCartBouncing ? 'scale-105' : 'scale-100'}`}>
        <div className="bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-pink-50 dark:border-slate-800 p-6 pointer-events-auto">
          <div className="flex justify-between items-center mb-6">
             <span className="text-sm font-black dark:text-white">إجمالي السلة</span>
             <span className="text-2xl font-black text-[#b33951]">{subtotal.toLocaleString()} {CURRENCY}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
            className="w-full bg-[#b33951] text-white py-5 rounded-[1.8rem] font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            مراجعة وتأكيد البيع
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesInterface;
