'use client';

export default function EnquiryListItem({ enquiry, index, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border px-4 py-3 transition
        ${
          isActive
            ? 'bg-green-50 border-green-400'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Enquiry #{index}
          </p>
          <p className="text-xs text-gray-500">
            {enquiry.organizationName || 'Unknown Organization'}
          </p>
        </div>

        <span className="text-xs text-gray-400">{enquiry.spocName || '—'}</span>
      </div>
    </button>
  );
}
