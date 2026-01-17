
import React from 'react';
import { Icons } from './CategoryIcons';
import { playClickSound } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  unreadNotifications?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage, isDarkMode, toggleDarkMode, unreadNotifications = 0 }) => {
  const handleToggleTheme = () => {
    playClickSound('sharp');
    toggleDarkMode();
  };

  const handleNav = (page: string) => {
    playClickSound('soft');
    onNavigate(page);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#fff5f7] dark:bg-[#0f172a] shadow-2xl overflow-hidden relative border-x border-pink-50 dark:border-slate-800 transition-colors duration-500">
      <header className="bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-md px-4 py-4 sticky top-0 z-40 border-b border-pink-50/50 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => handleNav('dashboard')} className="w-10 h-10 bg-[#b33951] rounded-2xl flex items-center justify-center shadow-lg shadow-[#b33951]/20 active:scale-90 transition-transform">
               <span className="text-white font-black text-xl leading-none pt-1">خ</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-[#2c3e50] dark:text-white leading-none tracking-tighter">خالص</h1>
              <span className="text-[8px] text-[#c9a063] tracking-[0.3em] uppercase mt-1 font-black">Management Elite</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
              onClick={handleToggleTheme}
              className="w-10 h-10 bg-pink-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-[#b33951] dark:text-[#c9a063] hover:bg-pink-100 dark:hover:bg-slate-600 transition-all active:rotate-12"
             >
                {isDarkMode ? <Icons.Home className="w-5 h-5" /> : <Icons.VIP className="w-5 h-5" />}
             </button>
             <button 
              onClick={() => handleNav('notifications')}
              className="w-10 h-10 bg-pink-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-[#b33951] dark:text-white hover:bg-pink-100 dark:hover:bg-slate-600 transition-colors relative"
             >
                <Icons.Notification className="w-5 h-5" strokeWidth={2.5} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-700 animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
             </button>
             <button 
              onClick={() => handleNav('profile')}
              className="w-10 h-10 rounded-2xl border-2 border-[#c9a063]/30 p-0.5 overflow-hidden active:scale-90 transition-transform"
             >
               <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Admin" className="w-full h-full object-cover rounded-[calc(1rem-2px)]" />
             </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow pb-28 overflow-y-auto custom-scrollbar">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-2xl h-24 border-t border-pink-50/50 dark:border-slate-800 flex items-center justify-around px-2 bottom-nav-shadow z-50">
        <NavButton icon={<Icons.Home />} label="الرئيسية" active={currentPage === 'dashboard'} onClick={() => handleNav('dashboard')} />
        <NavButton icon={<Icons.Inventory />} label="السلع" active={currentPage === 'inventory'} onClick={() => handleNav('inventory')} />
        <NavButton 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} 
          label="بيع" 
          active={currentPage === 'sales'} 
          onClick={() => handleNav('sales')} 
        />
        <NavButton icon={<Icons.Customers />} label="الزبائن" active={currentPage === 'customers'} onClick={() => handleNav('customers')} />
        <NavButton icon={<Icons.Reports />} label="التقارير" active={currentPage === 'reports'} onClick={() => handleNav('reports')} />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center flex-1 group transition-all">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 transform ${active ? 'bg-[#b33951] text-white shadow-xl shadow-[#b33951]/30 -translate-y-2' : 'bg-transparent text-gray-300 dark:text-slate-500'}`}>
      {icon}
    </div>
    <span className={`text-[8px] mt-1 font-black transition-all uppercase tracking-widest ${active ? 'text-[#b33951] opacity-100' : 'text-gray-300 dark:text-slate-500 opacity-0'}`}>{label}</span>
  </button>
);

export default Layout;
