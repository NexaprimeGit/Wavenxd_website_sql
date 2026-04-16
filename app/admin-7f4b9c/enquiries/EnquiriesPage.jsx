'use client';

import { useEffect, useState } from 'react';
import EnquiryCard from './EnquiryCard';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    try {
      const res = await fetch('/api/enquiry');
      const data = await res.json();
      setEnquiries(data.enquiries || []);
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      setLoading(false);
    }
  }

  // Remove deleted enquiry from state
  const handleDelete = (id) => {
    setEnquiries((prev) => prev.filter((e) => e._id !== id));
    setSelectedEnquiry(null);
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading enquiries...</p>
    );
  }

  /* ================= DETAILS VIEW ================= */
  if (selectedEnquiry) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <button
          onClick={() => setSelectedEnquiry(null)}
          className="text-sm text-green-700 hover:underline"
        >
          ← Back to enquiries
        </button>

        <EnquiryCard
          enquiry={selectedEnquiry}
          index={enquiries.findIndex((e) => e._id === selectedEnquiry._id) + 1}
          onDelete={handleDelete}
        />
      </div>
    );
  }

  /* ================= LIST VIEW ================= */
  if (!enquiries.length) {
    return (
      <p className="text-center mt-10 text-gray-600">No enquiries found.</p>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Enquiries ({enquiries.length})
      </h1>

      <div className="space-y-3">
        {enquiries.map((enquiry, index) => (
          <div
            key={enquiry._id}
            onClick={() => setSelectedEnquiry(enquiry)}
            className="cursor-pointer bg-white border border-gray-200 rounded-xl px-5 py-4
                       hover:border-green-500 hover:shadow-sm transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Enquiry #{index + 1}</p>

                <h2 className="font-semibold text-gray-800">
                  {enquiry.organizationName || 'Unnamed Organization'}
                </h2>

                <p className="text-sm text-gray-600">
                  {enquiry.spocName} · {enquiry.spocEmail}
                </p>
              </div>

              <span className="text-xs text-gray-400">
                {new Date(enquiry.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
