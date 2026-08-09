import React, { useState } from 'react';
import { ShoppingCart, Eye, Package, Sparkles, Check, Send } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, event: React.MouseEvent) => void;
  onQuickBuyWA: (product: Product, event: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onQuickBuyWA,
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const isOutOfStock = product.stock <= 0;

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product, e);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Category & Best Seller Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-white shadow-xs backdrop-blur-xs">
          {product.category}
        </span>

        {product.isBestSeller && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 fill-amber-950" />
            Laris
          </span>
        )}
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Overlay hover prompt */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            Lihat Detail
          </span>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unit tag if available */}
          {product.unit && (
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Kemasan: {product.unit}
            </span>
          )}

          {/* Product Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </div>

        <div>
          {/* Price & Stock info */}
          <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Harga:</span>
              <span className="text-lg sm:text-xl font-black text-emerald-700 tracking-tight">
                {formatRupiah(product.price)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium block">Stok:</span>
              <span className={`text-xs sm:text-sm font-bold flex items-center gap-1 justify-end ${
                isOutOfStock
                  ? 'text-rose-600'
                  : product.stock <= 3
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}>
                <Package className="w-3.5 h-3.5 inline" />
                {isOutOfStock ? 'Habis' : `${product.stock} pcs`}
              </span>
            </div>
          </div>

          {/* Action Buttons: Primary + Keranjang and Secondary Direct WA */}
          <div className="grid grid-cols-12 gap-2 mt-4">
            <button
              onClick={handleCartClick}
              disabled={isOutOfStock}
              className={`col-span-8 py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-800 text-amber-300 ring-2 ring-emerald-500'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Masuk Keranjang!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Habis' : '+ Keranjang'}</span>
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickBuyWA(product, e);
              }}
              disabled={isOutOfStock}
              className="col-span-4 py-2.5 px-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/60 font-bold text-xs flex items-center justify-center gap-1 transition active:scale-95 disabled:opacity-50"
              title="Langsung Beli 1 Produk via WhatsApp"
            >
              <Send className="w-3.5 h-3.5 text-amber-800" />
              <span>WA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
