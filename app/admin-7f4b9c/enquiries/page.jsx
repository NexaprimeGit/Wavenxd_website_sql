'use client';

import { useEffect, useState } from 'react';
import EnquiryCard from './../../admin-7f4b9c/enquiries/EnquiryCard';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const res = await fetch('/api/admin/enquiry', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries);
        setSelected(data.enquiries[0]); // auto open first
      }

      setLoading(false);
    };

    fetchEnquiries();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading enquiries...</p>;
  }

  if (enquiries.length === 0) {
    return <p className="text-center mt-10">No enquiries found</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT – LIST */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <h2 className="px-4 py-3 font-semibold text-gray-700 border-b">
          Enquiries ({enquiries.length})
        </h2>

        <div className="max-h-[75vh] overflow-y-auto">
          {enquiries.map((e, i) => (
            <button
              key={e._id}
              onClick={() => setSelected(e)}
              className={`w-full text-left px-4 py-3 border-b hover:bg-green-50 transition
                ${selected?._id === e._id ? 'bg-green-100' : ''}`}
            >
              <p className="font-medium text-sm">
                Enquiry #{enquiries.length - i}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {e.organizationName || 'Organization'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT – DETAILS */}
      <div className="lg:col-span-2">
        {selected && (
          <EnquiryCard
            enquiry={selected}
            index={enquiries.indexOf(selected) + 1}
            onDelete={(id) =>
              setEnquiries((prev) => prev.filter((e) => e._id !== id))
            }
          />
        )}
      </div>
    </div>
  );
}
