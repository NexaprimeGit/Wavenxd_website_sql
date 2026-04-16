'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function QuoteForm({
  products = [],
  defaultProduct = '',
  onClose,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: defaultProduct,
    quantity: '',
    details: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send form data to your API
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'Quote Modal', // Track the source
        }),
      });

      if (res.ok) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          product: defaultProduct,
          quantity: '',
          details: '',
        });
      } else {
        alert('Failed to send quote');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* BACKDROP */
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
      onClick={() => onClose?.()}
    >
      {/* MODAL */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={() => onClose?.()}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* HEADER */}
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/logo.png"
            alt="WaveNxD"
            width={140}
            height={50}
            className="mb-2"
          />
          <h2 className="text-2xl font-semibold">Request a Quote</h2>
        </div>

        {success && (
          <p className="text-green-600 text-center mb-3">
            Quote request sent successfully!
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name *"
            required
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address *"
            required
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* PRODUCT DROPDOWN */}
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Product *</option>
            {(products ?? []).map((p) => (
              <option key={p._id || p.slug} value={p.title}>
                {p.title}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity / Size"
            className="w-full border rounded-lg px-3 py-2"
          />

          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="Additional Details"
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? 'Sending...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
