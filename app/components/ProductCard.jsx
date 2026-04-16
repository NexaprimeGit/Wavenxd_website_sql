'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product, onRequestQuote }) {
  const router = useRouter();

  return (
    <div
      className="
        bg-white rounded-xl shadow-lg
        p-4 flex flex-col
        transition-all duration-300
        hover:shadow-2xl hover:-translate-y-2
        md:h-[520px]
      "
    >
      <Image
        src={product.image}
        alt={product.title}
        width={400}
        height={220}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />

      <h3 className="text-lg font-semibold mb-1">{product.title}</h3>

      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
        {product.description}
      </p>

      <div className="text-sm text-gray-700 space-y-1 mb-3">
        {product.specs?.slice(0, 3).map((item, i) => (
          <p key={i}>
            <strong>{item.label}:</strong> {item.value}
          </p>
        ))}
      </div>

      <div className="flex gap-3 mt-auto">
        <button
          onClick={() => onRequestQuote(product.title)}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Request Quote
        </button>

        <button
          onClick={() => router.push(`/products/${product.slug}`)}
          className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
        >
          View More
        </button>
      </div>
    </div>
  );
}
