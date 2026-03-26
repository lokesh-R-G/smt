export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  specifications: { key: string; value: string }[];
  isVisible: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  products: { productId: string; quantity: number; name: string; price: number }[];
  total: number;
  status: 'Processing' | 'Packing' | 'Shipped' | 'Delivered';
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}
