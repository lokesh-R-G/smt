import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

export const CartPage = ({
  cart,
  updateQuantity,
  removeFromCart,
  checkout,
  isLoading,
}: {
  cart: { product: Product; quantity: number }[];
  updateQuantity: (id: string, q: number) => void;
  removeFromCart: (id: string) => void;
  checkout: () => void;
  isLoading?: boolean;
}) => {
  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-12">Procurement Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white premium-shadow">
            <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-xl text-accent-grey mb-8">Your cart is empty</p>
            <Link to="/products" className="inline-block bg-primary text-white px-8 py-4 rounded-sm font-bold">Continue Shopping</Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white premium-shadow overflow-hidden">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-6 p-6 border-b border-gray-100 last:border-0">
                  <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-sm" referrerPolicy="no-referrer" />
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold">{item.product.name}</h3>
                    <p className="text-sm text-accent-grey">{item.product.category}</p>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-sm">
                    <button disabled={isLoading} onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-50 disabled:opacity-50">-</button>
                    <span className="px-4 font-bold">{item.quantity}</span>
                    <button disabled={isLoading} onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-50 disabled:opacity-50">+</button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-primary">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    <button disabled={isLoading} onClick={() => removeFromCart(item.product.id)} className="text-xs text-red-500 hover:underline mt-1 disabled:opacity-50">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white premium-shadow p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <p className="text-accent-grey mb-1">Total Procurement Value</p>
                <p className="text-4xl font-serif font-bold text-primary">₹{total.toLocaleString()}</p>
              </div>
              <button disabled={isLoading} onClick={checkout} className="bg-primary text-white px-12 py-4 rounded-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50">
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
