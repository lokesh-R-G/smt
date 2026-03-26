import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { categories, products } from '../data/mockData';
import { Product } from '../types';
import { fetchPublicProducts } from '../services/api';
import { cn } from '../lib/utils';

export const ProductsPage = ({ addToCart }: { addToCart: (p: Product) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loadedProducts, setLoadedProducts] = useState<Product[]>(products);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPublicProducts(selectedCategory);
        if (isMounted) setLoadedProducts(data);
      } catch {
        if (isMounted) {
          const fallback = selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);
          setLoadedProducts(fallback);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl font-bold mb-6">Industrial Catalog</h1>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedCategory('All')}
              className={cn('px-6 py-2 rounded-full text-sm font-medium transition-all', selectedCategory === 'All' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100')}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={cn('px-6 py-2 rounded-full text-sm font-medium transition-all', selectedCategory === cat.name ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100')}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <p className="text-sm text-accent-grey mb-6">Loading products...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loadedProducts.map((product) => (
            <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group bg-white premium-shadow overflow-hidden flex flex-col">
              <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">{product.category}</div>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`} className="text-lg font-bold mb-2 hover:text-primary transition-colors">{product.name}</Link>
                <p className="text-accent-grey text-sm mb-6 line-clamp-2">{product.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                  <button onClick={() => addToCart(product)} className="p-3 bg-gray-50 hover:bg-primary hover:text-white rounded-full transition-all">
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
