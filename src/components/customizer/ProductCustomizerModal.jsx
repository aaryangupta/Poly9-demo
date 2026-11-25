import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Check, Wand2, Sliders, Layers, Send, CheckCircle2, RotateCcw, Download, Eye, ArrowRight, ShieldCheck, Palette } from 'lucide-react';
import { useCustomization } from '../../context/CustomizationContext';
import { useSelection } from '../../context/SelectionContext';
import { useCurrency } from '../../context/CurrencyContext';

const FINISH_PRESETS = [
  {
    id: 'antique-brass',
    name: 'Antique Brass',
    material: 'Aluminium / Cast Brass',
    colorCode: '#d4af37',
    swatchGradient: 'from-amber-600 via-yellow-400 to-amber-700',
    priceMultiplier: 1.12,
    description: 'Warm hand-rubbed antique gold-brass with natural micro-luster.',
    filterStyle: 'sepia(0.65) saturate(2.4) hue-rotate(-20deg) contrast(1.15) brightness(1.05)',
    overlayClass: 'bg-gradient-to-tr from-amber-900/30 via-amber-500/20 to-yellow-200/20 mix-blend-color-burn'
  },
  {
    id: 'matte-black',
    name: 'Matte Black Iron',
    material: 'Cast Iron / Powder Coat',
    colorCode: '#1e1e24',
    swatchGradient: 'from-zinc-900 via-zinc-800 to-black',
    priceMultiplier: 1.05,
    description: 'Ultra-matte industrial textured charcoal black with rust-proof seal.',
    filterStyle: 'grayscale(1) contrast(1.4) brightness(0.68)',
    overlayClass: 'bg-zinc-950/25 mix-blend-multiply'
  },
  {
    id: 'polished-aluminium',
    name: 'Polished Aluminium',
    material: 'Aircraft Aluminium',
    colorCode: '#e0e0e0',
    swatchGradient: 'from-zinc-200 via-white to-zinc-400',
    priceMultiplier: 1.08,
    description: 'Mirror-polished brilliant silver chrome with high specular highlights.',
    filterStyle: 'grayscale(0.85) contrast(1.3) brightness(1.22)',
    overlayClass: 'bg-gradient-to-t from-slate-400/20 via-white/30 to-blue-200/20 mix-blend-screen'
  },
  {
    id: 'natural-mango',
    name: 'Natural Mango Wood',
    material: 'Seasoned Mango Wood',
    colorCode: '#c19a6b',
    swatchGradient: 'from-amber-700 via-amber-500 to-amber-800',
    priceMultiplier: 1.00,
    description: 'Organic warm grain wood with organic natural linseed oil finish.',
    filterStyle: 'sepia(0.4) saturate(1.4) contrast(1.05) brightness(1.02)',
    overlayClass: 'bg-amber-800/15 mix-blend-color'
  },
  {
    id: 'distressed-walnut',
    name: 'Distressed Dark Walnut',
    material: 'Mango / Acacia Wood',
    colorCode: '#4a2c11',
    swatchGradient: 'from-stone-900 via-amber-950 to-stone-800',
    priceMultiplier: 1.15,
    description: 'Deep artisanal espresso stain with hand-distressed wirebrushed grain.',
    filterStyle: 'sepia(0.7) saturate(1.2) contrast(1.35) brightness(0.75)',
    overlayClass: 'bg-gradient-to-b from-amber-950/40 to-stone-900/40 mix-blend-multiply'
  },
  {
    id: 'verdigris-patina',
    name: 'Verdigris Patina Bronze',
    material: 'Aged Bronze / Copper',
    colorCode: '#2e8b57',
    swatchGradient: 'from-emerald-800 via-teal-600 to-cyan-900',
    priceMultiplier: 1.18,
    description: 'Artisanal turquoise-green aged copper patina with dark bronze accents.',
    filterStyle: 'hue-rotate(95deg) saturate(1.8) contrast(1.2) brightness(0.92)',
    overlayClass: 'bg-teal-900/25 mix-blend-color'
  },
  {
    id: 'hammered-copper',
    name: 'Hammered Copper',
    material: 'Pure Hand-hammered Copper',
    colorCode: '#b87333',
    swatchGradient: 'from-rose-800 via-orange-600 to-amber-800',
    priceMultiplier: 1.20,
    description: 'Hand-hammered indentations with shimmering rose-gold copper luster.',
    filterStyle: 'sepia(0.8) hue-rotate(-35deg) saturate(2.6) contrast(1.2) brightness(1.04)',
    overlayClass: 'bg-rose-900/25 mix-blend-color-burn'
  },
  {
    id: 'chalk-white',
    name: 'Matte Chalk White',
    material: 'Powder Coated Metal',
    colorCode: '#f4f4f5',
    swatchGradient: 'from-zinc-100 via-white to-zinc-200',
    priceMultiplier: 1.04,
    description: 'Contemporary minimalist chalky textured matte ceramic white.',
    filterStyle: 'grayscale(0.9) contrast(1.1) brightness(1.35)',
    overlayClass: 'bg-white/30 mix-blend-soft-light'
  }
];

