
import React from 'react';

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

export const Icons = {
  Home: ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Inventory: ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  VIP: ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Reports: ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Notification: ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Trash: ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Orders: ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Customers: ({ className = "w-6 h-6", strokeWidth = 1.5 }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
};

export const CategoryIcon: React.FC<{ category: string; className?: string }> = ({ category, className = "w-6 h-6" }) => {
  const commonProps = {
    className,
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
    viewBox: "0 0 24 24"
  };

  switch (category) {
    case 'فساتين':
      return (
        <svg {...commonProps}>
          {/* Dress Silhouette */}
          <path d="M8 2L10 8H14L16 2H8Z" />
          <path d="M10 8L7 22H17L14 8H10Z" />
          <path d="M10 8C10 8 11 10 12 10C13 10 14 8 14 8" />
        </svg>
      );
    case 'عبايات':
      return (
        <svg {...commonProps}>
          {/* Abaya Silhouette */}
          <path d="M12 3V21" strokeOpacity="0.3" />
          <path d="M6 3L4 21H20L18 3H6Z" />
          <path d="M9 3C9 4 10.5 5 12 5C13.5 5 15 4 15 3" />
          <path d="M7 10H17" strokeOpacity="0.2" />
        </svg>
      );
    case 'أطقم':
      return (
        <svg {...commonProps}>
          {/* Top and Bottom Set */}
          <path d="M6 4H18L17 11H7L6 4Z" />
          <path d="M8 11V20H11V15H13V20H16V11" />
          <path d="M10 4L11 6H13L14 4" />
        </svg>
      );
    case 'إكسسوارات':
      return (
        <svg {...commonProps}>
          {/* Handbag/Clutch Luxury Accessory */}
          <path d="M6 8H18V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V8Z" />
          <path d="M9 8V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V8" />
          <path d="M11 12H13" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <path d="M9 12H15" />
        </svg>
      );
  }
};
