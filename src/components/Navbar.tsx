import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Shield, ShoppingCart, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Navbar = ({ cartCount }: { cartCount: number }) => {
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
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'glass-nav py-3' : 'bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-primary">SRI MARUTHI TRADERS</span>
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
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
