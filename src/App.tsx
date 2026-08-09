/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BuyModal } from './components/BuyModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { Product, ProductCategory, CartItem } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { SearchX, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function App() {
  // State for products list with LocalStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ninuk_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Gagal memuat data dari localStorage:', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Save products to LocalStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('ninuk_products', JSON.stringify(products));
    } catch (e) {
      console.error('Gagal menyimpan ke localStorage:', e);
    }
  }, [products]);

  // Shopping Cart State with LocalStorage Persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('ninuk_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Gagal memuat keranjang dari localStorage:', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sync cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ninuk_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Gagal menyimpan keranjang ke localStorage:', e);
    }
  }, [cart]);

  // Total item quantity in cart
  const totalCartItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Category Management State with LocalStorage Persistence
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ninuk_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Gagal memuat kategori dari localStorage:', e);
    }
    return ['Sembako', 'Kopi', 'Bumbu Dapur', 'Makanan Ringan', 'Minuman', 'Mandi & Cuci'];
  });

  // Persist categories to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ninuk_categories', JSON.stringify(customCategories));
    } catch (e) {
      console.error('Gagal menyimpan kategori ke localStorage:', e);
    }
  }, [customCategories]);

  // Combined categories array (Semua + unique product categories + custom categories)
  const allCategories = useMemo(() => {
    const productCats = products.map((p) => p.category);
    const combined = Array.from(new Set([...customCategories, ...productCats])).filter(Boolean);
    return ['Semua', ...combined];
  }, [customCategories, products]);

  const handleAddCategory = (newCat: string) => {
    if (!newCat) return;
    if (!customCategories.includes(newCat)) {
      setCustomCategories((prev) => [...prev, newCat]);
      showToast(`Kategori "${newCat}" berhasil ditambahkan!`);
    } else {
      showToast(`Kategori "${newCat}" sudah ada.`);
    }
  };

  const handleDeleteCategory = (catToDelete: string) => {
    setCustomCategories((prev) => prev.filter((c) => c !== catToDelete));
    showToast(`Kategori "${catToDelete}" telah dihapus.`);
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');

  // Modal States
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('ninuk_admin_session') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);

  // --- LOGIKA URL RAHASIA /KOJUL ---
  useEffect(() => {
    const path = window.location.pathname.toUpperCase();
    const search = window.location.search.toUpperCase();

    // Memicu jika URL diakses melalui /KOJUL atau ?KOJUL
    if (path === '/KOJUL' || path === '/KOJUL/' || search.includes('KOJUL')) {
      if (isAdminLoggedIn) {
        setIsAdminPanelOpen(true);
      } else {
        setIsAdminLoginModalOpen(true);
      }
    }
  }, [isAdminLoggedIn]);

  // Success Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filtered Products Memo
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'Semua' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantityToAdd: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        return prev.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = Math.min(product.stock, item.quantity + quantityToAdd);
            return { ...item, quantity: newQty };
          }
          return item;
        });
      } else {
        return [...prev, { product, quantity: Math.min(product.stock, quantityToAdd) }];
      }
    });
    showToast(`"${product.name}" masuk ke keranjang belanja.`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const maxAllowed = item.product.stock;
            return { ...item, quantity: Math.min(maxAllowed, newQty) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Barang telah dihapus dari keranjang.');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Keranjang belanja telah dikosongkan.');
  };

  const handleCartCheckoutSuccess = (purchasedItems: CartItem[]) => {
    // Update stock in product list
    setProducts((prev) =>
      prev.map((prod) => {
        const foundItem = purchasedItems.find((item) => item.product.id === prod.id);
        if (foundItem) {
          const newStock = Math.max(0, prod.stock - foundItem.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );

    // Empty cart
    setCart([]);
    showToast('Pesanan keranjang berhasil dikirim ke WhatsApp!');
  };

  // Quick Buy WA Handler
  const handleQuickBuyWA = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    setCheckoutProduct(product);
    setCheckoutQuantity(1);
  };

  const handleProceedToBuyFromDetail = (product: Product, quantity: number) => {
    setDetailProduct(null);
    setCheckoutProduct(product);
    setCheckoutQuantity(quantity);
  };

  const handleSuccessOrder = (productId: string, quantityOrdered: number) => {
    // Decrease stock count in state
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock - quantityOrdered);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
    showToast(`Pesan berhasil dibuat! Mengalihkan ke WhatsApp Mbak Ninuk...`);
  };

  // Admin Actions
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('ninuk_admin_session', 'true');
    setIsAdminPanelOpen(true);
    showToast('Berhasil masuk sebagai Admin toko Ninuk Sembako.');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('ninuk_admin_session');
    setIsAdminPanelOpen(false);
    showToast('Anda telah keluar dari Panel Admin.');
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newId = `p_${Date.now()}`;
    const newProd: Product = { ...newProductData, id: newId };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Produk "${newProd.name}" berhasil ditambahkan!`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    showToast(`Produk "${updatedProduct.name}" berhasil diperbarui!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Produk telah dihapus.');
  };

  const handleResetSampleProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem('ninuk_products', JSON.stringify(INITIAL_PRODUCTS));
    showToast('Data produk dikembalikan ke sampel awal (8 produk).');
  };

  return (
    <div className="min-h-screen bg-emerald-50/30 text-slate-800 font-sans flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Header & Navigation (Tanpa Tombol Admin) */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        totalProductsCount={products.length}
        cartItemsCount={totalCartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        categories={allCategories}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        
        {/* Welcome Hero Banner */}
        <HeroBanner
          onExploreClick={() => {
            const el = document.getElementById('produk-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Product Section Header */}
        <div id="produk-section" className="scroll-mt-24 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Katalog Produk Toko
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {filteredProducts.length} Produk
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {selectedCategory === 'Semua'
                ? 'Menampilkan seluruh barang kebutuhan rumah tangga'
                : `Menampilkan produk kategori "${selectedCategory}"`}
            </p>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Hapus pencarian "{searchQuery}"
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-dashed border-slate-300 max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Maaf Bu, kata kunci "{searchQuery}" tidak cocok dengan barang di toko Ninuk Sembako.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua');
                }}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition"
              >
                Tampilkan Semua Produk
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={setDetailProduct}
                onAddToCart={(prod) => handleAddToCart(prod, 1)}
                onQuickBuyWA={handleQuickBuyWA}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer & Map */}
      <Footer />

      {/* Floating WhatsApp Button & Floating Cart Trigger */}
      <FloatingWhatsApp
        cartItemsCount={totalCartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCartCheckoutSuccess}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
        onProceedToBuy={handleProceedToBuyFromDetail}
      />

      {/* Buy Checkout Modal (1 Item Quick Direct WA Link) */}
      <BuyModal
        product={checkoutProduct}
        quantity={checkoutQuantity}
        onClose={() => setCheckoutProduct(null)}
        onSuccessOrder={handleSuccessOrder}
      />

      {/* Admin Login Modal (Triggered via URL Rahasia /KOJUL) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        products={products}
        categories={allCategories.filter((c) => c !== 'Semua')}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetSampleProducts={handleResetSampleProducts}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onLogout={handleAdminLogout}
      />

    </div>
  );
}
