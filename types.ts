
export enum Category {
  ALL = 'الكل',
  DRESSES = 'فساتين',
  ABAYAS = 'عبايات',
  SETS = 'أطقم',
  ACCESSORIES = 'إكسسوارات'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  purchasePrice: number;
  price: number;
  discountPercentage: number;
  category: Category;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
}

export interface CreditTransaction {
  id: string;
  amount: number; // قيمة موجبة للديون الجديدة، سالبة للمدفوعات
  date: string;
  note: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalCredit: number; // إجمالي الدين الحالي
  transactions: CreditTransaction[];
  joinedDate: string;
  isPreferred: boolean; // زبون مفضل (ذهبي) أو عادي (فضي)
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface LoyaltyData {
  points: number;
  tier: 'فضية' | 'ذهبية' | 'ماسية';
  cardNumber: string;
  qrValue: string;
  customerName: string;
  memberSince?: string;
}

export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'قيد التنفيذ' | 'تم الشحن' | 'تم التوصيل';
  date: string;
  items: CartItem[];
}
