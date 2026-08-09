import React, { useState } from 'react';
import { X, ShoppingCart, MessageCircle, Store, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onProceedToBuy: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onProceedToBuy,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return null;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden z-10 my-auto animate-in zoom-in-95 duration-200">
        
        {/* ========================================================= */}
        {/* 1. TOMBOL X KHUSUS HP (TAMPIL DI TENGAH ATAS GAMBAR) */}
        {/* ========================================================= */}
        <button
          onClick={onClose}
          className="sm:hidden absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-slate-900/80 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 active:scale-95 transition"
          aria-label="Tutup detail produk"
        >
          <X className="w-5 h-5 text-amber-300" />
          <span className="text-xs tracking-wide">TUTUP</span>
        </button>

        {/* ========================================================= */}
        {/* 2. TOMBOL X UNTUK DESKTOP / LAPTOP (POJOK KANAN ATAS) */}
        {/* ========================================================= */}
        <button
          onClick={onClose}
          className="hidden sm:flex absolute top-4 right-4 z-20 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-full items-center justify-center transition shadow-xs"
          aria-label="Tutup detail produk"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Section */}
          <div className="relative bg-slate-50 p-6 flex items-center justify-center min-h-[260px] sm:min-h-[320px] border-b md:border-b-0 md:border-r border-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-60 sm:max-h-72 object-contain drop-shadow-md rounded-xl transition duration-300 hover:scale-105"
            />
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md">
                  Stok Habis
                </span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-emerald-800 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
              <Store className="w-3 h-3" />
              <span>Ninuk Sembako</span>
            </div>
          </div>

          {/* Product Info & Actions */}
          <div className="p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  {product.category}
                </span>
                {product.unit && (
                  <span className="text-xs text-slate-400 font-medium">
                    / {product.unit}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2">
                {product.name}
              </h3>

              <div className="text-2xl sm:text-3xl font-black text-emerald-700 mb-4">
                Rp {product.price.toLocaleString('id-ID')}
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Deskripsi Produk
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description || 'Barang berkualitas & selalu fresh dari toko Ninuk Sembako.'}
                </p>
              </div>

              {/* Quantity Counter */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">Jumlah Beli</span>
                    <span className="text-xs text-slate-500">
                      Sisa stok: <strong className="text-slate-800">{product.stock}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-xl bg-white text-slate-700 font-bold text-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 shadow-xs transition"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-black text-slate-800 text-sm">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrease}
                        disabled={quantity >= product.stock}
                        className="w-8 h-8 rounded-xl bg-white text-slate-700 font-bold text-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 shadow-xs transition"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      Subtotal: <strong className="text-emerald-700 font-bold">Rp {(product.price * quantity).toLocaleString('id-ID')}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {product.stock > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-amber-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>+ Keranjang</span>
                </button>

                <button
                  onClick={() => onProceedToBuy(product, quantity)}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pesan Langsung</span>
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-2xl bg-slate-200 text-slate-500 font-bold text-xs sm:text-sm text-center cursor-not-allowed"
              >
                Stok Sedang Kosong
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
