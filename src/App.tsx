import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  ArrowRight, 
  Shield, 
  Truck, 
  Clock, 
  CheckCircle,
  LayoutDashboard,
  Package,
  ListOrdered,
  Users,
  MessageSquare,
  BarChart3,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronRight,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from './lib/utils';
import { products, categories, orders, customers, enquiries } from './data/mockData';
import { Product, Order, Customer, Enquiry } from './types';

// --- Components ---

const Navbar = ({ cartCount }: { cartCount: number }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "glass-nav py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-primary">
            SRI MARUTHI TRADERS
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">Products</Link>
          <Link to="/enquiry" className="text-sm font-medium hover:text-primary transition-colors">Enquiry</Link>
          <Link to="/admin" className="text-sm font-medium text-accent-grey hover:text-primary transition-colors">Admin</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/login" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 md:hidden shadow-lg"
          >
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Home</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Products</Link>
            <Link to="/enquiry" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Enquiry</Link>
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-accent-grey">Admin</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-primary text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="text-white w-8 h-8" />
            <span className="font-serif text-2xl font-bold tracking-tight">SRI MARUTHI TRADERS</span>
          </div>
          <p className="text-blue-100 max-w-md mb-8 leading-relaxed">
            Leading supplier of industrial safety equipment and personal protective gear. 
            Committed to ensuring workplace safety across industries with premium quality products.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-blue-100">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
            <li><Link to="/enquiry" className="hover:text-white transition-colors">Enquiry</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-blue-100">
            <li>123 Industrial Estate, Phase II</li>
            <li>Bangalore, Karnataka - 560001</li>
            <li>+91 98765 43210</li>
            <li>info@srimaruthitraders.com</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-blue-800 text-center text-blue-200 text-sm">
        &copy; {new Date().getFullYear()} SRI MARUTHI TRADERS. All rights reserved.
      </div>
    </footer>
  );
};

// --- Pages ---

