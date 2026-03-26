import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Clock, Shield, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { categories } from '../data/mockData';

export const HomePage = () => {
  return (
    <div className="pt-20">
      <section className="relative h-[80vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=2070"
            alt="Industrial Background"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-light via-background-light/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl font-bold text-primary leading-[1.1] mb-8">
              Excellence in <br />
              <span className="italic text-primary-dark">Industrial Safety.</span>
            </h1>
            <p className="text-xl text-accent-grey mb-10 leading-relaxed">
              Premium B2B industrial safety solutions for modern enterprises.
              Browse our curated collection of high-performance protective gear.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-sm font-medium hover:bg-primary-dark transition-all group">
              Explore Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-primary mb-4 block">Our Expertise</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Product Categories</h2>
            </div>
            <Link to="/products" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All Products <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-6">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{category.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-background-light">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary mb-4 block">The Advantage</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Why Industry Leaders <br />Trust Maruthi Traders</h2>

            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 premium-shadow"><Shield className="text-primary w-6 h-6" /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Certified Quality</h4>
                  <p className="text-accent-grey leading-relaxed">All our products meet international safety standards and undergo rigorous quality checks.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 premium-shadow"><Truck className="text-primary w-6 h-6" /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Bulk Logistics</h4>
                  <p className="text-accent-grey leading-relaxed">Specialized in large-scale industrial supply chains with efficient delivery across the country.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 premium-shadow"><Clock className="text-primary w-6 h-6" /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2">24/7 Support</h4>
                  <p className="text-accent-grey leading-relaxed">Dedicated account managers for our B2B clients to ensure seamless procurement operations.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070" alt="Industrial Safety" className="rounded-sm premium-shadow" referrerPolicy="no-referrer" />
            <div className="absolute -bottom-10 -left-10 bg-primary p-10 text-white hidden md:block">
              <span className="text-5xl font-serif font-bold block mb-2">15+</span>
              <span className="text-sm uppercase tracking-widest font-bold">Years of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-accent-grey mb-12 block">Trusted by Global Enterprises</span>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-serif font-bold">RELIANCE</span>
            <span className="text-2xl font-serif font-bold">TATA STEEL</span>
            <span className="text-2xl font-serif font-bold">L&T</span>
            <span className="text-2xl font-serif font-bold">ADANI</span>
            <span className="text-2xl font-serif font-bold">JSW</span>
          </div>
        </div>
      </section>
    </div>
  );
};
