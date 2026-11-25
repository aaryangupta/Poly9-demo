import React from 'react';
import { Link } from 'react-router-dom';
import categoriesData from '../data/categories.json';

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Product Categories</h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Explore Moradabad metal, wood, and glass handcrafted collections categorized for international trade buyers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoriesData.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group bg-white rounded-3xl overflow-hidden border border-zinc-200/80 hover:border-zinc-300 hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="aspect-[16/10] bg-zinc-100 overflow-hidden relative">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {cat.count} Items
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-900">
                <span>Browse category catalog</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
