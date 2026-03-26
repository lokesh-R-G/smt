import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { Product } from './types';
import { useAuth } from './context/AuthContext';
import { addCartItem, createOrder, fetchCartItems, getErrorMessage, removeCartItem, updateCartItem } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { EnquiryPage } from './pages/EnquiryPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminDashboard } from './admin/AdminDashboard';
import { ProductManagement } from './admin/ProductManagement';
import { OrderManagement } from './admin/OrderManagement';
import { CustomerManagement } from './admin/CustomerManagement';
import { EnquiryManagement } from './admin/EnquiryManagement';

export default function App() {
  const { loading: authLoading, isAuthenticated, isAdmin, signOut } = useAuth();
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;
    const loadCart = async () => {
      try {
        setCartLoading(true);
        const data = await fetchCartItems();
        if (mounted) setCart(data);
      } catch {
        if (mounted) signOut();
      } finally {
        if (mounted) setCartLoading(false);
      }
    };

    loadCart();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, signOut]);

  const addToCart = async (product: Product) => {
    if (isAuthenticated) {
      try {
        setCartLoading(true);
        const data = await addCartItem(product.id, 1);
        setCart(data);
        return;
      } catch {
        signOut();
      } finally {
        setCartLoading(false);
      }
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = async (id: string, q: number) => {
    if (q < 1) return;

    if (isAuthenticated) {
      try {
        setCartLoading(true);
        const data = await updateCartItem(id, q);
        setCart(data);
        return;
      } catch {
        signOut();
      } finally {
        setCartLoading(false);
      }
    }

    setCart((prev) => prev.map((item) => (item.product.id === id ? { ...item, quantity: q } : item)));
  };

  const removeFromCart = async (id: string) => {
    if (isAuthenticated) {
      try {
        setCartLoading(true);
        const data = await removeCartItem(id);
        setCart(data);
        return;
      } catch {
        signOut();
      } finally {
        setCartLoading(false);
      }
    }

    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const checkout = async () => {
    if (!isAuthenticated) {
      alert('Please login to place an order.');
      return;
    }

    const companyName = window.prompt('Enter company name');
    if (!companyName) return;

    const shippingAddress = window.prompt('Enter shipping address');
    if (!shippingAddress) return;

    try {
      setCartLoading(true);
      await createOrder(companyName, shippingAddress);
      setCart([]);
      alert('Order created successfully.');
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to create order. Please try again.'));
    } finally {
      setCartLoading(false);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={cartCount} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetailPage addToCart={addToCart} />} />
            <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} checkout={checkout} isLoading={cartLoading} />} />
            <Route path="/enquiry" element={<EnquiryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/admin/*"
              element={
                authLoading ? (
                  <div className="p-10 text-center">Loading...</div>
                ) : !isAuthenticated ? (
                  <div className="p-10 text-center">
                    <p className="mb-4">Please login to access admin dashboard.</p>
                    <Link to="/login" className="text-primary font-bold">Go to Login</Link>
                  </div>
                ) : !isAdmin ? (
                  <div className="p-10 text-center">Admin access required.</div>
                ) : (
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
                )
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
