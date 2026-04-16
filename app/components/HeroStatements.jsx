'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const statements = [
  'The Pioneer of Ultrasonic Spray Nozzle in India',
  'Largest Range of Ultrasonic Nozzle Industries',
  'Custom-Specific Ultrasonic Design & Standards',
];

export default function PartnersAndHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % statements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative border-b border-gray-200/60"
      style={{
        background:
          'linear-gradient(135deg, #eef2f7 0%, #f8fafc 45%, #ffffff 100%)',
      }}
    >
      {/* ================= MOBILE ONLY ================= */}
      <div className="md:hidden px-4 py-3">
        <div className="flex items-center justify-between">
          <Image
            src="/partners/scitech.png"
            alt="Science and Technology Park"
            width={90}
            height={30}
            className="object-contain"
          />

          <Image
            src="/partners/dst.jpg"
            alt="Department of Science and Technology"
            width={80}
            height={30}
            className="object-contain"
          />

          <Image
            src="/partners/dpit.jpeg"
            alt="Department of Science and Technology"
            width={80}
            height={30}
            className="object-contain"
          />
        </div>
      </div>

      {/* ================= DESKTOP ONLY (ORIGINAL CODE) ================= */}
      <div className="hidden md:flex items-center justify-between px-10 py-4">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            Supported by:
          </span>

          <Image
            src="/partners/scitech.png"
            alt="Science and Technology Park"
            width={200}
            height={40}
            className="object-contain"
          />

          <Image
            src="/partners/dst.jpg"
            alt="Department of Science and Technology"
            width={150}
            height={40}
            className="object-contain"
          />

          <Image
            src="/partners/dpit.jpeg"
            alt="Department of Science and Technology"
            width={150}
            height={40}
            className="object-contain"
          />
        </div>

        {/* RIGHT */}
        <div className="min-w-[480px]">
          <div className="relative rounded-xl border border-green-100 bg-white/70 backdrop-blur-md px-6 py-4 shadow-sm animate-fade-slide">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-green-500 to-emerald-400 rounded-l-xl" />
            <p className="pl-3 text-lg md:text-xl font-semibold text-green-900 leading-snug">
              {statements[index]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
