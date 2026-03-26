import { useEffect, useState } from 'react';
import { orders } from '../data/mockData';
import { AdminOrder, completeAdminOrder, fetchAdminOrders, getErrorMessage, updateAdminOrderStatus } from '../services/api';
import { cn } from '../lib/utils';

export const OrderManagement = () => {
  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders();
      setAdminOrders(data);
    } catch {
      setAdminOrders(
        orders.map((order) => ({
          id: order.id,
          orderId: order.id,
          customerName: order.customerName,
          total: order.total,
          status: order.status,
          isCompleted: false,
          date: order.date,
        })),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onStatusChange = async (orderId: string, status: 'Processing' | 'Packing' | 'Shipped' | 'Delivered') => {
    setUpdatingOrderId(orderId);
    try {
      await updateAdminOrderStatus(orderId, status);
      alert('Order status updated successfully.');
      await loadOrders();
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to update status'));
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const onCompleteOrder = async (orderId: string) => {
    const confirmed = window.confirm('Mark this order as completed? This will lock further status updates.');
    if (!confirmed) return;

    setUpdatingOrderId(orderId);
    try {
      await completeAdminOrder(orderId);
      alert('Order marked as completed.');
      await loadOrders();
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to complete order'));
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Order Management</h1>
      {loading && <p className="text-sm text-accent-grey">Loading orders...</p>}
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
            {adminOrders.map((order) => (
              <tr
                key={order.id}
                className={cn(
                  'border-b border-gray-50 transition-colors',
                  order.isCompleted ? 'bg-green-50' : 'hover:bg-gray-50',
                )}
              >
                <td className="px-6 py-4 font-bold text-sm">{order.orderId}</td>
                <td className="px-6 py-4 text-sm">{order.customerName}</td>
                <td className="px-6 py-4 text-sm font-bold text-primary">₹{order.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  {order.isCompleted && (
                    <span className="mr-3 inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm bg-green-100 text-green-700">
                      Completed
                    </span>
                  )}
                  <select
                    value={order.status}
                    disabled={updatingOrderId === order.id || order.isCompleted}
                    onChange={(e) => onStatusChange(order.id, e.target.value as 'Processing' | 'Packing' | 'Shipped' | 'Delivered')}
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm outline-none disabled:opacity-50',
                      order.status === 'Delivered' ? 'bg-green-100 text-green-600' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600',
                    )}
                  >
                    <option>Processing</option>
                    <option>Packing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-accent-grey">{order.date}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-primary text-xs font-bold hover:underline">View Details</button>
                  {!order.isCompleted && (
                    <button
                      disabled={updatingOrderId === order.id}
                      onClick={() => onCompleteOrder(order.id)}
                      className="text-green-700 text-xs font-bold hover:underline disabled:opacity-50"
                    >
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
