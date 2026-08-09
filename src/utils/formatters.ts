export const STORE_WA_NUMBER = "6281234567890"; // Default Ninuk Sembako WA Number
export const DEFAULT_STORE_ADDRESS = "Jl. Medan Merdeka Barat No. 1, Monas, Gambir, Jakarta Pusat";

/**
 * Formats a number to Indonesian Rupiah currency format.
 * Example: 75000 -> "Rp 75.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp")
    .trim();
}

/**
 * Generates the WhatsApp checkout URL for a single item purchase.
 */
export function generateWhatsAppUrl(
  customerName: string,
  productName: string,
  price: number,
  quantity: number = 1,
  waNumber: string = STORE_WA_NUMBER
): string {
  const formattedPrice = formatRupiah(price);
  const message = `Halo Ninuk Sembako, saya ${customerName.trim()} ingin membeli ${productName.trim()} sejumlah ${quantity} pcs dengan harga ${formattedPrice}. Apakah stok masih ada?`;

  const cleanPhone = waNumber.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates the WhatsApp checkout URL for multiple items in the Shopping Cart.
 */
export function generateCartWhatsAppUrl(
  customerName: string,
  items: { productName: string; price: number; quantity: number }[],
  waNumber: string = STORE_WA_NUMBER
): string {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let itemListText = items
    .map((item, idx) => `${idx + 1}. ${item.productName} (${item.quantity} pcs x ${formatRupiah(item.price)}) = ${formatRupiah(item.price * item.quantity)}`)
    .join('\n');

  const message = `Halo Ninuk Sembako, saya ${customerName.trim()} ingin memesan barang berikut:\n\n${itemListText}\n\nTotal Belanja: ${formatRupiah(totalPrice)}\n\nApakah stok semua barang di atas masih ada?`;

  const cleanPhone = waNumber.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
