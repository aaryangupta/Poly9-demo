import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Anchor, Box, Clock, Layers, FileSpreadsheet, Wand2, Palette, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../context/ProductContext';
import categoriesData from '../data/categories.json';
import companyInfo from '../data/companyInfo.json';

const HERO_SLIDES = [
  {
    image: "https://images.poly9.ai/companies/9347e616-9901-46d5-9b3b-5df33daaf4eb/storefront/42ee6e36-28a0-4ce9-95b4-b4238de6ce78/banner-aluminium-v2.jpg",
    eyebrow: "SAG New Look · Moradabad",
    title: "Aluminium, iron, wood and glass décor from Moradabad",
    description: "Over 650 export products: planters, vases and bowls, candle holders, and accent furniture. FOB prices and custom lines for buyers worldwide."
  },
  {
    image: "https://images.poly9.ai/companies/9347e616-9901-46d5-9b3b-5df33daaf4eb/storefront/94979f41-7b96-4db8-95aa-14235e62749b/banner-iron-v2.jpg",
    eyebrow: "Artisanal Metalworking",
    title: "Handcrafted Iron Planters & Architectural Accents",
    description: "Export-grade sheet metal, ribbing, and powder-coated finishes engineered for leading home & garden retailers worldwide."
  },
  {
    image: "https://images.poly9.ai/companies/9347e616-9901-46d5-9b3b-5df33daaf4eb/storefront/491fc39a-0095-4af1-a23a-a4b5bafe0a78/banner-glass-v2.jpg",
    eyebrow: "Lighting & Candle Decor",
    title: "Perforated Metal Lanterns & Glass Candle Holders",
    description: "Atmospheric tabletop and hanging candle holders designed for modern boutique showrooms and department stores."
  },
  {
    image: "https://images.poly9.ai/companies/9347e616-9901-46d5-9b3b-5df33daaf4eb/storefront/eb208775-8ffe-4b4e-b083-d2ad7caf51ea/banner-wood-v2.jpg",
    eyebrow: "Solid Wood Craftsmanship",
    title: "Seasoned Mango Wood Bowls, Trays & Furniture",
    description: "Sustainable mango and acacia wood turned and carved with organic natural oil and antique espresso finishes."
  }
];

