// app/admin-7f4b9c/products/ProductsClient.jsx
'use client';

import { useEffect, useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function ProductsClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const searchParams = useSearchParams();
  const toastMsg = searchParams.get('toast'); // read toast from query param

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (toastMsg) {
      setToast(toastMsg);
      setTimeout(() => setToast(''), 1500);
    }
  }, [toastMsg]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p._id !== id));
        setToast('✅ Product deleted successfully!');
        setTimeout(() => setToast(''), 1500);
      } else {
        setToast('❌ Failed to delete product');
        setTimeout(() => setToast(''), 1500);
      }
    } catch (err) {
      console.error(err);
      setToast('❌ Error deleting product');
      setTimeout(() => setToast(''), 1500);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-600">Manage Products</h1>
        <Link
          href="/admin-7f4b9c/products/add"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-xl shadow relative"
            >
              <Image
                src={product.image}
                alt={product.title}
                width={400}
                height={160}
                unoptimized
                className="h-40 w-full object-contain rounded mb-3"
              />
              <h2 className="font-semibold text-lg">{product.title}</h2>
              <p className="text-gray-500 text-sm mb-2">{product.subtitle}</p>

              <div className="flex gap-2 mt-2">
                <Link
                  href={`/admin-7f4b9c/products/edit/${product._id}`}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  <Edit2 size={14} /> Edit
                </Link>
                <button
                  onClick={() => setDeleteConfirm(product._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg animate-in slide-in-from-top">
          {toast}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
