'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AccessoriesList() {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // ID of accessory to delete
  const [toast, setToast] = useState('');

  // Fetch all accessories
  useEffect(() => {
    async function fetchAccessories() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/accessories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAccessories(data || []);
      } catch (err) {
        console.error('Failed to fetch accessories:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAccessories();
  }, []);

  // Delete accessory
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/accessories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAccessories(accessories.filter((a) => a._id !== id));
        setToast('✅ Accessory deleted successfully!');
        setTimeout(() => setToast(''), 1500);
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while deleting.');
    } finally {
      setDeleteId(null); // Close delete modal
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading accessories...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto relative">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Accessories</h1>

      <Link
        href="/admin-7f4b9c/accessories/add"
        className="text-white bg-green-600 px-4 py-2 rounded mb-4 inline-block"
      >
        + Add Accessory
      </Link>

      {accessories.length === 0 ? (
        <p className="text-gray-600 mt-4">No accessories found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {accessories.map((acc) => (
            <div
              key={acc._id}
              className="border p-4 rounded shadow flex flex-col items-center"
            >
              {/* Safe Image */}
              {acc.image ? (
                <Image
                  src={acc.image}
                  alt={acc.title}
                  width={300}
                  height={128}
                  unoptimized
                  className="w-full h-32 object-contain mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center mb-2 text-gray-400 text-sm">
                  No Image
                </div>
              )}

              <h2 className="font-bold text-center">{acc.title}</h2>
              <p className="text-green-600 font-semibold">${acc.price || 0}</p>

              <div className="flex gap-2 mt-2">
                <Link
                  href={`/admin-7f4b9c/accessories/edit/${acc._id}`}
                  className="text-blue-600 font-semibold"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteId(acc._id)}
                  className="text-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Centered Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 space-y-4">
            <h2 className="text-lg font-bold text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete this accessory?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg animate-in slide-in-from-top">
          {toast}
        </div>
      )}
    </div>
  );
}
