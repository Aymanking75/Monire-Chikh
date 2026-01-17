
import React from 'react';
import { Category } from '../types';
import { CategoryIcon } from './CategoryIcons';
import { playClickSound } from '../constants';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelect }) => {
  const categories = Object.values(Category);

  const handleSelect = (cat: Category) => {
    playClickSound('soft');
    onSelect(cat);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar px-1 no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          className={`flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl transition-all duration-300 ${
            selectedCategory === cat
              ? 'bg-[#b33951] text-white shadow-lg shadow-[#b33951]/30 scale-105'
              : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500 hover:bg-pink-50 dark:hover:bg-slate-700 border border-pink-50 dark:border-slate-700'
          }`}
        >
          <div className={`${selectedCategory === cat ? 'text-white' : 'text-[#c9a063]'} opacity-90`}>
            <CategoryIcon category={cat} className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider">{cat}</span>
        </button>
      ))}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;
