
import React, { useState } from 'react';
import { Customer, CreditTransaction, LoyaltyData } from '../types';
import { Icons } from './CategoryIcons';
import { CURRENCY, playClickSound } from '../constants';
import VIPCard from './VIPCard';

interface Props {
  initialCustomers: Customer[];
  onUpdateCustomers: (customers: Customer[]) => void;
}

const CustomerManagement: React.FC<Props> = ({ initialCustomers, onUpdateCustomers }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCardView, setShowCardView] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', isPreferred: false });
  const [newTransaction, setNewTransaction] = useState({ amount: '', note: '', type: 'debt' });

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) return;
    playClickSound('success');
    const customer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCustomer.name,
      phone: newCustomer.phone,
      isPreferred: newCustomer.isPreferred,
      totalCredit: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      transactions: []
    };
    onUpdateCustomers([customer, ...initialCustomers]);
    setNewCustomer({ name: '', phone: '', isPreferred: false });
    setShowAddModal(false);
  };

  const handleAddTransaction = () => {
    if (!selectedCustomer || !newTransaction.amount) return;
    playClickSound('success');
    const amount = Number(newTransaction.amount) * (newTransaction.type === 'payment' ? -1 : 1);
    
    const updatedCustomer = {
      ...selectedCustomer,
      totalCredit: selectedCustomer.totalCredit + amount,
      transactions: [
        {
          id: Math.random().toString(36).substr(2, 9),
          amount,
          date: new Date().toISOString().split('T')[0],
          note: newTransaction.note || (newTransaction.type === 'payment' ? 'تسديد مبلغ' : 'دين جديد')
        },
        ...selectedCustomer.transactions
      ]
    };

    onUpdateCustomers(initialCustomers.map(c => c.id === selectedCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(updatedCustomer);
    setNewTransaction({ amount: '', note: '', type: 'debt' });
  };

  const mockLoyaltyData = (c: Customer): LoyaltyData => ({
    points: Math.floor(c.totalCredit / 100),
    tier: c.isPreferred ? 'ذهبية' : 'فضية',
    cardNumber: `KH-${c.id.toUpperCase()}`,
    qrValue: `customer-${c.id}`,
    customerName: c.name,
    memberSince: c.joinedDate.split('-')[0]
  });

  return (
    <div className="p-6 space-y-6 animate-fade-up pb-32">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-black text-[#2c3e50] dark:text-white tracking-tighter">إدارة الزبائن</h1>
        <button 
          onClick={() => { playClickSound('soft'); setShowAddModal(true); }}
          className="bg-[#b33951] text-white p-3 rounded-2xl shadow-lg flex items-center gap-2"
        >
          <span className="text-xl font-bold">+</span>
          <span className="text-[10px] font-black uppercase">إضافة زبونة</span>
        </button>
      </div>

      {showAddModal && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border-2 border-[#b33951]/20 shadow-2xl space-y-5 animate-in slide-in-from-top duration-500">
          <div className="flex justify-between items-center">
             <h3 className="font-black text-[#2c3e50] dark:text-white">تسجيل زبونة جديدة</h3>
             <button onClick={() => setShowAddModal(false)} className="text-gray-300 hover:text-rose-500"><Icons.Trash className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="اسم الزبونة" className="w-full bg-pink-50/30 dark:bg-slate-700 p-4 rounded-2xl text-sm font-bold border-transparent focus:border-[#b33951] border transition-all" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
            <input type="tel" placeholder="رقم الهاتف" className="w-full bg-pink-50/30 dark:bg-slate-700 p-4 rounded-2xl text-sm font-bold border-transparent focus:border-[#b33951] border transition-all" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
            <label className="flex items-center gap-3 p-2 cursor-pointer">
               <input type="checkbox" checked={newCustomer.isPreferred} onChange={e => setNewCustomer({...newCustomer, isPreferred: e.target.checked})} className="w-5 h-5 accent-[#b33951]" />
               <span className="text-xs font-bold text-gray-500">زبونة VIP (مفضلة)</span>
            </label>
          </div>
          <button onClick={handleAddCustomer} className="w-full bg-[#b33951] text-white py-4 rounded-2xl font-black shadow-lg">حفظ البيانات</button>
        </div>
      )}

      {selectedCustomer ? (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
           <button onClick={() => setSelectedCustomer(null)} className="flex items-center gap-2 text-[#b33951] font-black text-xs mb-4">
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              العودة للقائمة
           </button>

           <div className="bg-white dark:bg-slate-800 p-6 rounded-[3rem] shadow-xl border border-pink-50 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 bg-pink-50 dark:bg-slate-700 rounded-[1.5rem] flex items-center justify-center text-2xl">👤</div>
                 <div>
                    <h2 className="text-xl font-black dark:text-white">{selectedCustomer.name}</h2>
                    <p className="text-xs font-bold text-gray-400">{selectedCustomer.phone}</p>
                 </div>
              </div>

              <div className="flex gap-4 mb-8">
                 <div className="flex-1 bg-pink-50/50 dark:bg-slate-900 p-4 rounded-3xl">
                    <p className="text-[9px] font-black text-[#b33951] uppercase mb-1">الديون الحالية</p>
                    <p className="text-xl font-black dark:text-white">{selectedCustomer.totalCredit.toLocaleString()} {CURRENCY}</p>
                 </div>
                 <button 
                  onClick={() => setShowCardView(!showCardView)}
                  className="flex-1 bg-[#c9a063] text-white p-4 rounded-3xl font-black text-xs flex flex-col items-center justify-center gap-1 shadow-lg shadow-[#c9a063]/20"
                 >
                    <Icons.VIP className="w-5 h-5" />
                    {showCardView ? 'إغلاق البطاقة' : 'عرض بطاقة VIP'}
                 </button>
              </div>

              {showCardView && <VIPCard data={mockLoyaltyData(selectedCustomer)} />}

              <div className="space-y-4 mt-8 pt-6 border-t border-pink-50">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">إضافة معاملة مالية</h3>
                <div className="flex gap-2">
                   <button onClick={() => setNewTransaction({...newTransaction, type: 'debt'})} className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all ${newTransaction.type === 'debt' ? 'bg-[#b33951] text-white shadow-md' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}>دين جديد</button>
                   <button onClick={() => setNewTransaction({...newTransaction, type: 'payment'})} className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all ${newTransaction.type === 'payment' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}>تسديد</button>
                </div>
                <input type="number" placeholder="المبلغ" className="w-full bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl text-sm font-bold border border-transparent focus:border-[#b33951]" value={newTransaction.amount} onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})} />
                <input type="text" placeholder="ملاحظة إضافية" className="w-full bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl text-sm font-bold border border-transparent focus:border-[#b33951]" value={newTransaction.note} onChange={e => setNewTransaction({...newTransaction, note: e.target.value})} />
                <button onClick={handleAddTransaction} className="w-full bg-[#2c3e50] text-white py-4 rounded-2xl font-black shadow-lg">تأكيد المعاملة</button>
              </div>

              <div className="mt-8 space-y-4">
                 <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">سجل المعاملات</h3>
                 {selectedCustomer.transactions.length > 0 ? selectedCustomer.transactions.map(t => (
                   <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <div>
                         <p className="text-xs font-black dark:text-white">{t.note}</p>
                         <p className="text-[9px] font-bold text-gray-400 uppercase">{t.date}</p>
                      </div>
                      <span className={`text-sm font-black ${t.amount > 0 ? 'text-rose-500' : 'text-green-500'}`}>
                        {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString()}
                      </span>
                   </div>
                 )) : <p className="text-[10px] text-center text-gray-400 font-bold italic py-4">لا توجد معاملات سابقة</p>}
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-4">
          {initialCustomers.map(c => (
            <div 
              key={c.id} 
              onClick={() => { playClickSound('soft'); setSelectedCustomer(c); }}
              className="bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] flex items-center justify-between border border-pink-50 shadow-sm active:scale-95 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${c.isPreferred ? 'bg-gradient-to-tr from-[#c9a063] to-[#f9e29c] text-white' : 'bg-pink-50 dark:bg-slate-700'}`}>
                    {c.isPreferred ? '👑' : '👤'}
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-[#2c3e50] dark:text-white group-hover:text-[#b33951] transition-colors">{c.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 tracking-wider">{c.phone}</p>
                 </div>
              </div>
              <div className="text-left">
                 <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">الدين</p>
                 <p className={`text-sm font-black ${c.totalCredit > 0 ? 'text-rose-500' : 'text-green-500'}`}>{c.totalCredit.toLocaleString()} {CURRENCY}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
