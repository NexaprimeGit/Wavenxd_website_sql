'use client';

import { useState } from 'react';
import QuoteForm from './QuoteForm';

export default function RequestQuoteButton({ product }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
      >
        Request Quote
      </button>

      {open && (
        <QuoteForm
          products={[product]}
          defaultProduct={product.title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
