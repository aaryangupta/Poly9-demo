import React, { createContext, useContext, useState, useEffect } from 'react';
import initialProducts from '../data/products.json';

const ProductContext = createContext();

const STORAGE_KEY = 'sag_catalog_products';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load products from localStorage", e);
    }
    return initialProducts;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn("Failed to persist products to localStorage", e);
    }
  }, [products]);

  // Bulk import multiple products from Excel / CSV
  const bulkImportProducts = (newItems, mode = 'append') => {
    setProducts(prevProducts => {
      // Normalize imported products
      const formattedItems = newItems.map((item, idx) => {
        const name = (item.name || item.Name || item['Product Name'] || `Custom Product ${idx + 1}`).trim();
        const sku = (item.sku || item.SKU || `SKU-${Date.now().toString(36)}-${idx}`).trim();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const category = (item.category || item.Category || 'Objects').trim();
        const priceUSD = parseFloat(item.priceUSD || item['Price USD'] || item.price || item.Price || 25.0);
        const priceINR = parseFloat(item.priceINR || item['Price INR'] || priceUSD * 83.2);

        return {
          id: item.id || `prod_imp_${Date.now()}_${idx}`,
          sku,
          name,
          slug: `${slug}-${sku.toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
          category: category.split(' › ').pop(),
          categoryFull: category,
          description: item.description || item.Description || `Handcrafted ${name} from Moradabad, India.`,
          material: item.material || item.Material || 'Aluminium',
          secondaryMaterial: item.secondaryMaterial || item['Secondary Material'] || '',
          finish: item.finish || item.Finish || 'Natural',
          color: item.color || item.Colour || item.Color || 'Metallic',
          priceINR,
          priceUSD,
          moq: parseInt(item.moq || item.MOQ) || 10,
          leadTimeDays: parseInt(item.leadTimeDays || item['Lead Time'] || item['Lead time (days)']) || 30,
          dimensions: {
            length: parseFloat(item.length || item.Length) || null,
            width: parseFloat(item.width || item.Width) || null,
            height: parseFloat(item.height || item.Height) || null,
            unit: item.dimensionUnit || item.unit || item['Dimension Unit'] || 'cm'
          },
          imageUrl: item.imageUrl || item['Image URL'] || item.image || item.Image || "https://images.poly9.ai/products/images/9347e616-9901-46d5-9b3b-5df33daaf4eb/renders/3e935d58-8027-40a0-8386-c136c57a198a/packshot.png",
          inStock: true,
          fobPort: item.fobPort || item['FOB Port'] || 'Mundra / Nhava Sheva (JNPT), India',
          origin: 'Moradabad, Uttar Pradesh, India',
          importedAt: new Date().toISOString()
        };
      });

      if (mode === 'overwrite') {
        return formattedItems;
      } else if (mode === 'merge') {
        // Update matching SKUs, append new ones
        const productMap = new Map(prevProducts.map(p => [p.sku.toLowerCase(), p]));
        formattedItems.forEach(item => {
          productMap.set(item.sku.toLowerCase(), { ...productMap.get(item.sku.toLowerCase()), ...item });
        });
        return Array.from(productMap.values());
      } else {
        // Default: append to the beginning so newly uploaded items appear first
        return [...formattedItems, ...prevProducts];
      }
    });
  };

  // Add a single product
  const addProduct = (productData) => {
    const sku = (productData.sku || `SKU-${Date.now().toString(36)}`).trim();
    const name = productData.name.trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProd = {
      id: `prod_${Date.now()}`,
      sku,
      name,
      slug: `${slug}-${sku.toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
      category: productData.category || 'Objects',
      categoryFull: productData.category || 'Objects',
      description: productData.description || `Handcrafted ${name} from Moradabad, India.`,
      material: productData.material || 'Aluminium',
      secondaryMaterial: productData.secondaryMaterial || '',
      finish: productData.finish || 'Natural',
      color: productData.color || 'Metallic',
      priceINR: parseFloat(productData.priceINR) || (parseFloat(productData.priceUSD) * 83.2) || 2000,
      priceUSD: parseFloat(productData.priceUSD) || 25.0,
      moq: parseInt(productData.moq) || 10,
      leadTimeDays: parseInt(productData.leadTimeDays) || 30,
      dimensions: {
        length: parseFloat(productData.length) || null,
        width: parseFloat(productData.width) || null,
        height: parseFloat(productData.height) || null,
        unit: productData.dimensionUnit || 'cm'
      },
      imageUrl: productData.imageUrl || "https://images.poly9.ai/products/images/9347e616-9901-46d5-9b3b-5df33daaf4eb/renders/3e935d58-8027-40a0-8386-c136c57a198a/packshot.png",
      inStock: true,
      fobPort: 'Mundra / Nhava Sheva (JNPT), India',
      origin: 'Moradabad, Uttar Pradesh, India',
      addedAt: new Date().toISOString()
    };

    setProducts(prev => [newProd, ...prev]);
    return newProd;
  };

  // Delete product
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Reset to original 664 products
  const resetToFactoryCatalog = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts(initialProducts);
  };

  return (
    <ProductContext.Provider value={{
      products,
      totalCount: products.length,
      bulkImportProducts,
      addProduct,
      deleteProduct,
      resetToFactoryCatalog
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
