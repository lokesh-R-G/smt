import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { products } from '../data/mockData';
import { Product } from '../types';
import { fetchProductById } from '../services/api';

export const ProductDetailPage = ({ addToCart }: { addToCart: (p: Product) => void }) => {
  const { id = '' } = useParams();
  const [product, setProduct] = useState<Product | null>(products.find((p) => p.id === id) ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProductById(id);
        if (isMounted) setProduct(data);
      } catch {
        if (isMounted) setProduct(products.find((p) => p.id === id) ?? null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading && !product) return <div className="pt-32 text-center">Loading product...</div>;
  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-accent-grey hover:text-primary mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="bg-white p-8 premium-shadow">
            <img src={product.image} alt={product.name} className="w-full h-auto object-contain" referrerPolicy="no-referrer" />
          </div>

          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary mb-4 block">{product.category}</span>
            <h1 className="text-5xl font-bold mb-6">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-8 font-serif">₹{product.price.toLocaleString()}</p>
            <div className="prose prose-slate mb-10">
              <p className="text-accent-grey text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold mb-4">Specifications</h3>
              <div className="grid grid-cols-1 gap-3">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-accent-grey">{spec.key}</span>
                    <span className="font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-200 rounded-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-50 transition-colors">-</button>
                <span className="px-6 font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-gray-50 transition-colors">+</button>
              </div>
              <button onClick={() => addToCart({ ...product })} className="flex-grow bg-primary text-white py-4 rounded-sm font-bold hover:bg-primary-dark transition-all">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
