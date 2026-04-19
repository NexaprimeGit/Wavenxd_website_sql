'use client';

import { usePathname } from 'next/navigation';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import AdminNavbar from '@/app/components/admin/AdminNavbar';

export default function TopBar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin-7f4b9c');

  return (
    <>
      {/* TOP CONTACT BAR */}
      <div className="bg-green-600 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end items-center gap-6">
          <div className="flex items-center gap-1">
            <Phone size={14} />
            <span className="hidden sm:inline">+91 9881233102</span>
          </div>

          <a
            href="mailto:info@wavenxd.com"
            className="hidden sm:flex items-center gap-1 hover:underline"
          >
            <Mail size={14} />
            <span>Send Email</span>
          </a>

          <div className="hidden sm:flex items-center gap-1 hover:underline">
            <MessageCircle size={14} />
            <span>Send SMS</span>
          </div>
        </div>
      </div>

      {/* ✅ ADMIN NAVBAR (ONLY FOR ADMIN ROUTES) */}
      {isAdmin && <AdminNavbar />}
    </>
  );
}
