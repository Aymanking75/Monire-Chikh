
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import CustomerManagement from './components/CustomerManagement';
import SalesInterface from './components/SalesInterface';
import ProfileOptions from './components/ProfileOptions';
import Favorites from './components/Favorites';
import Notifications from './components/Notifications';
import { Customer, LoyaltyData, Product, Notification, Category, Order, CartItem } from './types';
import { MOCK_PRODUCTS, playClickSound, CURRENCY } from './constants';
import { Icons } from './components/CategoryIcons';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('khales-theme') === 'dark');
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'inventory' | 'reports' | 'profile' | 'customers' | 'sales' | 'favorites' | 'notifications'>('dashboard');
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('khales-products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('khales-customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('khales-orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('khales-notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSaleSuccess, setActiveSaleSuccess] = useState<{
    id: string;
    total: number;
    items: CartItem[];
    customerName: string;
    paymentMethod: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('khales-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('khales-customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('khales-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('khales-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('khales-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleDeleteProduct = (productId: string) => {
    playClickSound('sharp');
    if (window.confirm('⚠️ هل أنتِ متأكدة من حذف هذه القطعة نهائياً؟ سيتم إزالتها من المخزن والمفضلات.')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      setFavorites(prev => prev.filter(p => p.id !== productId));
      
      setNotifications([{
        id: Math.random().toString(36).substr(2, 9),
        title: 'تم حذف منتج',
        message: 'تمت إزالة قطعة من النظام بنجاح.',
        date: 'الآن',
        isRead: false
      }, ...notifications]);
      playClickSound('success');
    }
  };

  const handleCompleteSale = (cart: CartItem[], customerId: string | null, paymentMethod: string, total: number) => {
    playClickSound('sale');

    const updatedProducts = products.map(p => {
      const cartItem = cart.find(item => item.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    });
    setProducts(updatedProducts);

    let cName = 'زبون نقدي';
    if (customerId) {
      const targetCustomer = customers.find(c => c.id === customerId);
      if (targetCustomer) {
        cName = targetCustomer.name;
        if (paymentMethod === 'credit') {
          setCustomers(customers.map(c => {
            if (c.id === customerId) {
              return {
                ...c,
                totalCredit: c.totalCredit + total,
                transactions: [{
                  id: Math.random().toString(36).substr(2, 9),
                  amount: total,
                  date: new Date().toISOString().split('T')[0],
                  note: `دين شراء: ${cart.map(i => i.name).join(', ')}`
                }, ...c.transactions]
              };
            }
            return c;
          }));
        }
      }
    }

    const orderId = `KH-${Date.now().toString().substr(-6)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: cName,
      total,
      status: 'تم التوصيل',
      date: new Date().toISOString(),
      items: cart
    };
    setOrders([newOrder, ...orders]);

    setNotifications([{
      id: Math.random().toString(36).substr(2, 9),
      title: 'عملية بيع ناجحة',
      message: `تم بيع طلبيّة بقيمة ${total.toLocaleString()} DA للزبونة ${cName}`,
      date: 'الآن',
      isRead: false
    }, ...notifications]);

    setActiveSaleSuccess({
      id: orderId,
      total,
      items: cart,
      customerName: cName,
      paymentMethod
    });
  };

  const handlePrintFromApp = () => {
    if (!activeSaleSuccess) return;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert("يرجى تفعيل النوافذ المنبثقة للطباعة.");
      return;
    }

    const itemsHtml = activeSaleSuccess.items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 15px 0; font-size: 14px;">
          <div style="font-weight: 900;">${item.name}</div>
          <div style="font-size: 10px; color: #888;">${item.selectedSize} | ${item.selectedColor}</div>
        </td>
        <td style="padding: 15px 0; text-align: center;">${item.quantity}</td>
        <td style="padding: 15px 0; text-align: left; font-weight: 700;">${(item.price * item.quantity).toLocaleString()} DA</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>فاتورة خالص - ${activeSaleSuccess.id}</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Cairo', sans-serif; padding: 50px; color: #2c3e50; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #b33951; padding-bottom: 30px; margin-bottom: 40px; }
            .brand { font-size: 50px; font-weight: 900; color: #b33951; margin: 0; }
            .info { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: right; border-bottom: 2px solid #2c3e50; padding: 10px 0; font-weight: 900; }
            .footer { border-top: 3px solid #2c3e50; padding-top: 20px; }
            .total-row { display: flex; justify-content: space-between; font-size: 22px; font-weight: 900; color: #b33951; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h1 class="brand">خالص</h1>
            <p style="letter-spacing: 5px; font-weight: 700;">KHALES FASHION MANAGEMENT</p>
          </div>
          <div class="info">
            <div>
              <p><strong>رقم الفاتورة:</strong> ${activeSaleSuccess.id}</p>
              <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-DZ')}</p>
            </div>
            <div style="text-align: left;">
              <p><strong>الزبونة:</strong> ${activeSaleSuccess.customerName}</p>
              <p><strong>طريقة الدفع:</strong> ${activeSaleSuccess.paymentMethod === 'cash' ? 'نقداً' : activeSaleSuccess.paymentMethod === 'card' ? 'بطاقة' : 'دين'}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>المنتج</th>
                <th style="text-align: center;">الكمية</th>
                <th style="text-align: left;">الإجمالي</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div class="footer">
            <div class="total-row">
              <span>الإجمالي النهائي:</span>
              <span>${activeSaleSuccess.total.toLocaleString()} DA</span>
            </div>
            <p style="text-align: center; margin-top: 50px; font-size: 12px; color: #aaa;">شكراً لثقتكم بمحل خالص للأزياء النسائية</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'customers':
        return <CustomerManagement initialCustomers={customers} onUpdateCustomers={setCustomers} />;
      case 'sales':
        return <SalesInterface customers={customers} products={products} onCompleteSale={handleCompleteSale} />;
      case 'profile':
        return <ProfileOptions loyaltyData={{ points: 0, tier: 'فضية', cardNumber: 'KH-ADMIN', qrValue: 'admin', customerName: 'الإدارة' }} />;
      case 'favorites':
        return <Favorites items={favorites} onRemove={(id) => setFavorites(f => f.filter(p => p.id !== id))} onView={(p) => {}} />;
      case 'notifications':
        return <Notifications items={notifications} />;
      case 'inventory':
        return <AdminDashboard page="inventory" products={products} setProducts={setProducts} onNavigate={setCurrentPage} orders={orders} onDeleteProduct={handleDeleteProduct} />;
      case 'reports':
        return <AdminDashboard page="reports" products={products} setProducts={setProducts} onNavigate={setCurrentPage} orders={orders} onDeleteProduct={handleDeleteProduct} />;
      default:
        return <AdminDashboard page="dashboard" products={products} setProducts={setProducts} onNavigate={setCurrentPage} orders={orders} onDeleteProduct={handleDeleteProduct} />;
    }
  };

  if (showSplash) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-[#fff5f7] dark:bg-[#0f172a] flex flex-col items-center justify-center text-center p-6">
        <div className="animate-in fade-in zoom-in duration-1000">
           <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-2xl mb-6 mx-auto">
              <h1 className="text-4xl font-black text-[#c9a063]">خالص</h1>
           </div>
           <h2 className="text-sm font-black text-[#b33951] tracking-[0.3em] uppercase">نظام الإدارة النخبة</h2>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      onNavigate={(page) => setCurrentPage(page as any)} 
      currentPage={currentPage} 
      isDarkMode={isDarkMode} 
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      unreadNotifications={notifications.filter(n => !n.isRead).length}
    >
      {renderContent()}

      {activeSaleSuccess && (
        <div className="fixed inset-0 z-[200] bg-white dark:bg-[#0f172a] flex flex-col items-center justify-center p-8 animate-in fade-in slide-in-from-bottom duration-500">
           <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/30 animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
           </div>
           <h2 className="text-3xl font-black text-[#2c3e50] dark:text-white mb-2">تم تسجيل البيع!</h2>
           <p className="text-gray-400 font-bold mb-10">رقم الفاتورة: {activeSaleSuccess.id}</p>

           <div className="bg-pink-50 dark:bg-slate-800 w-full p-8 rounded-[3rem] mb-10 text-center border border-pink-100 dark:border-slate-700">
              <span className="text-xs font-bold text-gray-400 block mb-2">المبلغ النهائي</span>
              <span className="text-4xl font-black text-[#b33951]">{activeSaleSuccess.total.toLocaleString()} DA</span>
           </div>

           <div className="w-full max-w-xs space-y-4">
              <button 
                onClick={handlePrintFromApp}
                className="w-full bg-[#c9a063] text-white py-5 rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <Icons.Reports className="w-5 h-5" />
                طبع الفاتورة
              </button>
              <button 
                onClick={() => setActiveSaleSuccess(null)}
                className="w-full bg-[#b33951] text-white py-5 rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                بيع جديد
              </button>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