const Home = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=2070" 
            alt="Industrial Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-light via-background-light/80 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-primary leading-[1.1] mb-8">
              Excellence in <br />
              <span className="italic text-primary-dark">Industrial Safety.</span>
            </h1>
            <p className="text-xl text-accent-grey mb-10 leading-relaxed">
              Premium B2B industrial safety solutions for modern enterprises. 
              Browse our curated collection of high-performance protective gear.
            </p>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-sm font-medium hover:bg-primary-dark transition-all group"
            >
              Explore Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-primary mb-4 block">Our Expertise</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Product Categories</h2>
            </div>
            <Link to="/products" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All Products <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-6">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{category.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 bg-background-light">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary mb-4 block">The Advantage</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Why Industry Leaders <br />Trust Maruthi Traders</h2>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 premium-shadow">
                  <Shield className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Certified Quality</h4>
                  <p className="text-accent-grey leading-relaxed">All our products meet international safety standards and undergo rigorous quality checks.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 premium-shadow">
                  <Truck className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Bulk Logistics</h4>
                  <p className="text-accent-grey leading-relaxed">Specialized in large-scale industrial supply chains with efficient delivery across the country.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 premium-shadow">
                  <Clock className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">24/7 Support</h4>
                  <p className="text-accent-grey leading-relaxed">Dedicated account managers for our B2B clients to ensure seamless procurement operations.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070" 
              alt="Industrial Safety" 
              className="rounded-sm premium-shadow"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -left-10 bg-primary p-10 text-white hidden md:block">
              <span className="text-5xl font-serif font-bold block mb-2">15+</span>
              <span className="text-sm uppercase tracking-widest font-bold">Years of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Major Clients */}
      <section className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-accent-grey mb-12 block">Trusted by Global Enterprises</span>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-serif font-bold">RELIANCE</span>
            <span className="text-2xl font-serif font-bold">TATA STEEL</span>
            <span className="text-2xl font-serif font-bold">L&T</span>
            <span className="text-2xl font-serif font-bold">ADANI</span>
            <span className="text-2xl font-serif font-bold">JSW</span>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductsPage = ({ addToCart }: { addToCart: (p: Product) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-6">Industrial Catalog</h1>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setSelectedCategory('All')}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                selectedCategory === 'All' ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-100"
              )}
            >
              All Products
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  selectedCategory === cat.name ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group bg-white premium-shadow overflow-hidden flex flex-col"
            >
              <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  {product.category}
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`} className="text-lg font-bold mb-2 hover:text-primary transition-colors">
                  {product.name}
                </Link>
                <p className="text-accent-grey text-sm mb-6 line-clamp-2">{product.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-3 bg-gray-50 hover:bg-primary hover:text-white rounded-full transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductDetail = ({ addToCart }: { addToCart: (p: Product) => void }) => {
  const { id } = useLocation().pathname.split('/').pop() ? { id: useLocation().pathname.split('/').pop() } : { id: '' };
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-accent-grey hover:text-primary mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="bg-white p-8 premium-shadow">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary mb-4 block">{product.category}</span>
            <h1 className="text-5xl font-bold mb-6">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-8 font-serif">₹{product.price.toLocaleString()}</p>
            
            <div className="prose prose-slate mb-10">
              <p className="text-accent-grey text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold mb-4">Specifications</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-accent-grey">{spec.key}</span>
                    <span className="font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-200 rounded-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="px-6 font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => addToCart({ ...product })}
                className="flex-grow bg-primary text-white py-4 rounded-sm font-bold hover:bg-primary-dark transition-all"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ cart, updateQuantity, removeFromCart }: { 
  cart: { product: Product, quantity: number }[], 
  updateQuantity: (id: string, q: number) => void,
  removeFromCart: (id: string) => void
}) => {
  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-12">Procurement Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white premium-shadow">
            <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-xl text-accent-grey mb-8">Your cart is empty</p>
            <Link to="/products" className="inline-block bg-primary text-white px-8 py-4 rounded-sm font-bold">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white premium-shadow overflow-hidden">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-6 p-6 border-b border-gray-100 last:border-0">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-24 h-24 object-cover rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold">{item.product.name}</h3>
                    <p className="text-sm text-accent-grey">{item.product.category}</p>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-sm">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="px-4 font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-primary">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white premium-shadow p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <p className="text-accent-grey mb-1">Total Procurement Value</p>
                <p className="text-4xl font-serif font-bold text-primary">₹{total.toLocaleString()}</p>
              </div>
              <button className="bg-primary text-white px-12 py-4 rounded-sm font-bold hover:bg-primary-dark transition-all">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EnquiryPage = () => {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Business Enquiry</h1>
          <p className="text-xl text-accent-grey">Get a custom quote for bulk requirements or specialized equipment.</p>
        </div>

        <div className="bg-white premium-shadow p-10">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-accent-grey">Full Name</label>
              <input type="text" className="w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-accent-grey">Email Address</label>
              <input type="email" className="w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="john@company.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-accent-grey">Company Name</label>
              <input type="text" className="w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Industrial Solutions Ltd." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-accent-grey">Subject</label>
              <input type="text" className="w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Bulk Order Inquiry" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-accent-grey">Message</label>
              <textarea rows={6} className="w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all resize-none" placeholder="Tell us about your requirements..."></textarea>
            </div>
            <div className="md:col-span-2">
              <button className="w-full bg-primary text-white py-4 rounded-sm font-bold hover:bg-primary-dark transition-all">
                Submit Enquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background-light">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white premium-shadow p-10"
      >
        <div className="text-center mb-10">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Client Login</h1>
          <p className="text-accent-grey mt-2">Access your business dashboard</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/admin'); }}>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Email</label>
            <input type="email" required className="w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Password</label>
            <input type="password" required className="w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <button className="w-full bg-primary text-white py-4 rounded-sm font-bold hover:bg-primary-dark transition-all">
            Sign In
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-accent-grey">
          Don't have an account? <Link to="/enquiry" className="text-primary font-bold hover:underline">Contact Sales</Link>
        </div>
      </motion.div>
    </div>
  );
};

// --- Admin Components ---

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ListOrdered, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: MessageSquare, label: 'Enquiries', path: '/admin/enquiries' },
  ];

  return (
    <div className="w-64 bg-primary-dark text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6" />
          <span className="font-serif font-bold text-lg">MARUTHI</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-300">Admin Control</span>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm font-medium",
              location.pathname === item.path ? "bg-white text-primary" : "text-blue-100 hover:bg-white/10"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-blue-100 hover:bg-white/10 rounded-sm transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Sales', value: '₹12.4L', trend: '+12%', icon: BarChart3 },
    { label: 'Active Orders', value: '24', trend: '+5', icon: ListOrdered },
    { label: 'New Enquiries', value: '8', trend: '+2', icon: MessageSquare },
    { label: 'Total Customers', value: '142', trend: '+8', icon: Users },
  ];

  const chartData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sales Analytics</h1>
        <div className="flex gap-4">
          <select className="bg-white border-0 px-4 py-2 text-sm font-medium premium-shadow outline-none">
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 premium-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-background-light rounded-sm">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-bold text-green-500">{stat.trend}</span>
            </div>
            <p className="text-accent-grey text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 premium-shadow">
          <h3 className="text-lg font-bold mb-8">Revenue Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f4f6f9' }}
                  contentStyle={{ border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px' }}
                />
                <Bar dataKey="sales" fill="#0B3D91" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 premium-shadow">
          <h3 className="text-lg font-bold mb-8">Top Selling Products</h3>
          <div className="space-y-6">
            {products.slice(0, 4).map((product, i) => (
              <div key={i} className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-sm" referrerPolicy="no-referrer" />
                <div className="flex-grow">
                  <p className="text-sm font-bold">{product.name}</p>
                  <p className="text-xs text-accent-grey">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">₹{(product.price * 10).toLocaleString()}</p>
                  <p className="text-[10px] text-green-500 font-bold">10 Sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white px-6 py-3 rounded-sm font-bold flex items-center gap-2 hover:bg-primary-dark transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 premium-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Add New Product</h3>
            <button onClick={() => setIsAdding(false)}><X className="w-5 h-5" /></button>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Product Name</label>
              <input type="text" className="w-full px-4 py-3 bg-background-light border-0 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Category</label>
              <select className="w-full px-4 py-3 bg-background-light border-0 outline-none">
                {categories.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Price (₹)</label>
              <input type="number" className="w-full px-4 py-3 bg-background-light border-0 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Visibility</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="visibility" defaultChecked /> Public
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="visibility" /> Private
                </label>
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Description</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-background-light border-0 outline-none resize-none"></textarea>
            </div>
            <div className="md:col-span-2">
              <div className="border-2 border-dashed border-gray-200 p-12 text-center rounded-sm hover:border-primary transition-colors cursor-pointer">
                <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-accent-grey">Click to upload product image</p>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 font-bold text-accent-grey">Cancel</button>
              <button type="submit" className="bg-primary text-white px-12 py-3 rounded-sm font-bold">Save Product</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white premium-shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Product</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Category</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Price</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-sm" referrerPolicy="no-referrer" />
                    <span className="font-bold text-sm">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-accent-grey">{product.category}</td>
                <td className="px-6 py-4 text-sm font-bold">₹{product.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-500">
                    <Eye className="w-3 h-3" /> Public
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-sm transition-colors"><Edit className="w-4 h-4 text-accent-grey" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-sm transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderManagement = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Order Management</h1>
      <div className="bg-white premium-shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Customer</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Total</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Date</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-sm">{order.id}</td>
                <td className="px-6 py-4 text-sm">{order.customerName}</td>
                <td className="px-6 py-4 text-sm font-bold text-primary">₹{order.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <select 
                    defaultValue={order.status}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm outline-none",
                      order.status === 'Delivered' ? "bg-green-100 text-green-600" : 
                      order.status === 'Shipped' ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-600"
                    )}
                  >
                    <option>Processing</option>
                    <option>Packing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-accent-grey">{order.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary text-xs font-bold hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CustomerManagement = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Customer Management</h1>
      <div className="bg-white premium-shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Customer</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Company</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Orders</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey">Total Spent</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-accent-grey text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-sm">{customer.name}</p>
                  <p className="text-xs text-accent-grey">{customer.email}</p>
                </td>
                <td className="px-6 py-4 text-sm">{customer.company}</td>
                <td className="px-6 py-4 text-sm font-bold">{customer.totalOrders}</td>
                <td className="px-6 py-4 text-sm font-bold text-primary">₹{customer.totalSpent.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary text-xs font-bold hover:underline">View History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EnquiryManagement = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Enquiry Management</h1>
      <div className="grid grid-cols-1 gap-6">
        {enquiries.map((enquiry) => (
          <div key={enquiry.id} className="bg-white p-8 premium-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">{enquiry.subject}</h3>
                <p className="text-sm text-accent-grey">From: <span className="font-bold text-gray-900">{enquiry.name}</span> ({enquiry.company})</p>
              </div>
              <span className="text-xs text-accent-grey">{enquiry.date}</span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6 bg-background-light p-4 rounded-sm italic">
              "{enquiry.message}"
            </p>
            <div className="flex justify-end gap-4">
              <button className="text-sm font-bold text-accent-grey hover:text-primary transition-colors">Mark as Read</button>
              <button className="bg-primary text-white px-6 py-2 rounded-sm text-sm font-bold">Reply via Email</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, q: number) => {
    if (q < 1) return;
    setCart(prev => prev.map(item => item.product.id === id ? { ...item, quantity: q } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={cartCount} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
            <Route path="/enquiry" element={<EnquiryPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <div className="flex min-h-screen bg-background-light">
                <AdminSidebar />
                <div className="flex-grow ml-64 p-12">
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="customers" element={<CustomerManagement />} />
                    <Route path="enquiries" element={<EnquiryManagement />} />
                  </Routes>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
