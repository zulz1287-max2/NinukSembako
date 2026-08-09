import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Package, ShieldCheck, Phone, Sparkles, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';

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
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const maxAllowedQuantity = Math.max(1, product.stock);

  const handleIncrement = () => {
    if (quantity < maxAllowedQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 border border-emerald-100 animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-md transition"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image Area */}
          <div className="relative aspect-square md:aspect-auto bg-slate-100 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-md text-white ${
                product.category === 'Sembako' ? 'bg-emerald-600' : 'bg-amber-600'
              }`}>
                {product.category === 'Sembako' ? '🌾 Sembako' : '☕ Kopi'}
              </span>
            </div>
          </div>

          {/* Details & Action Area */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.unit && (
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    Kemasan: {product.unit}
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Favorit Ibu
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mb-4">
                <span className="text-xs text-slate-400 font-medium block">Harga Satuan:</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {formatRupiah(product.price)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm">
                <Package className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600">Stok Tersedia:</span>
                <span className={`font-bold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {isOutOfStock ? 'Stok Habis' : `${product.stock} pcs`}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Deskripsi Produk:
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div>
              {!isOutOfStock && (
                <div className="flex items-center justify-between mb-4 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                  <span className="text-sm font-bold text-emerald-900">Jumlah Beli:</span>
                  <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-emerald-200">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:opacity-40 flex items-center justify-center transition font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-extrabold text-slate-800 text-base">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= maxAllowedQuantity}
                      className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:opacity-40 flex items-center justify-center transition font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Total Price preview */}
              {!isOutOfStock && (
                <div className="flex items-center justify-between mb-4 px-1 text-sm">
                  <span className="text-slate-500 font-medium">Subtotal ({quantity} pcs):</span>
                  <span className="font-extrabold text-emerald-800 text-lg">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              )}

              {/* Action Buttons: Add to Cart & Buy WA */}
              <div className="space-y-2.5">
                <button
                  onClick={handleAddToCartClick}
                  disabled={isOutOfStock}
                  className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition active:scale-98 shadow-md ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-800 text-amber-300 ring-2 ring-emerald-500'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5 text-amber-300" />
                      <span>Berhasil Masuk Keranjang!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>{isOutOfStock ? 'Stok Tidak Tersedia' : '+ Masukkan Keranjang'}</span>
                    </>
                  )}
                </button>

                {!isOutOfStock && (
                  <button
                    onClick={() => onProceedToBuy(product, quantity)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 flex items-center justify-center gap-2 transition"
                  >
                    <Phone className="w-4 h-4 text-amber-800" />
                    <span>Langsung Beli via WA Saja</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
