import { Suspense } from 'react';
import ProductsClient from './ProductsClient';

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={<p className="text-center mt-10">Loading products...</p>}
    >
      <ProductsClient />
    </Suspense>
  );
}