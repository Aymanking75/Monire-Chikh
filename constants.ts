
import { Category, Product } from './types';

export const MOCK_PRODUCTS: Product[] = [];

export const CURRENCY = "DA";
export const COLORS = {
  primary: '#b33951',
  secondary: '#c9a063',
  background: '#fff5f7',
  surface: '#ffffff',
  text: '#2c3e50',
  accent: '#f48fb1'
};

/**
 * دالة لتشغيل أصوات تفاعلية ناعمة واحترافية
 */
export const playClickSound = (type: 'soft' | 'sharp' | 'success' | 'sale' = 'soft') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    
    const context = new AudioCtx();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    if (type === 'soft') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, context.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
    } else if (type === 'sharp') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, context.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.05);
    } else if (type === 'success') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, context.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
    } else if (type === 'sale') {
      // محاكاة صوت ماكينة الصراف (Double Chime)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, context.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(1760, context.currentTime + 0.1); // A6
      gain.gain.setValueAtTime(0.1, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
      
      const osc2 = context.createOscillator();
      const gain2 = context.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, context.currentTime + 0.1); 
      gain2.gain.setValueAtTime(0, context.currentTime);
      gain2.gain.setValueAtTime(0.1, context.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3);
      
      osc2.connect(gain2);
      gain2.connect(context.destination);
      osc2.start(context.currentTime + 0.1);
      osc2.stop(context.currentTime + 0.4);
    }

    oscillator.connect(gain);
    gain.connect(context.destination);
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
    
    setTimeout(() => context.close(), 500);
  } catch (e) {
    console.warn('Audio play blocked or not supported');
  }
};
