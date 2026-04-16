'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart, getCart } from '../lib/cart';
import { ShoppingCart } from 'lucide-react';

export default function AccessoriesClient({ accessories }) {
  const [cartIds, setCartIds] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart);
    setCartIds(cart.map((item) => item._id));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    const updatedCart = getCart();
    setCartIds(updatedCart.map((item) => item._id));
    setCartItems(updatedCart);
    setToast(`${product.title} added to cart!`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 relative">
      {/* HEADER with VIEW CART BUTTON */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl text-green-600 font-bold">
          Our Accessories
        </h2>

        {cartItems.length > 0 && (
          <button
            onClick={() => router.push('/accessories/cart')}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-700 transition font-medium"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View Cart ({cartItems.length})
          </button>
        )}
      </div>

      {/* TOAST MESSAGE */}
      {toast && (
        <div className="fixed top-20 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in z-50">
          {toast}{' '}
          <button
            onClick={() => router.push('/accessories/cart')}
            className="underline ml-2 hover:text-gray-200 font-medium"
          >
            View Cart
          </button>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {accessories.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
          >
            <div>
              <Image
                src={product.image}
                alt={product.title}
                width={300}
                height={220}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-700 text-sm mb-4">
                {product.description}
              </p>

              <p className="text-green-600 font-bold text-lg mb-4">
                ₹{product.price}
              </p>
            </div>

            <div className="flex gap-3 mt-auto">
              {/* BUY NOW – untouched */}
              <Link
                href={`/accessories/checkout/${product._id}`}
                className="flex-1 bg-green-600 text-white py-2 rounded-full text-center hover:bg-green-700 transition font-medium"
              >
                Buy Now
              </Link>

              {/* ADD TO CART / VIEW CART – modernized */}
              {cartIds.includes(product._id) ? (
                <button
                  onClick={() => router.push('/accessories/cart')}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-full hover:bg-gray-500 transition font-medium"
                >
                  Added to cart
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition font-medium"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
