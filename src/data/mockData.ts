import { Product, Order, Customer, Enquiry, Category } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Safety Helmets', image: 'https://picsum.photos/seed/helmet/400/300' },
  { id: '2', name: 'Protective Eyewear', image: 'https://picsum.photos/seed/glasses/400/300' },
  { id: '3', name: 'Industrial Gloves', image: 'https://picsum.photos/seed/gloves/400/300' },
  { id: '4', name: 'Safety Shoes', image: 'https://picsum.photos/seed/shoes/400/300' },
  { id: '5', name: 'High-Vis Vests', image: 'https://picsum.photos/seed/vest/400/300' },
  { id: '6', name: 'Respiratory Protection', image: 'https://picsum.photos/seed/mask/400/300' },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Industrial Hard Hat V2',
    category: 'Safety Helmets',
    price: 1250,
    image: 'https://picsum.photos/seed/helmet1/600/600',
    description: 'High-impact resistant safety helmet designed for extreme industrial environments. Features a 6-point suspension system for maximum comfort.',
    isVisible: true,
    specifications: [
      { key: 'Material', value: 'High-Density Polyethylene' },
      { key: 'Weight', value: '450g' },
      { key: 'Standards', value: 'ANSI Z89.1-2014' },
    ],
  },
  {
    id: 'p2',
    name: 'Anti-Fog Safety Goggles',
    category: 'Protective Eyewear',
    price: 450,
    image: 'https://picsum.photos/seed/glasses1/600/600',
    description: 'Professional grade anti-fog goggles with wide peripheral vision and adjustable strap.',
    isVisible: true,
    specifications: [
      { key: 'Lens', value: 'Polycarbonate' },
      { key: 'Coating', value: 'Anti-scratch, Anti-fog' },
    ],
  },
  {
    id: 'p3',
    name: 'Cut Resistant Nitrile Gloves',
    category: 'Industrial Gloves',
    price: 320,
    image: 'https://picsum.photos/seed/gloves1/600/600',
    description: 'Level 5 cut resistant gloves with nitrile palm coating for superior grip in oily conditions.',
    isVisible: true,
    specifications: [
      { key: 'Material', value: 'HPPE, Nitrile' },
      { key: 'Size', value: 'L, XL' },
    ],
  },
  {
    id: 'p4',
    name: 'Steel Toe Work Boots',
    category: 'Safety Shoes',
    price: 3500,
    image: 'https://picsum.photos/seed/boots1/600/600',
    description: 'Heavy-duty steel toe work boots with slip-resistant sole and electrical hazard protection.',
    isVisible: true,
    specifications: [
      { key: 'Upper', value: 'Genuine Leather' },
      { key: 'Toe', value: 'Steel' },
      { key: 'Sole', value: 'Dual Density PU' },
    ],
  },
];

export const orders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Reliance Industries',
    products: [{ productId: 'p1', quantity: 50, name: 'Industrial Hard Hat V2', price: 1250 }],
    total: 62500,
    status: 'Delivered',
    date: '2026-03-15',
  },
  {
    id: 'ORD-002',
    customerName: 'Tata Steel',
    products: [{ productId: 'p4', quantity: 20, name: 'Steel Toe Work Boots', price: 3500 }],
    total: 70000,
    status: 'Shipped',
    date: '2026-03-20',
  },
  {
    id: 'ORD-003',
    customerName: 'L&T Construction',
    products: [
      { productId: 'p2', quantity: 100, name: 'Anti-Fog Safety Goggles', price: 450 },
      { productId: 'p3', quantity: 200, name: 'Cut Resistant Nitrile Gloves', price: 320 },
    ],
    total: 109000,
    status: 'Processing',
    date: '2026-03-25',
  },
];

export const customers: Customer[] = [
  { id: 'c1', name: 'John Doe', email: 'john@reliance.com', company: 'Reliance Industries', totalOrders: 12, totalSpent: 450000 },
  { id: 'c2', name: 'Sarah Smith', email: 'sarah@tata.com', company: 'Tata Steel', totalOrders: 8, totalSpent: 320000 },
  { id: 'c3', name: 'Mike Johnson', email: 'mike@lnt.com', company: 'L&T Construction', totalOrders: 5, totalSpent: 180000 },
];

export const enquiries: Enquiry[] = [
  { id: 'e1', name: 'Robert Brown', email: 'robert@adani.com', company: 'Adani Group', subject: 'Bulk order for safety vests', message: 'We are looking for 500 high-vis vests with custom logo printing.', date: '2026-03-24' },
  { id: 'e2', name: 'Emily Davis', email: 'emily@jsw.com', company: 'JSW Steel', subject: 'Product inquiry: Steel toe boots', message: 'Do you have size 12 available for the steel toe boots?', date: '2026-03-25' },
];
