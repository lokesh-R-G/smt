import { type FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Edit, Eye, EyeOff, Plus, Trash2, X } from 'lucide-react';
import { categories, products } from '../data/mockData';
import { Product } from '../types';
import { createAdminProduct, deleteAdminProduct, fetchAdminProducts, getErrorMessage } from '../services/api';
import { cn } from '../lib/utils';

export const ProductManagement = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: '',
    category: categories[0]?.name || 'Safety Helmets',
    price: '',
    image: 'https://picsum.photos/seed/newproduct/600/600',
    description: '',
    isVisible: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadProducts = async () => {
    try {
      const data = await fetchAdminProducts();
      setAdminProducts(data);
    } catch {
      setAdminProducts(products);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Product name is required';
    if (!form.price || Number(form.price) <= 0) next.price = 'Price must be greater than 0';
    if (!form.description.trim() || form.description.trim().length < 10) next.description = 'Description must be at least 10 characters';
    if (!/^https?:\/\//.test(form.image)) next.image = 'Image URL must start with http:// or https://';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      await createAdminProduct({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        image: form.image,
        description: form.description,
        specifications: [],
        is_visible: form.isVisible,
      });
      alert('Product created successfully.');
      setIsAdding(false);
      setForm({
        name: '',
        category: categories[0]?.name || 'Safety Helmets',
        price: '',
        image: 'https://picsum.photos/seed/newproduct/600/600',
        description: '',
        isVisible: true,
      });
      setErrors({});
      await loadProducts();
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to create product'));
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async (productId: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteAdminProduct(productId);
      alert('Product deleted successfully.');
      await loadProducts();
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to delete product'));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button onClick={() => setIsAdding(true)} className="bg-primary text-white px-6 py-3 rounded-sm font-bold flex items-center gap-2 hover:bg-primary-dark transition-all">
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 premium-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Add New Product</h3>
            <button onClick={() => setIsAdding(false)}><X className="w-5 h-5" /></button>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={onCreate}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Product Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 bg-background-light border-0 outline-none" />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Category</label>
              <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 bg-background-light border-0 outline-none">
                {categories.map((c) => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} className="w-full px-4 py-3 bg-background-light border-0 outline-none" />
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Visibility</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="visibility" checked={form.isVisible} onChange={() => setForm((prev) => ({ ...prev, isVisible: true }))} /> Public</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="visibility" checked={!form.isVisible} onChange={() => setForm((prev) => ({ ...prev, isVisible: false }))} /> Private</label>
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-3 bg-background-light border-0 outline-none resize-none"></textarea>
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Image URL</label>
              <input type="url" value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} className="w-full px-4 py-3 bg-background-light border-0 outline-none" />
              {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
            </div>
            <div className="md:col-span-2 flex justify-end gap-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 font-bold text-accent-grey">Cancel</button>
              <button disabled={isSaving} type="submit" className="bg-primary text-white px-12 py-3 rounded-sm font-bold disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Product'}</button>
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
            {adminProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-sm" referrerPolicy="no-referrer" /><span className="font-bold text-sm">{product.name}</span></div></td>
                <td className="px-6 py-4 text-sm text-accent-grey">{product.category}</td>
                <td className="px-6 py-4 text-sm font-bold">₹{product.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={cn('inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest', product.isVisible ? 'text-green-500' : 'text-gray-400')}>
                    {product.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {product.isVisible ? 'Public' : 'Private'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-sm transition-colors"><Edit className="w-4 h-4 text-accent-grey" /></button>
                    <button onClick={() => onDelete(product.id)} className="p-2 hover:bg-gray-100 rounded-sm transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
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
