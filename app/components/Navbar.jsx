'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimeout = useRef(null);

  if (pathname.startsWith('/admin-7f4b9c')) return null;

  const handleDropdownEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  return (
    <nav className="relative z-50 border-b border-gray-200 bg-gradient-to-br from-slate-100 via-white to-white">
      <div className="flex items-center justify-between px-4 md:px-10 py-4">
        {/* Logo */}
        <Image src="/logo.png" alt="WaveNxD" width={190} height={110} />

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-base font-medium items-center">
          <li>
            <Link href="/">Home</Link>
          </li>
          {/* Products Dropdown */}
          <li
            className="relative"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-green-600 transition">
              Products
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  dropdownOpen ? 'rotate-180 text-green-600' : ''
                }`}
              />
            </div>

            {dropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-44 bg-white rounded-md shadow-md border border-gray-100 py-1 flex flex-col gap-1 transition-all duration-200">
                <Link
                  href="/products"
                  className="block px-4 py-1 text-gray-700 font-medium rounded hover:bg-green-50 hover:shadow-sm transition"
                >
                  Products
                </Link>
                <Link
                  href="/accessories"
                  className="block px-4 py-1 text-gray-700 font-medium rounded hover:bg-green-50 hover:shadow-sm transition"
                >
                  Accessories
                </Link>
              </div>
            )}
          </li>

          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/industries">Industries</Link>
          </li>
          <li>
            <Link href="/about">About us</Link>
          </li>
          <li>
            <Link href="/contact">Contact us</Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-6 py-6">
          <nav className="flex flex-col gap-4 text-lg font-medium">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/products" onClick={() => setOpen(false)}>
              Products
            </Link>
            <Link href="/accessories" onClick={() => setOpen(false)}>
              Accessories
            </Link>
            <Link href="/services" onClick={() => setOpen(false)}>
              Services
            </Link>
            <Link href="/industries" onClick={() => setOpen(false)}>
              Industries
            </Link>
            <Link href="/about" onClick={() => setOpen(false)}>
              About Us
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)}>
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </nav>
  );
}
