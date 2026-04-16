'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AdminNavbar() {
  return (
    <div className="bg-white border-b shadow-sm w-full">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/admin-7f4b9c/dashboard">
            <Image src="/logo.png" alt="WaveNxD" width={180} height={80} />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-700">
          <Link href="/admin-7f4b9c/dashboard" className="hover:text-green-600">
            Dashboard
          </Link>

          <Link href="/admin-7f4b9c/enquiries" className="hover:text-green-600">
            Enquiries
          </Link>

          <Link href="/admin-7f4b9c/products" className="hover:text-green-600">
            Products
          </Link>

          <Link
            href="/admin-7f4b9c/accessories"
            className="hover:text-green-600"
          >
            Accessories
          </Link>

          <Link href="/admin-7f4b9c/careers" className="hover:text-green-600">
            Careers
          </Link>

          {/* ✅ CORRECT ENTRY POINT */}
          <Link
            href="/admin-7f4b9c/industries"
            className="hover:text-green-600"
          >
            Industries
          </Link>
        </div>
      </div>
    </div>
  );
}
