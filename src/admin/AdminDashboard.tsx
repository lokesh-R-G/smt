import { BarChart3, ListOrdered, MessageSquare, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { products } from '../data/mockData';

export const AdminDashboard = () => {
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
              <div className="p-3 bg-background-light rounded-sm"><stat.icon className="w-5 h-5 text-primary" /></div>
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
                <Tooltip cursor={{ fill: '#f4f6f9' }} contentStyle={{ border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '4px' }} />
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
