import React from 'react';
import { ShoppingBasket, PhoneCall, ShieldCheck, MapPin, Sparkles, ShoppingBag } from 'lucide-react';
import sembakoHeroImg from '../assets/images/sembako_hero_banner_1786286270726.jpg';

interface HeroBannerProps {
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick }) => {
  return (
    <div className="bg-emerald-800 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm mb-8 relative overflow-hidden border border-emerald-700">
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Headline & Value Proposition */}
        <div className="lg:col-span-7">
          {/* Welcome Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700 text-amber-300 text-xs sm:text-sm font-semibold mb-4">
            <ShoppingBasket className="w-4 h-4 text-amber-300" />
            <span>Toko Kelontong Lengkap & Murah</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl lg:text-4xl xl:text-5xl font-black tracking-tight text-white leading-tight mb-3">
            Belanja Kebutuhan Dapur & Rumah, <span className="text-amber-300 underline decoration-amber-400/40">Langsung Antar via WA!</span>
          </h2>

          {/* Description */}
          <p className="text-emerald-100 text-sm sm:text-base lg:text-lg mb-6 leading-relaxed">
            Sedia Beras, Minyak Goreng, Telur, Gula, Bumbu, Minuman, hingga Peralatan Kebersihan. Harga bersahabat, jaminan stok ready, dan belanja tinggal klik via WhatsApp!
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-700 p-2.5 rounded-xl text-xs sm:text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Bahan Fresh & Asli</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-700 p-2.5 rounded-xl text-xs sm:text-sm font-medium">
              <PhoneCall className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Praktis Kirim WA</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-700 p-2.5 rounded-xl text-xs sm:text-sm font-medium col-span-2 sm:col-span-1">
              <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Monas, Gambir Jkt</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-sm sm:text-base shadow-sm transition active:scale-95 flex items-center gap-2.5"
            >
              <ShoppingBag className="w-5 h-5 text-amber-950" />
              <span>Pilih Produk Sekarang</span>
            </button>
            
            <a
              href="https://wa.me/6281234567890?text=Halo%20Ninuk%20Sembako,%20saya%20ingin%20tanya%20stok%20produk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm sm:text-base border border-emerald-600 transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-200" />
              <span>Tanya Mbak Ninuk</span>
            </a>
          </div>
        </div>

        {/* Right Column: Image Display */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
            <img
              src={sembakoHeroImg}
              alt="Aneka Produk Toko Ninuk"
              referrerPolicy="no-referrer"
              className="w-full h-56 sm:h-72 lg:h-80 object-cover"
            />
            {/* Image Overlay Badge */}
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-900/85 rounded-xl border border-white/10 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-amber-300">Stok Barang Ready</p>
                  <p className="text-[11px] text-slate-300">Sembako, Bumbu, Kopi & Kebersihan</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-lg">
                Siap Kirim
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