export default function HomePage({ onInquire, onOpenAI, onCustomize }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products } = useProducts();

  // Auto rotate slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Exact Poly9 Hero Banner Slider */}
      <section className="relative overflow-hidden bg-zinc-950 text-white min-h-[580px] sm:min-h-[640px] flex items-center">
        {/* Background Images with Crossfade */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-7000"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-6">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-300 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              {HERO_SLIDES[currentSlide].eyebrow}
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-md">
              {HERO_SLIDES[currentSlide].title}
            </h1>

            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed max-w-xl drop-shadow">
              {HERO_SLIDES[currentSlide].description}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="px-6 py-3.5 bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl text-xs sm:text-sm font-bold transition shadow-xl flex items-center gap-2 group"
              >
                <span>Explore products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/categories"
                className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2"
              >
                <span>Shop categories</span>
              </Link>

              <button
                onClick={() => onCustomize(products[0])}
                className="px-5 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-xl"
              >
                <Wand2 className="w-4 h-4" />
                <span>AI Product Customizer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Slider Controls & Counter (Exact Poly9 01 — 04) */}
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-mono">
          <div className="flex gap-1.5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlide ? 'bg-amber-400 w-6' : 'bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <span className="text-zinc-300 font-semibold pl-2 border-l border-zinc-600">
            0{currentSlide + 1} — 0{HERO_SLIDES.length}
          </span>
        </div>
      </section>

      {/* 2. Interactive AI Customizer Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-zinc-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Interactive AI Studio Feature</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Customize Any Product Live — Your Finishes, Your Materials, Instant Renders.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
                Test custom finishes like <em>Antique Brass, Matte Black Iron, Verdigris Bronze, or Distressed Dark Walnut</em>. The product image dynamically updates in real-time, recalculates the FOB price, and instantly logs your custom Tech Pack to our factory admin desk.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onCustomize(products[0])}
                  className="px-5 py-3 bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl text-xs font-bold transition shadow-lg flex items-center gap-2"
                >
                  <Palette className="w-4 h-4 text-amber-600" />
                  <span>Try Customizing Sideboard</span>
                </button>
                <button
                  onClick={() => onCustomize(products[2])}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <span>Customize Planter</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="relative aspect-square w-48 sm:w-56 rounded-2xl overflow-hidden bg-white/10 p-2 border border-white/20 shadow-2xl backdrop-blur-sm">
                <img
                  src="https://images.poly9.ai/products/images/9347e616-9901-46d5-9b3b-5df33daaf4eb/renders/3e935d58-8027-40a0-8386-c136c57a198a/packshot.png"
                  alt="Customizer Preview"
                  className="w-full h-full object-cover rounded-xl"
                  style={{ filter: 'sepia(0.65) saturate(2.4) hue-rotate(-20deg) contrast(1.15)' }}
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-2 rounded-xl text-center text-[10px] font-bold text-amber-300">
                  Antique Brass Shader Applied
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category (Exact Poly9 layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="categories">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-zinc-200/80 pb-5">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-zinc-400">Find your favourites</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">Shop by category</h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Considered pieces for every corner of your home.
            </p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-zinc-900 hover:text-zinc-600 flex items-center gap-1.5 transition"
          >
            <span>Explore all categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoriesData.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-2xl p-4 border border-zinc-200/80 hover:border-zinc-300 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-50 mb-3 relative">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition">
                {cat.name}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{cat.description}</p>
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-700">{cat.count} products</span>
                <span className="text-zinc-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Pieces (Exact Poly9 layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-zinc-200/80 pb-5">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-zinc-400">The curated edit</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">Featured pieces</h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              A closer look at what’s in our collection.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-zinc-900 hover:text-zinc-600 flex items-center gap-1.5 transition"
          >
            <span>Shop the collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onInquire={onInquire}
              onCustomize={onCustomize}
            />
          ))}
        </div>
      </section>

      {/* 5. About SAG New Look (Exact Poly9 Copy & Structure) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-zinc-200/80 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Moradabad Export Legacy
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                About SAG New Look
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                SAG New Look is an export home décor manufacturer based in Moradabad, Uttar Pradesh, India. For over 15 years, we have specialized in handcrafted aluminium figurines, iron planters, wooden bowls, and glass candle holders, shipping directly to international importers, brand houses, and wholesale distributors in over 28 countries.
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-zinc-100">
                <div>
                  <span className="text-3xl font-extrabold text-zinc-900">664+</span>
                  <span className="block text-xs text-zinc-500 font-medium">Export Products Online</span>
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-zinc-900">FOB</span>
                  <span className="block text-xs text-zinc-500 font-medium">Mundra / JNPT Gateways</span>
                </div>
                <div>
                  <span className="text-3xl font-extrabold text-zinc-900">28+</span>
                  <span className="block text-xs text-zinc-500 font-medium">Global Markets Served</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 shadow-md border">
                <img
                  src="https://images.poly9.ai/companies/9347e616-9901-46d5-9b3b-5df33daaf4eb/storefront/eb208775-8ffe-4b4e-b083-d2ad7caf51ea/banner-wood-v2.jpg"
                  alt="Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Choose SAG New Look */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">B2B Advantages</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">Why choose SAG New Look?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Anchor className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Factory-Direct FOB Pricing</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Transparent FOB pricing direct from our Moradabad production facility to Mundra and Nhava Sheva (JNPT) container terminals without intermediary markups.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Bespoke Finishes & AI Studio</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Customize any product in real time with over 8 distinct surface finishes (Antique Brass, Verdigris Patina, Dark Walnut) and get immediate sample prototyping.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Consolidated Container Loads</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Flexible MOQs designed for full container assortments. Combine furniture, planters, candle holders, and vases in a single 20ft or 40ft HQ container.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