const ACCENT_OPTIONS = [
  'Standard Factory Accents',
  'Satin Brushed Brass Hardware',
  'Industrial Matte Black Hardware',
  'Antique Pewter Metal Accents',
  'Natural Rattan / Cane Detail'
];

const SIZE_OPTIONS = [
  { id: 'standard', label: 'Standard Catalog Size', modifier: 1.0 },
  { id: 'large', label: 'Oversized (+20% Scale)', modifier: 1.18 },
  { id: 'compact', label: 'Compact Edition (-15% Scale)', modifier: 0.92 },
  { id: 'custom', label: 'Custom Architectural Dimensions', modifier: 1.15 }
];

export default function ProductCustomizerModal({ product, onClose, onFinishCustomization }) {
  const { saveCustomization } = useCustomization();
  const { addToSelection } = useSelection();
  const { formatPrice } = useCurrency();

  const [selectedFinish, setSelectedFinish] = useState(FINISH_PRESETS[0]);
  const [selectedAccent, setSelectedAccent] = useState(ACCENT_OPTIONS[1]);
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
  const [customDimensions, setCustomDimensions] = useState({
    width: product.dimensions?.width || 80,
    height: product.dimensions?.height || 50,
    length: product.dimensions?.length || 40,
    unit: product.dimensions?.unit || 'cm'
  });
  const [customPrompt, setCustomPrompt] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [comparePosition, setComparePosition] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedSpecId, setGeneratedSpecId] = useState('');

  // Buyer Form details
  const [buyerData, setBuyerData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    quantity: product.moq ? Math.max(product.moq, 50) : 100,
    deliveryDate: 'Spring / Summer 2027',
    notes: ''
  });

  // Calculate dynamic custom FOB price
  const basePrice = product.priceUSD || 50;
  const finishMultiplier = selectedFinish.priceMultiplier || 1.0;
  const sizeMultiplier = selectedSize.modifier || 1.0;
  const estimatedCustomPrice = Math.round(basePrice * finishMultiplier * sizeMultiplier * 100) / 100;

  // Trigger AI studio render simulation
  const handleGenerateRender = () => {
    setIsGenerating(true);
    setGenerationStage('Extracting CAD mesh & geometry…');

    setTimeout(() => {
      setGenerationStage(`Applying ${selectedFinish.name} PBR material shader…`);
    }, 600);

    setTimeout(() => {
      setGenerationStage(`Simulating specular lighting & ${selectedAccent}…`);
    }, 1300);

    setTimeout(() => {
      setGenerationStage('Baking ambient occlusion & final 4K packshot…');
    }, 2000);

    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 2600);
  };

  const handleSaveAndSubmit = (e) => {
    e.preventDefault();
    if (!buyerData.name || !buyerData.email) return;

    const customEntry = saveCustomization({
      baseSku: product.sku,
      productName: product.name,
      buyerName: buyerData.name,
      buyerEmail: buyerData.email,
      company: buyerData.company,
      country: buyerData.country,
      material: selectedFinish.material,
      finish: selectedFinish.name,
      accent: selectedAccent,
      color: selectedFinish.name,
      dimensions: selectedSize.id === 'custom' 
        ? `W ${customDimensions.width} × H ${customDimensions.height} × L ${customDimensions.length} ${customDimensions.unit}`
        : `${selectedSize.label} (${product.dimensions ? `W ${product.dimensions.width || ''} × H ${product.dimensions.height || ''} ${product.dimensions.unit || 'cm'}` : 'Standard'})`,
      notes: buyerData.notes,
      aiPrompt: customPrompt || `Customized ${selectedFinish.name} with ${selectedAccent}`,
      estimatedFobUsd: estimatedCustomPrice,
      quantity: Number(buyerData.quantity),
      customImageUrl: product.imageUrl
    });

    setGeneratedSpecId(customEntry.id);
    setSubmitted(true);

    // Also add to buyer selection with customized tag
    addToSelection({
      ...product,
      id: `${product.id}-${customEntry.id}`,
      name: `${product.name} (${selectedFinish.name} Edition)`,
      sku: `${product.sku}-CUST`,
      priceUSD: estimatedCustomPrice,
      customSpec: customEntry
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col border border-zinc-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-900 rounded-[10px] flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">SAG AI Product Customizer & Studio</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Live Preview
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Customizing: <strong className="text-zinc-200">{product.name}</strong> (SKU: {product.sku})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="p-8 sm:p-12 text-center space-y-6 my-auto max-w-lg mx-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                Spec Sheet Generated & Transmitted
              </span>
              <h2 className="text-2xl font-extrabold text-zinc-900">
                Custom Design Logged!
              </h2>
              <div className="p-3 bg-zinc-100 rounded-xl font-mono text-xs font-bold text-zinc-800 border">
                Design Reference ID: <span className="text-blue-600">{generatedSpecId}</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed pt-2">
                Your customized design (<strong>{selectedFinish.name}</strong> on <strong>{product.name}</strong>) has been instantly synchronized with SAG New Look's Moradabad engineering desk and logged into the Admin Panel.
              </p>
            </div>

            <div className="bg-zinc-50 p-4 rounded-2xl border text-left text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-500">
                <span>Custom Finish:</span>
                <span className="font-semibold text-zinc-900">{selectedFinish.name}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Hardware Accents:</span>
                <span className="font-semibold text-zinc-900">{selectedAccent}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Target Quantity:</span>
                <span className="font-semibold text-zinc-900">{buyerData.quantity} pcs</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Estimated FOB:</span>
                <span className="font-bold text-zinc-900">{formatPrice(estimatedCustomPrice)} / pc</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition shadow-md"
              >
                Back to Showroom
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
            
            {/* Left 7 Cols: Dynamic Interactive Product Image Builder */}
            <div className="lg:col-span-7 p-6 bg-zinc-100/70 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
              
              {/* Image Preview Container */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-lg border border-zinc-200/80 flex items-center justify-center">
                
                {/* Base Product Image with Active Custom Filter Shader */}
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ filter: selectedFinish.filterStyle }}
                    className="w-full h-full object-cover transition-all duration-700 ease-out"
                  />
                  
                  {/* Subtle Texture/Specular Lighting Overlay based on Finish */}
                  <div
                    className={`absolute inset-0 pointer-events-none transition-all duration-700 ${selectedFinish.overlayClass}`}
                  />

                  {/* Split Comparison Slider (if active) */}
                  {showComparison && (
                    <div
                      className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl transition-all"
                      style={{ width: `${comparePosition}%` }}
                    >
                      <img
                        src={product.imageUrl}
                        alt="Original"
                        className="w-full h-full object-cover max-w-none"
                        style={{ width: '100%', height: '100%' }}
                      />
                      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                        Original Catalog Look
                      </span>
                    </div>
                  )}

                  {/* AI Generating Scanning Animation Overlay */}
                  {isGenerating && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center space-y-3 animate-in fade-in">
                      <div className="relative w-16 h-16">
                        <div className="w-16 h-16 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
                        <Sparkles className="w-6 h-6 text-amber-300 absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold tracking-wide uppercase text-amber-300">Poly9 AI Studio</p>
                        <p className="text-sm font-semibold">{generationStage}</p>
                      </div>
                    </div>
                  )}

                  {/* Current Active Finish Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: selectedFinish.colorCode }}
                    ></span>
                    <span className="text-xs font-bold text-zinc-900">{selectedFinish.name}</span>
                    <span className="text-[10px] text-zinc-400 font-medium">({selectedFinish.material})</span>
                  </div>
                </div>

                {/* Compare Slider Control (when active) */}
                {showComparison && (
                  <div className="absolute bottom-14 inset-x-6 z-20">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={comparePosition}
                      onChange={(e) => setComparePosition(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-ew-resize"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-white drop-shadow">
                      <span>◀ Original</span>
                      <span>Customized Finish ▶</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Action Toolbar */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
                      showComparison 
                        ? 'bg-zinc-900 text-white border-zinc-900' 
                        : 'bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-300'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{showComparison ? 'Exit Split View' : 'Compare Original vs Custom'}</span>
                  </button>

                  <button
                    onClick={handleGenerateRender}
                    disabled={isGenerating}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{isGenerating ? 'Rendering…' : 'Generate 4K AI Render'}</span>
                  </button>
                </div>

                {/* Dynamic Price Box */}
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Estimated Custom FOB</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-zinc-900">{formatPrice(estimatedCustomPrice)}</span>
                    <span className="text-[10px] text-zinc-400">/ pc FOB Mundra</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Customization Controls & Inquiry Form */}
            <div className="lg:col-span-5 p-5 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar max-h-[82vh]">
              
              {/* 1. Material & Finish Selector */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-zinc-600" />
                    <span>1. Select Custom Finish & Material</span>
                  </label>
                  <span className="text-[11px] font-semibold text-amber-700">{selectedFinish.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {FINISH_PRESETS.map((f) => {
                    const isSelected = selectedFinish.id === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFinish(f)}
                        className={`p-2.5 rounded-xl text-left border transition flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-zinc-900 text-white border-zinc-900 ring-2 ring-zinc-900/20 shadow-md'
                            : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-200'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex-shrink-0 bg-gradient-to-tr ${f.swatchGradient} border-2 ${
                            isSelected ? 'border-white' : 'border-zinc-300'
                          } shadow-sm`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate">{f.name}</p>
                          <p className={`text-[10px] truncate ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                            {f.material}
                          </p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-zinc-500 italic">{selectedFinish.description}</p>
              </div>

              {/* 2. Secondary Accents & Hardware */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                  2. Secondary Accents & Hardware
                </label>
                <select
                  value={selectedAccent}
                  onChange={(e) => setSelectedAccent(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 font-medium"
                >
                  {ACCENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 3. Scale & Custom Dimensions */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                  3. Size & Scale
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SIZE_OPTIONS.map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`p-2 rounded-xl text-left border text-xs font-semibold transition ${
                        selectedSize.id === sz.id
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>

                {selectedSize.id === 'custom' && (
                  <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-medium block">Width (cm)</span>
                      <input
                        type="number"
                        value={customDimensions.width}
                        onChange={(e) => setCustomDimensions({ ...customDimensions, width: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-medium block">Height (cm)</span>
                      <input
                        type="number"
                        value={customDimensions.height}
                        onChange={(e) => setCustomDimensions({ ...customDimensions, height: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-medium block">Length (cm)</span>
                      <input
                        type="number"
                        value={customDimensions.length}
                        onChange={(e) => setCustomDimensions({ ...customDimensions, length: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. AI Design Brief & Prompt */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center justify-between">
                  <span>4. Custom Tooling / Tech Pack Instructions</span>
                  <span className="text-[10px] text-zinc-400 font-normal">Optional</span>
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Add subtle brushed brass corner brackets and custom debossed buyer logo on base..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              {/* 5. Buyer Contact & Transmission Form */}
              <form onSubmit={handleSaveAndSubmit} className="pt-3 border-t border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    5. Transmit Spec to Factory Desk
                  </h4>
                  <span className="text-[10px] text-emerald-600 font-bold">● Direct Sync with Admin</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Buyer Full Name *"
                    value={buyerData.name}
                    onChange={(e) => setBuyerData({ ...buyerData, name: e.target.value })}
                    className="w-full text-xs p-2 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email *"
                    value={buyerData.email}
                    onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                    className="w-full text-xs p-2 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Company / Importer Name"
                    value={buyerData.company}
                    onChange={(e) => setBuyerData({ ...buyerData, company: e.target.value })}
                    className="w-full text-xs p-2 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Destination Country *"
                    value={buyerData.country}
                    onChange={(e) => setBuyerData({ ...buyerData, country: e.target.value })}
                    className="w-full text-xs p-2 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-medium block mb-1">Target Order Qty (pcs)</span>
                    <input
                      type="number"
                      min="1"
                      value={buyerData.quantity}
                      onChange={(e) => setBuyerData({ ...buyerData, quantity: e.target.value })}
                      className="w-full text-xs p-2 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-medium block mb-1">Target Season / Shipment</span>
                    <input
                      type="text"
                      value={buyerData.deliveryDate}
                      onChange={(e) => setBuyerData({ ...buyerData, deliveryDate: e.target.value })}
                      className="w-full text-xs p-2 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 group"
                >
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>Transmit Custom Spec & Request FOB Quote</span>
                </button>
                <p className="text-[10px] text-zinc-400 text-center">
                  Instant logging to Moradabad export factory admin panel. Response within 24h.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
