'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function EnquiryCard({ enquiry, index, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ✅ ADDED (success popup state)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('Unauthorized. Please login again.');
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/enquiry/${enquiry._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert('Failed to delete enquiry');
        return;
      }

      onDelete(enquiry._id);
      setShowDeleteModal(false);

      // ✅ ADDED (show success popup)
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 1500);
    } catch (err) {
      console.error(err);
      alert('Error deleting enquiry');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* ================= ENQUIRY CARD ================= */}
      <div className="relative bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
        {/* Delete Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          title="Delete Enquiry"
          className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition"
        >
          <Trash2 size={20} />
        </button>

        {/* Header */}
        <h2 className="text-sm font-semibold text-white bg-green-600 rounded-full px-4 py-1 w-fit mx-auto">
          Enquiry #{index}
        </h2>

        <Section
          title="General Information"
          data={{
            'Organization Name': enquiry.organizationName,
            Website: enquiry.organizationWebsite,
            'GST Number': enquiry.gstNumber,
            Address: enquiry.address,
            'Organization Type': enquiry.organizationType,
            'Quotation Number': enquiry.quotationNumber,
            'SPOC Name': enquiry.spocName,
            'SPOC Email': enquiry.spocEmail,
            'SPOC Phone': enquiry.spocPhone,
          }}
        />

        <Section
          title="Application Information"
          data={{
            Purpose: enquiry.purpose,
            'Nozzle Frequency': enquiry.nozzleFrequency,
            'Nozzle Tip': enquiry.nozzleTip,
            'Flow Rate': enquiry.flowRate,
            Viscosity: enquiry.viscosity,
            Solvent: enquiry.solvent,
            Solute: enquiry.solute,
            'Solution %': enquiry.solutionPercentage,
            'Suspended Particles': enquiry.suspendedParticles,
            'Particle Size': enquiry.particleSize,
            'Application Nature': enquiry.applicationNature,
            'Substrate Type': enquiry.substrateType,
            'Operating Temp': enquiry.operatingTemperature,
            'Storage Temp': enquiry.storageTemperature,
            'Air Shaping Required': enquiry.airShapingRequired,
          }}
        />

        <Section
          title="Desired Outcome"
          data={{
            'Avg Particle Size': enquiry.avgParticleSize,
            'Particle Yield': enquiry.particleYield,
            'Coating Thickness': enquiry.coatingThickness,
            'Coating Uniformity': enquiry.coatingUniformity,
            'Coat Adherence': enquiry.coatAdherence,
          }}
        />

        <Section
          title="Additional Notes"
          data={{
            'Support Required': enquiry.supportRequired,
          }}
        />

        <p className="text-center text-xs text-gray-500 pt-2">
          Enquiry submitted successfully
        </p>
      </div>

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl w-[360px] max-w-[90%] p-6 animate-in fade-in zoom-in duration-200"
          >
            <h2 className="text-lg font-semibold text-center text-gray-800 mb-3">
              Delete Enquiry?
            </h2>

            <p className="text-sm text-gray-600 text-center mb-6">
              This enquiry will be permanently deleted.
              <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUCCESS POPUP (ONLY ADDITION) ================= */}
      {showSuccessMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white px-6 py-4 rounded-xl shadow-xl text-center animate-in fade-in zoom-in">
            <p className="text-green-600 font-semibold text-sm">
              Enquiry deleted successfully
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Section({ title, data }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([label, value]) => (
          <Field key={label} label={label} value={value || '-'} />
        ))}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">{value}</div>
    </div>
  );
}
