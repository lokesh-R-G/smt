import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const Footer = () => {
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
