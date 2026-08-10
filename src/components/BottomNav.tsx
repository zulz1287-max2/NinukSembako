import React from 'react';
import { Home, Grid, ShoppingCart, MessageCircle } from 'lucide-react';
import { STORE_WA_NUMBER } from '../utils/formatters';

interface BottomNavProps {
  cartItemsCount: number;
  onOpenCart: () => void;
  onScrollToTop: () => void;
  onOpenCategories: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  cartItemsCount,
  onOpenCart,
  onScrollToTop,
  onOpenCategories,
}) => {
  const waUrl = `https://wa.me/${STORE_WA_NUMBER}?text=${encodeURIComponent(
    "Halo Mbak Ninuk, saya mau tanya stok dan harga barang sembako hari ini."
  )}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 1. Beranda */}
        <button
          onClick={onScrollToTop}
          className="flex flex-col items-center justify-center text-slate-600 hover:text-emerald-700 active:scale-90 transition py-1 px-3"
        >
          <Home className="w-5 h-5 text-slate-700" />
          <span className="text-[10px] font-bold mt-1 text-slate-600">Beranda</span>
        </button>

        {/* 2. Kategori */}
        <button
          onClick={onOpenCategories}
          className="flex flex-col items-center justify-center text-slate-600 hover:text-emerald-700 active:scale-90 transition py-1 px-3"
        >
          <Grid className="w-5 h-5 text-slate-700" />
          <span className="text-[10px] font-bold mt-1 text-slate-600">Kategori</span>
        </button>

        {/* 3. Keranjang (dengan Badge Jumlah Barang) */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center text-slate-600 hover:text-emerald-700 active:scale-90 transition py-1 px-3 relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-slate-700" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-amber-950 text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs animate-bounce">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1 text-slate-600">Keranjang</span>
        </button>

        {/* 4. Chat WA */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-emerald-600 hover:text-emerald-700 active:scale-90 transition py-1 px-3"
        >
          <MessageCircle className="w-5 h-5 fill-emerald-100 text-emerald-600" />
          <span className="text-[10px] font-bold mt-1 text-emerald-700">Chat WA</span>
        </a>

      </div>
    </div>
  );
};
