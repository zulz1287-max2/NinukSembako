import React, { useState } from 'react';
import { PhoneCall, MessageCircle, X, ShoppingCart } from 'lucide-react';
import { STORE_WA_NUMBER } from '../utils/formatters';

interface FloatingWhatsAppProps {
  cartItemsCount?: number;
  onOpenCart?: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  cartItemsCount = 0,
  onOpenCart,
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(true);

  const waUrl = `https://wa.me/${STORE_WA_NUMBER}?text=${encodeURIComponent(
    "Halo Mbak Ninuk, saya mau tanya stok dan harga barang sembako hari ini."
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 group">
      
      {/* Floating Cart Button (shows if items > 0) */}
      {cartItemsCount > 0 && onOpenCart && (
        <button
          onClick={onOpenCart}
          className="relative px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-sm shadow-xl shadow-amber-400/30 flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce"
        >
          <ShoppingCart className="w-5 h-5 text-amber-950" />
          <span>Lihat Keranjang</span>
          <span className="bg-emerald-800 text-white text-xs font-black px-2 py-0.5 rounded-full">
            {cartItemsCount}
          </span>
        </button>
      )}

      {/* Friendly Tooltip for Housewives */}
      {isTooltipOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-200 p-3.5 max-w-xs text-xs sm:text-sm text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300 relative mr-1">
          <button
            onClick={() => setIsTooltipOpen(false)}
            className="absolute -top-2 -left-2 bg-slate-200 text-slate-600 rounded-full p-0.5 hover:bg-slate-300 transition"
            aria-label="Tutup pesan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 font-bold text-emerald-800 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Mbak Ninuk Online!
          </div>
          <p className="text-slate-600">
            Ada pertanyaan atau mau pesan barang? Klik tombol hijau di bawah ya Bu! 💚
          </p>
        </div>
      )}

      {/* Floating WA Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Mbak Ninuk"
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group-hover:shadow-2xl"
      >
        {/* Pulse ring effect */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30 pointer-events-none" />
        
        <MessageCircle className="w-8 h-8 sm:w-9 sm:h-9 fill-white text-emerald-500" />
        
        {/* Unread dot indicator */}
        <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-amber-950">
          1
        </span>
      </a>
    </div>
  );
};
