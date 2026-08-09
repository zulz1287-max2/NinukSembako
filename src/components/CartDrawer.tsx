import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Trash2, Plus, Minus, Send, User, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';
import { formatRupiah, generateCartWhatsAppUrl, STORE_WA_NUMBER } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (purchasedItems: CartItem[]) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
}) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  useEffect(() => {
    // Load customer name from LocalStorage if available
    const savedName = localStorage.getItem('ninuk_customer_name');
    if (savedName) {
      setCustomerName(savedName);
    }
  }, []);

  if (!isOpen) return null;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckoutWA = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customerName.trim();
    if (!trimmed) {
      setNameError('Mohon sebutkan Nama Ibu / Bapak terlebih dahulu.');
      return;
    }

    if (cart.length === 0) return;

    // Save name
    localStorage.setItem('ninuk_customer_name', trimmed);

    // Prepare items list for WA
    const waItems = cart.map((item) => ({
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const waUrl = generateCartWhatsAppUrl(trimmed, waItems, STORE_WA_NUMBER);

    // Trigger stock updates
    onCheckoutSuccess(cart);

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Close Cart
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden z-10 border-l border-emerald-100 animate-in slide-in-from-right duration-300">
          
          {/* Cart Drawer Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 sm:p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-amber-300 font-bold">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  Keranjang Belanja
                  <span className="text-xs bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full">
                    {totalItemsCount} Pcs
                  </span>
                </h3>
                <p className="text-xs text-emerald-100">Ninuk Sembako - Monas, Jakarta</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white flex items-center justify-center transition"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 my-auto">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">Keranjang Masih Kosong</h4>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  Pilih beras, minyak, telur, atau kopi favorit Ibu lalu klik tombol <strong>"+ Keranjang"</strong>.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
                >
                  Mulai Belanja Now
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Daftar Belanjaan ({cart.length} Jenis Barang)
                  </span>
                  <button
                    onClick={onClearCart}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Kosongkan
                  </button>
                </div>

                {cart.map((item) => {
                  const maxStock = item.product.stock;
                  const isMaxReached = item.quantity >= maxStock;

                  return (
                    <div key={item.product.id} className="pt-4 flex gap-3.5 items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-xs font-bold text-emerald-700 mt-0.5">
                          {formatRupiah(item.product.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 border border-slate-200">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition"
                              title="Kurangi"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-extrabold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              disabled={isMaxReached}
                              className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition disabled:opacity-30"
                              title="Tambah"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-extrabold text-slate-900 block">
                              {formatRupiah(item.product.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-[11px] text-rose-500 hover:text-rose-700 font-medium"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Cart Drawer Footer & WA Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              
              {/* Total Calculation Box */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Produk ({totalItemsCount} Pcs):</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-emerald-900 pt-1 border-t border-emerald-200/60">
                  <span>Total Belanja:</span>
                  <span className="text-lg text-emerald-700">{formatRupiah(totalPrice)}</span>
                </div>
              </div>

              {/* Customer Name Form */}
              <form onSubmit={handleCheckoutWA} className="space-y-3">
                <div>
                  <label htmlFor="cart-customer-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Ibu / Bapak <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      id="cart-customer-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      placeholder="Contoh: Bu Ratna / Pak Agus"
                      className="w-full h-10 pl-9 pr-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                  {nameError && (
                    <p className="text-[11px] text-rose-600 font-medium mt-1">{nameError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Pesan Semua via WhatsApp</span>
                </button>
              </form>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
