import React from 'react';
import { Notification } from '../types';

interface NotificationsProps {
  items: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ items }) => {
  return (
    <div className="p-6 space-y-6 animate-fade-up">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-[#2c3e50] tracking-tight">التنبيهات</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Updates & Offers</p>
      </div>

      <div className="space-y-4">
        {items.map(note => (
          <div key={note.id} className={`p-5 rounded-[1.8rem] border flex gap-4 ${note.isRead ? 'bg-white border-pink-50' : 'bg-pink-50/30 border-[#b33951]/20 shadow-sm'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${note.isRead ? 'bg-gray-50 text-gray-400' : 'bg-[#b33951] text-white'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#2c3e50] mb-1">{note.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">{note.message}</p>
              <span className="text-[9px] text-gray-300 font-bold mt-2 block uppercase">{note.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;