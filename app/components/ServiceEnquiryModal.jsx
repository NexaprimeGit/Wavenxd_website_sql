"use client";

import { useState } from "react";

export default function ServiceEnquiryModal({ service, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = Object.fromEntries(new FormData(e.target));

    const res = await fetch("/api/services/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, service }),
    });

    setLoading(false);
    if (res.ok) setSuccess(true);
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="relative bg-white w-full max-w-sm rounded-xl shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold text-green-700">
              Enquiry – {service}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            {success ? (
              <div className="text-center py-6">
                <p className="text-green-600 text-base font-semibold">
                  Enquiry submitted successfully
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-3">

                <div className="input-group">
                  <input
                    className="input"
                    name="organizationName"
                    required
                    placeholder="Organization Name *"
                  />
                </div>

                <div className="input-group">
                  <input
                    className="input"
                    name="organizationWebsite"
                    placeholder="Organization Website (optional)"
                  />
                </div>

                <div className="input-group">
                  <input
                    className="input"
                    name="contactName"
                    required
                    placeholder="Your Name *"
                  />
                </div>

                <div className="input-group">
                  <input
                    className="input"
                    type="email"
                    name="contactEmail"
                    required
                    placeholder="Email Address *"
                  />
                </div>

                <div className="input-group">
                  <input
                    className="input"
                    name="contactPhone"
                    required
                    placeholder="Phone Number *"
                  />
                </div>

                <div className="input-group">
                  <textarea
                    className="input"
                    name="message"
                    rows={3}
                    required
                    placeholder="Briefly describe your requirement *"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg text-white font-medium text-sm transition"
                >
                  {loading ? "Sending..." : "Send Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
