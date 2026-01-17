
import React, { useState, useMemo, useRef } from 'react';
import { CURRENCY, playClickSound } from '../constants';
import ProductDetail from './ProductDetail';
import { Product, Category, Order } from '../types';
import CategoryFilter from './CategoryFilter';
import { Icons } from './CategoryIcons';
import { analyzeImageColors, analyzeBusinessProfit } from '../services/geminiService';

interface AdminDashboardProps {
  page: string;
  onNavigate: (page: any) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  onDeleteProduct: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ page, onNavigate, products, setProducts, orders, onDeleteProduct }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAiColorLoading, setIsAiColorLoading] = useState(false);
  const [isAiProfitLoading, setIsAiProfitLoading] = useState(false);
  const [profitInsight, setProfitInsight] = useState<string | null>(null);

  // إجمالي المبيعات المحققة فعلياً
  const totalSalesVolume = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
  
  const currentMonthSales = useMemo(() => {
    const now = new Date();
    return orders
      .filter(o => new Date(o.date).getMonth() === now.getMonth())
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', description: '', purchasePrice: 0, price: 0, stock: 0, category: Category.DRESSES, images: [], colors: []
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');

  const filteredProducts = useMemo(() => {
    return products.filter(p => selectedCategory === Category.ALL || p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setNewProduct(prev => ({ ...prev, images: [base64String] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectColors = async () => {
    if (!imagePreview) return;
    setIsAiColorLoading(true);
    playClickSound('soft');
    const colors = await analyzeImageColors(imagePreview, imageMimeType);
    if (colors && colors.length > 0) {
      setNewProduct(prev => ({ ...prev, colors }));
      playClickSound('success');
    }
    setIsAiColorLoading(false);
  };

  const handleGetProfitInsight = async () => {
    if (products.length === 0) return;
    setIsAiProfitLoading(true);
    playClickSound('success');
    const insight = await analyzeBusinessProfit(products);
    setProfitInsight(insight);
    setIsAiProfitLoading(false);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert("يرجى إدخال البيانات الأساسية.");
      return;
    }
    playClickSound('success');
    const p: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      description: newProduct.description || '',
      purchasePrice: newProduct.purchasePrice || 0,
      price: newProduct.price || 0,
      discountPercentage: 0,
      category: newProduct.category || Category.DRESSES,
      images: newProduct.images?.length ? newProduct.images : ['https://images.unsplash.com/photo-1521335629791-ce4aec67dd15?q=80&w=300'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: newProduct.colors?.length ? newProduct.colors : [{ name: 'افتراضي', hex: '#b33951' }],
      stock: newProduct.stock || 0
    };
    setProducts([p, ...products]);
    setShowAddForm(false);
    setNewProduct({ name: '', purchasePrice: 0, price: 0, stock: 0, description: '', category: Category.DRESSES, images: [], colors: [] });
    setImagePreview(null);
  };

  if (page === 'dashboard') {
    return (
      <div className="p-5 space-y-6 animate-fade-up">
        <h2 className="text-2xl font-black text-[#2c3e50] dark:text-white">نظرة عامة</h2>
        
        <div className="bg-gradient-to-br from-[#b33951] to-[#8a2a3c] p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
          <p className="text-white/70 text-sm font-bold mb-2">إجمالي المبيعات المحققة</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black tracking-tighter">{totalSalesVolume.toLocaleString()}</h3>
            <span className="text-xl font-bold text-[#c9a063]">{CURRENCY}</span>
          </div>
          <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard iconColor="text-[#b33951]" title="المخزون" value={products.length.toString()} sub="قطعة" icon={<Icons.Inventory />} onClick={() => onNavigate('inventory')} />
          <StatCard iconColor="text-[#c9a063]" title="الطلبيات" value={orders.length.toString()} sub="طلب" icon={<Icons.Orders />} onClick={() => onNavigate('reports')} />
        </div>
      </div>
    );
  }

  if (page === 'inventory') {
    return (
      <div className="p-5 space-y-6 animate-fade-up pb-32">
        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onDelete={(id) => { onDeleteProduct(id); setSelectedProduct(null); }}
          />
        )}

        <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-pink-50 dark:border-slate-700">
          <h2 className="text-xl font-bold dark:text-white">إدارة السلع</h2>
          <button onClick={() => setShowAddForm(true)} className="bg-[#b33951] text-white p-3 rounded-2xl flex items-center gap-2 shadow-lg active:scale-95 transition-all">
            <span className="text-xl font-bold">+</span>
            <span className="text-xs font-bold">إدراج سلع</span>
          </button>
        </div>

        <CategoryFilter selectedCategory={selectedCategory} onSelect={setSelectedCategory} />

        {showAddForm && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border-2 border-[#b33951]/20 shadow-2xl space-y-5 animate-in slide-in-from-top duration-500">
             <div className="flex justify-between items-center">
               <h3 className="font-black dark:text-white">إضافة سلعة جديدة</h3>
               <button onClick={() => setShowAddForm(false)} className="text-gray-300">×</button>
             </div>
             
             <div className="relative">
                <div onClick={() => fileInputRef.current?.click()} className="aspect-video rounded-[2rem] bg-pink-50/50 dark:bg-slate-700 border-2 border-dashed border-pink-200 dark:border-slate-600 flex items-center justify-center cursor-pointer overflow-hidden">
                  {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-gray-400">إرفاق صورة</span>}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                {imagePreview && (
                  <button onClick={handleDetectColors} disabled={isAiColorLoading} className="absolute bottom-2 left-2 bg-white/90 dark:bg-slate-800 p-2 rounded-xl text-[8px] font-black text-[#b33951] shadow-lg">
                    {isAiColorLoading ? 'تحليل...' : 'تحليل الألوان AI'}
                  </button>
                )}
             </div>

             <input type="text" placeholder="اسم السلعة" className="w-full bg-gray-50 dark:bg-slate-700 p-4 rounded-2xl dark:text-white text-sm" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
             <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="سعر الشراء" className="w-full bg-gray-50 dark:bg-slate-700 p-4 rounded-2xl text-xs" value={newProduct.purchasePrice || ''} onChange={e => setNewProduct({...newProduct, purchasePrice: Number(e.target.value)})} />
                <input type="number" placeholder="سعر البيع" className="w-full bg-gray-50 dark:bg-slate-700 p-4 rounded-2xl text-xs" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
             </div>
             <button onClick={handleAddProduct} className="w-full bg-[#b33951] text-white py-5 rounded-2xl font-black shadow-xl">حفظ في المخزن</button>
          </div>
        )}

        <div className="space-y-4">
          {filteredProducts.map(p => (
            <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-pink-50 dark:border-slate-700 flex gap-4 items-center shadow-sm cursor-pointer hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={p.images[0]} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <h4 className="text-xs font-black dark:text-white truncate">{p.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-[10px] font-black text-[#b33951]">{p.price.toLocaleString()} DA</span>
                   <span className="text-[8px] bg-pink-50 dark:bg-slate-700 px-2.5 py-1 rounded-full text-[#b33951] font-black">{p.stock} قطعة</span>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteProduct(p.id); }} 
                className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl active:scale-90 transition-all"
              >
                <Icons.Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === 'reports') {
    const totalPotentialProfit = products.reduce((acc, p) => acc + (p.price - p.purchasePrice) * p.stock, 0);
    return (
      <div className="p-5 space-y-6 animate-fade-up pb-32">
        <h2 className="text-2xl font-black text-[#2c3e50] dark:text-white">التقارير المالية</h2>
        
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-pink-50 dark:border-slate-700 shadow-sm">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">مبيعات الشهر</p>
           <h3 className="text-4xl font-black text-[#b33951]">{currentMonthSales.toLocaleString()} <span className="text-sm">DA</span></h3>
        </div>

        <div className="bg-gradient-to-br from-[#c9a063] to-[#8d6e3f] p-8 rounded-[3rem] shadow-xl text-white">
           <p className="text-[10px] font-black opacity-80 mb-1">الأرباح المتوقعة في المخزن</p>
           <h3 className="text-3xl font-black">{totalPotentialProfit.toLocaleString()} DA</h3>
        </div>

        <div className="bg-slate-900 p-6 rounded-[2.5rem] space-y-4">
           <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-white">المحلل المالي AI</h3>
              <button onClick={handleGetProfitInsight} disabled={isAiProfitLoading} className="bg-[#b33951] text-white px-4 py-2 rounded-xl text-[9px] font-black">
                {isAiProfitLoading ? 'جاري التحليل...' : 'تحليل الأرباح'}
              </button>
           </div>
           {profitInsight && <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">{profitInsight}</p>}
        </div>
      </div>
    );
  }

  return null;
};

const StatCard: React.FC<{ iconColor: string, title: string, value: string, sub: string, icon: React.ReactNode, onClick: () => void }> = ({ iconColor, title, value, sub, icon, onClick }) => (
  <button onClick={onClick} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-pink-50 dark:border-slate-700 flex flex-col items-center text-center w-full active:scale-95 transition-all">
    <div className={`w-12 h-12 rounded-2xl mb-3 flex items-center justify-center ${iconColor} bg-pink-50/50`}>{icon}</div>
    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-black dark:text-white">{value}</span>
      <span className="text-[10px] font-bold text-gray-400">{sub}</span>
    </div>
  </button>
);

export default AdminDashboard;
