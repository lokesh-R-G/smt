import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, LogOut, MessageSquare, Package, Shield, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
              'flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm font-medium',
              location.pathname === item.path ? 'bg-white text-primary' : 'text-blue-100 hover:bg-white/10',
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            signOut();
            navigate('/login');
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-blue-100 hover:bg-white/10 rounded-sm transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};
