import React from 'react';
import { MapPin, Phone, Clock, Store, Heart, Navigation } from 'lucide-react';
import { DEFAULT_STORE_ADDRESS, STORE_WA_NUMBER } from '../utils/formatters';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Store Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Ninuk Sembako
              </h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Toko Kelontong & Sembako pilihan terpercaya warga & Ibu-ibu rumah tangga. Menjual kebutuhan dapur segar, beras pulen, minyak, gula, telur, dan racikan kopi terlengkap.
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>{DEFAULT_STORE_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: +62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Buka Setiap Hari: 06.00 - 21.00 WIB</span>
              </div>
            </div>
          </div>

          {/* Quick Categories & Store Guarantee */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Keunggulan Toko Ninuk
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Produk Dapur Murni & Selalu Fresh</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Harga Hemat Pas di Kantong Ibu-Ibu</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Pemesanan Praktis Tanpa Perlu Antre</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Layanan Kurir Antar Cepat Seputar Monas & Gambir</span>
              </li>
            </ul>
          </div>

          {/* Google Maps Location - Monumen Nasional (Monas), Jakarta */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-400" />
              Lokasi Toko (Area Monas, Jakarta)
            </h4>
            <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-700 shadow-lg relative bg-slate-800">
              <iframe
                title="Lokasi Toko Ninuk Sembako - Monas Jakarta"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6663675037233!2d106.82496411532152!3d-6.175392395529141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2db8c5617%3A0x4e0c3b8793315a6b!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1690000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter saturate-90 brightness-95"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              *Toko fisik berada dekat Monumen Nasional, Jakarta Pusat
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Ninuk Sembako. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk Ibu-Ibu Indonesia
          </p>
        </div>

      </div>
    </footer>
  );
};
