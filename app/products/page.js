'use client';

import { useState, useEffect } from 'react';
import ProductsGrid from './../components/ProductsGrid';
import QuoteForm from './../components/QuoteForm';
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showQuote, setShowQuote] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');

  // ✅ FETCH PRODUCTS ON CLIENT
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to load products', err);
        setProducts([]);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="p-6">
      {/* TITLE RESTORED */}
      <h1 className="text-3xl md:text-4xl mb-8 text-green-600 font-bold text-center">
        Our Products
      </h1>

      <ProductsGrid
        products={products}
        onRequestQuote={(title) => {
          setSelectedProduct(title);
          setShowQuote(true);
        }}
      />

      {showQuote && (
        <QuoteForm
          products={products}
          defaultProduct={selectedProduct}
          onClose={() => setShowQuote(false)}
        />
      )}
    </main>
  );
}
