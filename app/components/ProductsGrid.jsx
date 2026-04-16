'use client';

import ProductCard from './ProductCard';

export default function ProductsGrid({ products = [], onRequestQuote }) {
  // ✅ SAFETY CHECK
  if (!Array.isArray(products) || products.length === 0) {
    return <p className="text-center text-gray-500">No products available.</p>;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onRequestQuote={onRequestQuote}
        />
      ))}
    </section>
  );
}
