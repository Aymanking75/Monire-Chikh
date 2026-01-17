import React from 'react';
import VIPCard from './VIPCard';
import { LoyaltyData } from '../types';

interface ProfileOptionsProps {
  loyaltyData: LoyaltyData;
}

const ProfileOptions: React.FC<ProfileOptionsProps> = ({ loyaltyData }) => {
  return (
    <div className="p-6 space-y-8 animate-fade-up">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-[#2c3e50] tracking-tight">الخيارات الشخصية</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Settings & Identity</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-500 px-2">بطاقة الولاء الخاصة بكِ</h2>
        <VIPCard data={loyaltyData} />
      </div>

      <div className="bg-white rounded-[2rem] border border-pink-50 divide-y divide-pink-50 overflow-hidden shadow-sm">
        <OptionItem icon="👤" label="تعديل الملف الشخصي" />
        <OptionItem icon="📦" label="طلباتي السابقة" />
        <OptionItem icon="📍" label="عناوين التوصيل" />
        <OptionItem icon="💳" label="وسائل الدفع" />
        <OptionItem icon="🔗" label="تواصل معنا" />
      </div>

      <button className="w-full py-5 rounded-2xl border-2 border-[#b33951]/20 text-[#b33951] font-bold text-sm hover:bg-[#b33951] hover:text-white transition-all">
        تسجيل الخروج
      </button>
    </div>
  );
};

const OptionItem: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <button className="w-full flex items-center justify-between p-5 hover:bg-pink-50 transition-colors group">
    <div className="flex items-center gap-4">
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-bold text-[#2c3e50]">{label}</span>
    </div>
    <svg className="w-4 h-4 text-gray-300 group-hover:text-[#b33951] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
  </button>
);

export default ProfileOptions;