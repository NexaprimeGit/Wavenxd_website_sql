'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CareersList() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null); // 🔴 NEW

  useEffect(() => {
    async function fetchCareers() {
      try {
        const res = await fetch('/api/admin/careers');
        const data = await res.json();
        setCareers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, []);

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/admin/careers/${deleteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setCareers(careers.filter((c) => c._id !== deleteId));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading careers...</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Careers</h1>

      <Link
        href="/admin-7f4b9c/careers/add"
        className="text-white bg-green-600 px-4 py-2 rounded mb-4 inline-block"
      >
        + Add Career
      </Link>

      {careers.length === 0 ? (
        <p>No careers found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {careers.map((career) => (
            <div key={career._id} className="border p-4 rounded shadow">
              <h2 className="font-bold text-lg">{career.title}</h2>
              <p className="text-gray-600">{career.location}</p>
              <p className="text-sm">
                {career.type} | {career.isOpen ? 'Open' : 'Closed'}
              </p>

              <div className="flex gap-3 mt-3">
                <Link
                  href={`/admin-7f4b9c/careers/edit/${career._id}`}
                  className="text-blue-600 font-semibold"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteId(career._id)}
                  className="text-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleteId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl
                       w-[360px] max-w-[90%]
                       p-6 animate-in zoom-in duration-200"
          >
            <h2 className="text-lg font-semibold text-center text-gray-800">
              Delete Career?
            </h2>

            <p className="text-sm text-gray-600 text-center mt-3">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border
                           text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg
                           bg-red-600 text-white hover:bg-red-700 transition"
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
