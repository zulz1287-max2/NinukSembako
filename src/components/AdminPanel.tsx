import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, RotateCcw, Package, DollarSign, Image as ImageIcon, Tag, FileText, CheckCircle, AlertTriangle, LogOut, Search, Filter } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { formatRupiah } from '../utils/formatters';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: string[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetSampleProducts: () => void;
  onAddCategory: (newCategory: string) => void;
  onDeleteCategory: (categoryToDelete: string) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetSampleProducts,
  onAddCategory,
  onDeleteCategory,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'categories'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Category Add State
  const [newCatInput, setNewCatInput] = useState<string>('');
  const [isAddingInlineCat, setIsAddingInlineCat] = useState<boolean>(false);
  const [inlineCatInput, setInlineCatInput] = useState<string>('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0] || 'Sembako',
    price: 15000,
    stock: 10,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: '',
    isBestSeller: false,
  });

  if (!isOpen) return null;

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      unit: product.unit || '',
      image: product.image,
      description: product.description,
      isBestSeller: !!product.isBestSeller,
    });
    setActiveTab('add');
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatInput.trim()) {
      onAddCategory(newCatInput.trim());
      setNewCatInput('');
    }
  };

  const handleAddInlineCategory = () => {
    if (inlineCatInput.trim()) {
      const added = inlineCatInput.trim();
      onAddCategory(added);
      setFormData({ ...formData, category: added });
      setInlineCatInput('');
      setIsAddingInlineCat(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      // Update existing product
      onUpdateProduct({
        ...editingProduct,
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        unit: formData.unit,
        image: formData.image,
        description: formData.description,
        isBestSeller: formData.isBestSeller,
      });
      setEditingProduct(null);
    } else {
      // Add new product
      onAddProduct({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        unit: formData.unit,
        image: formData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        description: formData.description,
        isBestSeller: formData.isBestSeller,
      });
    }

    setActiveTab('list');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: categories[0] || 'Sembako',
      price: 15000,
      stock: 10,
      unit: '1 kg',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      description: '',
      isBestSeller: false,
    });
  };

  const filteredAdminProducts = products.filter((p) => {
    const matchesCategory = filterCategory === 'Semua' || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/75 transition-opacity"
        onClick={onClose}
      />

      {/* Admin Panel Dialog */}
      <div className="relative bg-white rounded-3xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden z-10 border border-slate-200">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Panel Kelola Toko Ninuk Sembako
              </h2>
              <p className="text-xs text-slate-400">
                Kelola barang, update stok, dan tambah kategori baru
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher & Quick Actions */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('list');
                setEditingProduct(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'list' && !editingProduct
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              Daftar Produk ({products.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('add');
                setEditingProduct(null);
                resetForm();
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'add' || editingProduct
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Plus className="w-4 h-4 text-amber-400" />
              + Tambah Produk
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setEditingProduct(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'categories'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Tag className="w-4 h-4 text-emerald-600" />
              Kelola Kategori ({categories.length})
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin mengembalikan semua produk sampel awal?')) {
                onResetSampleProducts();
              }
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            Reset Sampel
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* TAB: MANAGE CATEGORIES */}
          {activeTab === 'categories' ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-1">
                  <Tag className="w-5 h-5 text-emerald-700" />
                  Tambah & Kelola Kategori Produk
                </h3>
                <p className="text-xs text-slate-500">
                  Tambahkan kategori baru sesuai barang yang Anda jual (misal: Bumbu Dapur, Makanan Ringan, Mandi & Cuci, Minuman Kemasan).
                </p>
              </div>

              {/* Form Add New Category */}
              <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  placeholder="Kategori Baru (misal: Bumbu Dapur)..."
                  className="flex-1 h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-5 h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition shrink-0 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Kategori
                </button>
              </form>

              {/* Existing Categories List */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Daftar Kategori Aktif ({categories.length}):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    return (
                      <div
                        key={cat}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2"
                      >
                        <span>{cat}</span>
                        <span className="bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full text-[10px]">
                          {count} produk
                        </span>
                        {categories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus kategori "${cat}"?`)) {
                                onDeleteCategory(cat);
                              }
                            }}
                            className="text-slate-400 hover:text-rose-600 transition ml-1"
                            title="Hapus Kategori"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : activeTab === 'add' || editingProduct ? (
            /* EDIT FORM or ADD FORM */
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {editingProduct ? <Edit2 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-emerald-600" />}
                  {editingProduct ? `Edit Produk: ${editingProduct.name}` : 'Tambah Produk Baru'}
                </h3>
                {editingProduct && (
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label htmlFor="product-name" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Produk <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="product-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Beras Pandan Wangi 5kg"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                {/* Category & Kemasan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="product-category" className="block text-xs font-bold text-slate-700 uppercase">
                        Kategori <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAddingInlineCat(!isAddingInlineCat)}
                        className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        + Kategori Baru
                      </button>
                    </div>

                    {isAddingInlineCat ? (
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={inlineCatInput}
                          onChange={(e) => setInlineCatInput(e.target.value)}
                          placeholder="Nama Kategori..."
                          className="flex-1 h-11 px-3 bg-slate-50 border border-emerald-500 rounded-xl text-xs font-medium focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddInlineCategory}
                          className="px-3 h-11 bg-emerald-700 text-white font-bold text-xs rounded-xl"
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <select
                        id="product-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label htmlFor="product-unit" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Kemasan / Satuan
                    </label>
                    <input
                      id="product-unit"
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="Contoh: 5 kg, 2 Liter, 10 Sachet"
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="product-price" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Harga (Rp) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="product-price"
                      type="number"
                      min="100"
                      step="500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="75000"
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="product-stock" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Stok Tersedia (pcs) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="product-stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      placeholder="10"
                      className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="product-image" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    URL Gambar Produk
                  </label>
                  <input
                    id="product-image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  {formData.image && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      />
                      <span className="text-xs text-slate-500">Pratinjau Gambar</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="product-description" className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Deskripsi Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="product-description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tuliskan keunggulan produk untuk pembeli..."
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                {/* Best Seller Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="isBestSeller" className="text-sm font-semibold text-slate-700 cursor-pointer">
                    Tandai sebagai Produk Favorit / Laris
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition"
                  >
                    {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setActiveTab('list');
                    }}
                    className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition"
                  >
                    Batal
                  </button>
                </div>

              </form>
            </div>
          ) : (
            /* PRODUCT LIST TABLE / GRID */
            <div>
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter nama produk..."
                    className="w-full h-10 pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-500 font-semibold shrink-0">Kategori:</span>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="Semua">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredAdminProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-sm">Tidak ada produk ditemukan.</p>
                  <button
                    onClick={onResetSampleProducts}
                    className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    Muat Ulang Produk Sampel
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                      <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Produk</th>
                          <th className="py-3 px-4">Kategori</th>
                          <th className="py-3 px-4">Harga</th>
                          <th className="py-3 px-4">Stok</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAdminProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition">
                            {/* Product Info */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-slate-800 line-clamp-1">{p.name}</p>
                                  <p className="text-[11px] text-slate-400">{p.unit || 'Standard'}</p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4 font-semibold">
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                                {p.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3 px-4 font-black text-emerald-800">
                              {formatRupiah(p.price)}
                            </td>

                            {/* Stock Quick Editor */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    if (p.stock > 0) {
                                      onUpdateProduct({ ...p, stock: p.stock - 1 });
                                    }
                                  }}
                                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
                                  title="Kurangi Stok"
                                >
                                  -
                                </button>
                                <span className={`font-bold text-xs min-w-8 text-center ${
                                  p.stock <= 0 ? 'text-rose-600' : p.stock <= 3 ? 'text-amber-600' : 'text-slate-800'
                                }`}>
                                  {p.stock}
                                </span>
                                <button
                                  onClick={() => onUpdateProduct({ ...p, stock: p.stock + 1 })}
                                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
                                  title="Tambah Stok"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                                  title="Edit Produk"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                
                                {deleteConfirmId === p.id ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => {
                                        onDeleteProduct(p.id);
                                        setDeleteConfirmId(null);
                                      }}
                                      className="px-2 py-1 rounded bg-rose-600 text-white font-bold text-xs"
                                    >
                                      Hapus!
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmId(null)}
                                      className="px-1.5 py-1 text-xs text-slate-500"
                                    >
                                      Batal
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirmId(p.id)}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                                    title="Hapus Produk"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
