import { Product } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
const AUTH_EXPIRED_EVENT = 'auth:expired';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

type ProductApiResponse = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  specifications: { key: string; value: string }[];
  is_visible: boolean;
};

type CartItemApiResponse = {
  product: ProductApiResponse;
  quantity: number;
};

type CartApiResponse = {
  user_id: string;
  items: CartItemApiResponse[];
  total: number;
  updated_at: string;
};

type OrderStatus = 'Processing' | 'Packing' | 'Shipped' | 'Delivered';

type OrderApiResponse = {
  id: string;
  order_id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  company_name: string;
  shipping_address: string;
  products: {
    product_id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  total: number;
  status: OrderStatus;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

type CustomerApiResponse = {
  id: string;
  name: string;
  email: string;
  company: string;
  total_orders: number;
  total_spent: number;
};

type EnquiryApiResponse = {
  id: string;
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
};

export type AdminOrder = {
  id: string;
  orderId: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  isCompleted: boolean;
  date: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  company: string;
  totalOrders: number;
  totalSpent: number;
};

export type AdminEnquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  isRead: boolean;
  date: string;
};

const mapProduct = (item: ProductApiResponse): Product => ({
  id: item.id,
  name: item.name,
  category: item.category,
  price: item.price,
  image: item.image,
  description: item.description,
  specifications: item.specifications || [],
  isVisible: item.is_visible,
});

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('access_token');

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
    });
  } catch {
    throw new ApiError('Unable to connect to server. Check your internet or backend status.', 0);
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const data = (await response.json()) as { detail?: string };
      if (typeof data?.detail === 'string') {
        detail = data.detail;
      }
    } catch {
      detail = `Request failed (${response.status})`;
    }

    if (response.status === 401) {
      localStorage.removeItem('access_token');
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }

    throw new ApiError(detail, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchPublicProducts(category?: string): Promise<Product[]> {
  const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
  const data = await request<ProductApiResponse[]>(`/products/public${query}`);
  return data.map(mapProduct);
}

export async function fetchProductById(productId: string): Promise<Product> {
  const data = await request<ProductApiResponse>(`/products/${productId}`);
  return mapProduct(data);
}

export async function login(email: string, password: string): Promise<string> {
  const data = await request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('access_token', data.access_token);
  return data.access_token;
}

export async function register(payload: { name: string; email: string; password: string }): Promise<{ success: boolean; message: string; user_id: string }> {
  return request<{ success: boolean; message: string; user_id: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logout(): void {
  localStorage.removeItem('access_token');
}

export async function getCurrentUser(): Promise<AuthUser> {
  return request<AuthUser>('/auth/me');
}

export async function fetchCartItems(): Promise<{ product: Product; quantity: number }[]> {
  const data = await request<CartApiResponse>('/cart');
  return data.items.map((item) => ({ product: mapProduct(item.product), quantity: item.quantity }));
}

export async function addCartItem(productId: string, quantity = 1): Promise<{ product: Product; quantity: number }[]> {
  const data = await request<CartApiResponse>('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  return data.items.map((item) => ({ product: mapProduct(item.product), quantity: item.quantity }));
}

export async function updateCartItem(productId: string, quantity: number): Promise<{ product: Product; quantity: number }[]> {
  const data = await request<CartApiResponse>('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  return data.items.map((item) => ({ product: mapProduct(item.product), quantity: item.quantity }));
}

export async function removeCartItem(productId: string): Promise<{ product: Product; quantity: number }[]> {
  const data = await request<CartApiResponse>('/cart/remove', {
    method: 'DELETE',
    body: JSON.stringify({ product_id: productId }),
  });
  return data.items.map((item) => ({ product: mapProduct(item.product), quantity: item.quantity }));
}

export async function createOrder(companyName: string, shippingAddress: string): Promise<{ order_id: string }> {
  return request<{ order_id: string }>('/order/create', {
    method: 'POST',
    body: JSON.stringify({ company_name: companyName, shipping_address: shippingAddress }),
  });
}

export async function fetchMyOrders(): Promise<OrderApiResponse[]> {
  return request<OrderApiResponse[]>('/order/my');
}

export async function fetchAdminProducts(): Promise<Product[]> {
  const data = await request<ProductApiResponse[]>('/admin/products');
  return data.map(mapProduct);
}

export async function createAdminProduct(payload: {
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  specifications: { key: string; value: string }[];
  is_visible: boolean;
}): Promise<Product> {
  const data = await request<ProductApiResponse>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapProduct(data);
}

export async function updateAdminProduct(productId: string, payload: Record<string, unknown>): Promise<Product> {
  const data = await request<ProductApiResponse>(`/admin/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return mapProduct(data);
}

export async function deleteAdminProduct(productId: string): Promise<void> {
  await request<void>(`/admin/products/${productId}`, { method: 'DELETE' });
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const data = await request<OrderApiResponse[]>('/admin/orders');
  return data.map((order) => ({
    id: order.id,
    orderId: order.order_id,
    customerName: order.customer_name,
    total: order.total,
    status: order.status,
    isCompleted: order.is_completed,
    date: new Date(order.created_at).toLocaleDateString(),
  }));
}

export async function updateAdminOrderStatus(orderId: string, status: OrderStatus): Promise<AdminOrder> {
  const data = await request<OrderApiResponse>(`/admin/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return {
    id: data.id,
    orderId: data.order_id,
    customerName: data.customer_name,
    total: data.total,
    status: data.status,
    isCompleted: data.is_completed,
    date: new Date(data.created_at).toLocaleDateString(),
  };
}

export async function completeAdminOrder(orderId: string): Promise<AdminOrder> {
  const data = await request<OrderApiResponse>(`/admin/orders/${orderId}/complete`, {
    method: 'PUT',
  });
  return {
    id: data.id,
    orderId: data.order_id,
    customerName: data.customer_name,
    total: data.total,
    status: data.status,
    isCompleted: data.is_completed,
    date: new Date(data.created_at).toLocaleDateString(),
  };
}

export async function fetchAdminCustomers(): Promise<AdminCustomer[]> {
  const data = await request<CustomerApiResponse[]>('/admin/customers');
  return data.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    company: customer.company,
    totalOrders: customer.total_orders,
    totalSpent: customer.total_spent,
  }));
}

export async function submitEnquiry(payload: {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}): Promise<void> {
  await request<EnquiryApiResponse>('/enquiry', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchAdminEnquiries(): Promise<AdminEnquiry[]> {
  const data = await request<EnquiryApiResponse[]>('/admin/enquiries');
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    company: item.company,
    subject: item.subject,
    message: item.message,
    isRead: item.is_read,
    date: new Date(item.created_at).toLocaleDateString(),
  }));
}

export async function markAdminEnquiryRead(enquiryId: string): Promise<void> {
  await request<EnquiryApiResponse>(`/admin/enquiries/${enquiryId}/read`, {
    method: 'PUT',
  });
}
