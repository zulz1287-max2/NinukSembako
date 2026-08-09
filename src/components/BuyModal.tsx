import React, { useState, useEffect } from 'react';
import { X, Send, User, ShoppingCart, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { generateWhatsAppUrl, formatRupiah, STORE_WA_NUMBER } from '../utils/formatters';

interface BuyModalProps {
  product: Product | null;
  quantity: number;
  onClose: () => void;
  onSuccessOrder: (productId: string, quantity: number) => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  product,
  quantity,
  onClose,
  onSuccessOrder,
}) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Load previously saved name from LocalStorage for convenient housewife experience
    const savedName = localStorage.getItem('ninuk_customer_name');
    if (savedName) {
      setCustomerName(savedName);
    }
  }, []);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customerName.trim();
    if (!trimmed) {
      setError('Mohon sebutkan nama Ibu/Bapak terlebih dahulu.');
      return;
    }

    // Save customer name for next orders
    localStorage.setItem('ninuk_customer_name', trimmed);

    // Generate strict WhatsApp format message
    const waUrl = generateWhatsAppUrl(
      trimmed,
      product.name,
      product.price,
      quantity,
      STORE_WA_NUMBER
    );

    // Decrement stock in state
    onSuccessOrder(product.id, quantity);

    // Redirect to WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Close modal
    onClose();
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden z-10 border border-emerald-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-amber-300">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Pesan via WhatsApp</h3>
              <p className="text-xs text-emerald-100">Langkah Terakhir - Masukkan Nama Ibu / Bapak</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Order Summary Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex gap-4 items-center">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 object-cover rounded-xl border border-emerald-200 shrink-0 bg-white"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                {product.category}
              </span>
              <h4 className="text-sm font-bold text-slate-800 truncate">
                {product.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {quantity} pcs x {formatRupiah(product.price)}
              </p>
              <p className="text-sm font-black text-emerald-800 mt-1">
                Total: {formatRupiah(totalPrice)}
              </p>
            </div>
          </div>

          {/* Customer Name Input */}
          <div>
            <label htmlFor="customer-name" className="block text-sm font-bold text-slate-700 mb-2">
              Masukkan Nama Anda <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Contoh: Ibu Ani / Bu Ratna"
                className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-base font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition"
                autoFocus
                required
              />
            </div>
            {error ? (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>
            ) : (
              <p className="text-xs text-slate-400 mt-1.5">
                Nama ini akan dicantumkan otomatis pada pesan WhatsApp ke Mbak Ninuk.
              </p>
            )}
          </div>

          {/* Message Preview Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 font-mono leading-relaxed">
            <span className="text-slate-400 block font-semibold mb-1 text-[11px] uppercase tracking-wider">
              Pratinjau Pesan WA:
            </span>
            <p className="italic bg-white p-2.5 rounded-lg border border-slate-200/60">
              "Halo Ninuk Sembako, saya <strong className="text-emerald-700">{customerName.trim() || '[Nama Customer]'}</strong> ingin membeli <strong className="text-slate-800">{product.name}</strong> sejumlah {quantity} pcs dengan harga {formatRupiah(product.price)}. Apakah stok masih ada?"
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-base shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5 text-amber-300" />
              <span>Lanjutkan ke WhatsApp</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
