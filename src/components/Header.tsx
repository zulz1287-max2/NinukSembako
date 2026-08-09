import React, { useState } from 'react';
import { ShoppingBag, Search, Lock, Store, ChevronDown, Sparkles, X, Filter, ShoppingCart } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onAdminLogout: () => void;
  totalProductsCount: number;
  cartItemsCount: number;
  onOpenCart: () => void;
  categories?: string[];
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onOpenAdmin,
  isAdminLoggedIn,
  onAdminLogout,
  totalProductsCount,
  cartItemsCount,
  onOpenCart,
  categories = ['Semua', 'Sembako', 'Kopi'],
}) => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-200">
      {/* Top Banner Bar */}
      <div className="bg-emerald-800 text-white py-1.5 px-4 text-xs sm:text-sm font-medium text-center flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>Toko Kelontong Ninuk Sembako — Buka Setiap Hari (06.00 - 21.00 WIB) | Monas, Jakarta</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
          
          {/* Brand Logo & Title (Removed Sembako & Kopi Badge) */}
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-800 transition">
                <Store className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Ninuk Sembako
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Lengkap, Terjangkau & Pesan Antar via WA
                </p>
              </div>
            </a>

            {/* Mobile Actions: Cart & Admin Link */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onOpenCart}
                className="relative px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Keranjang</span>
                {cartItemsCount > 0 && (
                  <span className="bg-emerald-900 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {isAdminLoggedIn ? (
                <button
                  onClick={onOpenAdmin}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Admin
                </button>
              ) : (
                <button
                  onClick={onOpenAdmin}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1 border border-slate-200"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Admin
                </button>
              )}
            </div>
          </div>

          {/* Search Bar & Category Dropdown */}
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 max-w-2xl">
            
            {/* Category Dropdown Menu */}
            <div className="relative w-full sm:w-48">
              <label htmlFor="category-select" className="sr-only">Pilih Kategori</label>
              <button
                id="category-select"
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full h-11 px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-between transition focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <div className="flex items-center gap-2 truncate">
                  <Filter className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">Kategori: <strong>{selectedCategory}</strong></span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Options */}
              {isCategoryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsCategoryDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden py-1 max-h-64 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          onCategoryChange(cat);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm font-medium flex items-center justify-between transition ${
                          selectedCategory === cat
                            ? 'bg-emerald-700 text-white font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat}</span>
                        {cat === 'Semua' && <span className="text-[11px] opacity-75">({totalProductsCount})</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Real-time Search Input */}
            <div className="relative w-full flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari barang, sembako, minuman..."
                className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-normal focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Actions: Cart & Admin Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Prominent Cart Button */}
            <button
              onClick={onOpenCart}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-sm flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 text-amber-950" />
              <span>Keranjang Belanja</span>
              <span className="bg-emerald-900 text-white text-xs font-black px-2 py-0.5 rounded-full">
                {cartItemsCount}
              </span>
            </button>

            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAdmin}
                  className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Admin
                </button>
                <button
                  onClick={onAdminLogout}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5 border border-slate-200"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Admin
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
