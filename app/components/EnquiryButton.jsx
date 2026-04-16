'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import EnquiryModal from './EnquiryModal';

export default function EnquiryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Quick Enquiry"
        className="fixed bottom-6 right-24 z-[999] w-14 h-14 bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center transition transform hover:scale-110 hover:bg-green-700 animate-float-soft group"
      >
        {/* Tooltip */}
        <span className="absolute bottom-16 right-1/2 translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none">
          Enquire Now
        </span>

        <FileText size={24} />
      </button>

      {open && <EnquiryModal onClose={() => setOpen(false)} />}
    </>
  );
}
