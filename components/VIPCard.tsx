
import React, { useState } from 'react';
import { LoyaltyData } from '../types';
import { playClickSound } from '../constants';

interface VIPCardProps {
  data: LoyaltyData;
}

const VIPCard: React.FC<VIPCardProps> = ({ data }) => {
  const [showBack, setShowBack] = useState(false);

  const getTierStyles = () => {
    switch (data.tier) {
      case 'ذهبية':
        return {
          bg: '#0a0a0a',
          gradient: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)',
          accent: 'linear-gradient(135deg, #d4af37, #f9e29c, #b8860b)',
          textColor: '#d4af37',
          chipColor: 'linear-gradient(135deg, #f9e29c, #d4af37, #b8860b)',
          borderColor: 'rgba(212, 175, 55, 0.4)',
          glow: 'rgba(212, 175, 55, 0.2)',
          label: 'زبون مفضل - VIP'
        };
      case 'فضية':
      default:
        return {
          bg: '#1a1c23',
          gradient: 'linear-gradient(135deg, #2a2d3e 0%, #1a1c23 50%, #2a2d3e 100%)',
          accent: 'linear-gradient(135deg, #cbd5e1, #f8fafc, #94a3b8)',
          textColor: '#cbd5e1',
          chipColor: 'linear-gradient(135deg, #f8fafc, #cbd5e1, #94a3b8)',
          borderColor: 'rgba(148, 163, 184, 0.3)',
          glow: 'rgba(203, 213, 225, 0.15)',
          label: 'زبون عادي - CLASSIC'
        };
    }
  };

  const style = getTierStyles();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.qrValue)}&bgcolor=${style.bg.replace('#', '')}&color=${style.textColor.replace('#', '')}`;

  const brandPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-family='Cairo' font-weight='900' font-size='12' fill='${encodeURIComponent(style.textColor)}' fill-opacity='0.08' text-anchor='middle' dominant-baseline='middle' transform='rotate(-45 50 50)'%3Eخالص%3C/text%3E%3C/svg%3E")`;

  const handleShare = async () => {
    playClickSound('soft');
    const shareText = `✨ أنا عضو متميز في متجر "خالص" للأزياء النسائية!\n💎 فئة العضوية: ${data.tier}\n🏷️ رقم البطاقة: ${data.cardNumber}\n\nانضموا إلينا لتجربة تسوق راقية وفخمة.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'بطاقة عضوية خالص الفاخرة',
          text: shareText,
          url: window.location.origin
        });
        playClickSound('success');
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('تم نسخ تفاصيل البطاقة! يمكنك الآن مشاركتها مع صديقاتك.');
        playClickSound('success');
      } catch (err) {
        alert('عذراً، المتصفح لا يدعم المشاركة.');
      }
    }
  };

  const exportToPDF = () => {
    playClickSound('soft');
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) return;

    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>بطاقة عضوية خالص - ${data.customerName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@700;900&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Cairo', sans-serif; background: #fdfdfd; display: flex; flex-direction: column; align-items: center; padding: 40px; }
            .print-area { display: flex; gap: 30px; flex-wrap: wrap; justify-content: center; }
            .card {
              width: 85.6mm; height: 53.98mm;
              position: relative; border-radius: 5mm; overflow: hidden;
              background: ${style.bg}; color: white;
              box-shadow: 0 10px 30px rgba(0,0,0,0.15);
              border: 0.5pt solid ${style.borderColor};
              -webkit-print-color-adjust: exact; print-color-adjust: exact;
            }
            .gradient { position: absolute; inset: 0; background: ${style.gradient}; }
            .pattern {
              position: absolute; inset: 0; opacity: 1;
              background-image: ${brandPattern};
              background-size: 40px 40px;
            }
            @media print { body { background: white; padding: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="no-print mb-12 text-center">
             <div class="inline-block p-4 bg-pink-50 rounded-3xl mb-4">
                <h1 class="text-2xl font-black text-[#b33951]">معاينة بطاقة خالص VIP</h1>
             </div>
             <p class="text-sm text-gray-500 font-bold">يرجى التأكد من جودة الورق المستخدم قبل الطباعة</p>
             <button onclick="window.print()" class="mt-6 bg-[#b33951] text-white px-10 py-4 rounded-full font-black shadow-xl shadow-[#b33951]/20 hover:scale-105 transition-transform">بدء الطباعة الاحترافية</button>
          </div>
          
          <div class="print-area">
            <div class="card">
              <div class="gradient"></div>
              <div class="pattern"></div>
              <div style="position: relative; z-index: 10; padding: 7mm; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div style="font-size: 26px; font-weight: 900; color: ${style.textColor}; letter-spacing: -1px;">خالص</div>
                  <div style="background: ${style.textColor}; color: ${style.bg}; padding: 3px 12px; border-radius: 6px; font-size: 9px; font-weight: 900; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">عضوية ${data.tier}</div>
                </div>
                <div>
                   <div style="width: 12mm; height: 9mm; background: ${style.chipColor}; border-radius: 2mm; margin-bottom: 4mm; box-shadow: inset 0 0 5px rgba(0,0,0,0.2);"></div>
                   <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px; color: white;">${data.customerName}</div>
                   <div style="font-size: 8px; opacity: 0.8; font-weight: 700; color: ${style.textColor}; margin-top: 1px;">${style.label}</div>
                   <div style="font-size: 9px; opacity: 0.6; font-family: monospace; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2px;">${data.cardNumber}</div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="gradient"></div>
              <div class="pattern" style="opacity: 0.3;"></div>
              <div style="position: relative; z-index: 10; padding: 6mm; height: 100%; display: flex; align-items: center; justify-content: space-between;">
                <div style="width: 45%; display: flex; flex-direction: column; gap: 6px;">
                   <div style="font-size: 9px; font-weight: 900; color: ${style.textColor};">SCAN TO VERIFY</div>
                   <div style="font-size: 8px; opacity: 0.7; line-height: 1.6; font-weight: 500;">أهلاً بكِ في عالم خالص. هذه البطاقة هي هويتكِ الخاصة للحصول على أفضل المزايا والخصومات الحصرية.</div>
                   <div style="margin-top: 12px; font-size: 10px; font-weight: 900; color: ${style.textColor}">KHALES FASHION</div>
                </div>
                <div style="background: white; padding: 6px; border-radius: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
                   <img src="${qrUrl}" style="width: 32mm; height: 32mm;" />
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <style>{`
        .card-inner { transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; cursor: pointer; position: relative; width: 100%; height: 100%; }
        .card-inner.is-flipped { transform: rotateY(180deg); }
        .card-face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 2.5rem; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid ${style.borderColor}; }
        .card-back { transform: rotateY(180deg); }
        
        .shimmer {
          position: absolute;
          top: -100%;
          left: -100%;
          width: 300%;
          height: 300%;
          background: linear-gradient(
            45deg,
            transparent 45%,
            rgba(255, 255, 255, 0.05) 48%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.05) 52%,
            transparent 55%
          );
          animation: shimmer-swipe 6s infinite linear;
          pointer-events: none;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }

        .group-card:hover .shimmer {
          opacity: 1;
          animation: shimmer-swipe 2s infinite linear;
        }

        /* Hover-triggered premium glint */
        .glint-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 40%,
            rgba(255, 255, 255, 0.3) 45%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.3) 55%,
            transparent 60%
          );
          transform: translateX(-150%) skewX(-20deg);
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 15;
        }

        .group-card:hover .glint-overlay {
          transform: translateX(150%) skewX(-20deg);
        }

        @keyframes shimmer-swipe {
          0% { transform: translate(-20%, -20%); }
          100% { transform: translate(10%, 10%); }
        }

        .dynamic-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), ${style.glow} 0%, transparent 70%);
          pointer-events: none;
          mix-blend-mode: soft-light;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .group-card:hover .dynamic-glow {
          opacity: 1;
        }

        .card-border-glow {
          position: absolute;
          inset: 0;
          border-radius: 2.5rem;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.1));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>

      <div 
        className="relative w-full aspect-[1.58/1] mx-auto perspective-1000 group/card group-card"
        onClick={() => { playClickSound('soft'); setShowBack(!showBack); }}
        onMouseMove={(e) => {
          const card = e.currentTarget;
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--x', `${x}%`);
          card.style.setProperty('--y', `${y}%`);
        }}
      >
        <div className={`card-inner ${showBack ? 'is-flipped' : ''}`}>
          
          {/* Front Face */}
          <div className="card-face" style={{ background: style.bg }}>
            <div className="absolute inset-0" style={{ background: style.gradient }}></div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: brandPattern, backgroundSize: '60px 60px' }}></div>
            <div className="shimmer"></div>
            <div className="glint-overlay"></div>
            <div className="dynamic-glow"></div>
            <div className="card-border-glow"></div>
            
            <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <h3 className="text-4xl font-black tracking-tighter" style={{ color: style.textColor }}>خالص</h3>
                  <span className="text-[7px] opacity-40 font-black uppercase tracking-[0.4em] mt-1">Fashion Elite</span>
                </div>
                <div className="flex flex-col items-end">
                   <div className="px-5 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black shadow-lg">عضوية {data.tier}</div>
                   <span className="text-[7px] mt-2 opacity-60 font-black uppercase tracking-widest" style={{ color: style.textColor }}>{style.label}</span>
                </div>
              </div>

              <div className="space-y-5">
                 <div className="w-14 h-10 rounded-xl shadow-2xl relative overflow-hidden group/chip" style={{ background: style.chipColor }}>
                    <div className="absolute inset-0 bg-black/10 opacity-40" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.2) 50%)', backgroundSize: '4px 100%' }}></div>
                 </div>
                 <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xl font-black uppercase tracking-wider text-white drop-shadow-md">{data.customerName}</p>
                      <p className="text-[10px] font-mono opacity-50 tracking-[0.3em] mt-1">{data.cardNumber}</p>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[8px] font-black opacity-40 uppercase">Points</span>
                       <span className="text-lg font-black" style={{ color: style.textColor }}>{data.points.toLocaleString()}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Back Face */}
          <div className="card-face card-back" style={{ background: style.bg }}>
            <div className="absolute inset-0" style={{ background: style.gradient }}></div>
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: brandPattern, backgroundSize: '100px 100px' }}></div>
            <div className="shimmer" style={{ animationDelay: '-2s' }}></div>
            <div className="glint-overlay"></div>
            <div className="card-border-glow"></div>
            
            <div className="relative z-10 h-full p-8 flex items-center justify-between">
              <div className="w-1/2 space-y-5 text-white text-right">
                 <h4 className="text-sm font-black uppercase tracking-[0.2em]" style={{ color: style.textColor }}>Identity Verified</h4>
                 <p className="text-[10px] leading-relaxed opacity-60 font-medium">
                   {data.tier === 'ذهبية' 
                    ? 'أهلاً بكِ في النخبة. هذا الكود يمنحكِ أولوية الدخول للعروض وخصماً فورياً 10%.'
                    : 'امسحي الكود في كل عملية شراء لتجميع النقاط والترقية للعضوية الذهبية.'}
                 </p>
                 <div className="pt-2">
                    <p className="text-[11px] font-black" style={{ color: style.textColor }}>KHALES FASHION OFFICE</p>
                    <p className="text-[8px] opacity-40 mt-1 uppercase tracking-widest">Est. 2024 • Quality First</p>
                 </div>
              </div>
              <div className="bg-white p-3 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative group/qr">
                 <div className="absolute -inset-2 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-[2rem] opacity-0 group-hover/qr:opacity-100 transition-opacity"></div>
                 <img src={qrUrl} alt="QR Code" className="w-28 h-28" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={exportToPDF}
          className="bg-[#b33951] text-white py-5 rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-2xl shadow-[#b33951]/30 active:scale-95 transition-all hover:bg-[#a02f45] text-xs"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          تصدير للطباعة
        </button>
        <button 
          onClick={handleShare}
          className="bg-white dark:bg-slate-800 text-[#c9a063] border-2 border-[#c9a063]/30 py-5 rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-all text-xs"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          مشاركة البطاقة
        </button>
      </div>
      <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">انقر لقلب البطاقة • حرك الجوال لرؤية اللمعان</p>
    </div>
  );
};

export default VIPCard;
