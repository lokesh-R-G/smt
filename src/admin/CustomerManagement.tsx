import { useEffect, useState } from 'react';
import { customers } from '../data/mockData';
import { AdminCustomer, fetchAdminCustomers } from '../services/api';

export const CustomerManagement = () => {
  const [adminCustomers, setAdminCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminCustomers();
        setAdminCustomers(data);
      } catch {
        setAdminCustomers(
          customers.map((customer) => ({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            company: customer.company,
            totalOrders: customer.totalOrders,
            totalSpent: customer.totalSpent,
          })),
        );
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Customer Management</h1>
      {loading && <p className="text-sm text-accent-grey">Loading customers...</p>}
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
            {adminCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-sm">{customer.name}</p>
                  <p className="text-xs text-accent-grey">{customer.email}</p>
                </td>
                <td className="px-6 py-4 text-sm">{customer.company}</td>
                <td className="px-6 py-4 text-sm font-bold">{customer.totalOrders}</td>
                <td className="px-6 py-4 text-sm font-bold text-primary">₹{customer.totalSpent.toLocaleString()}</td>
                <td className="px-6 py-4 text-right"><button className="text-primary text-xs font-bold hover:underline">View History</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
