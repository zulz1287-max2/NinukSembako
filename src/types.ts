export type ProductCategory = string;

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  unit?: string; // e.g., "5kg", "1 Liter", "10 Sachet"
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerOrderRequest {
  customerName: string;
  product: Product;
  quantity: number;
}
