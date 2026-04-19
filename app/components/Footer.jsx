import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaFacebook, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer
      className="relative text-gray-800 mt-20"
      style={{
        background:
          'linear-gradient(135deg, #f5f5f5 0%, #eaeaea 50%, #f9f9f9 100%)',
      }}
    >
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {/* COMPANY INFO */}
        <div className="flex flex-col">
          <Image
            src="/logo.png"
            alt="WaveNxD"
            width={140}
            height={50}
            className="mx-auto sm:mx-0"
          />
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-gray-700">
            WaveNxD Technologies delivers advanced ultrasonic spray solutions
            designed for precision, efficiency, and industrial excellence.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-gray-900 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2 text-xs sm:text-sm">
            <li className="hidden sm:block">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <li className="hidden sm:block">
              <Link href="/about" className="hover:text-gray-900">
                About Us
              </Link>
            </li>
            <li className="hidden sm:block">
              <Link href="/products" className="hover:text-gray-900">
                Products
              </Link>
            </li>
            <li className="hidden sm:block">
              <Link href="/contact" className="hover:text-gray-900">
                Contact Us
              </Link>
            </li>
            <li className="hidden sm:block">
              <Link href="/careers" className="hover:text-gray-900">
                Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* SOCIAL MEDIA (VERTICAL) */}
        <div>
          <h4 className="text-gray-900 font-semibold mb-3 text-sm sm:text-base">
            Follow Us
          </h4>
          <ul className="flex flex-col gap-3 text-xs sm:text-sm">
            <li className="flex items-center gap-2">
              <FaInstagram size={20} className="text-pink-500" />
              <Link
                href="https://www.instagram.com/wavenxd_technologies/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-600 transition"
              >
                Instagram
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <FaYoutube size={20} className="text-red-600" />
              <Link
                href="https://www.youtube.com/@wavenxd/featured"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-700 transition"
              >
                YouTube
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <FaFacebook size={20} className="text-blue-600" />
              <Link
                href="https://www.facebook.com/people/WaveNxd-Technologies/61558205443164/#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700 transition"
              >
                Facebook
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <FaLinkedin size={20} className="text-blue-700" />
              <Link
                href="https://www.linkedin.com/company/wavenxd-technologies-private-limited/?originalSubdomain=in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-800 transition"
              >
                LinkedIn
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-gray-900 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
            Contact Us
          </h4>
          <ul className="flex flex-col gap-2 text-xs sm:text-sm text-gray-700">
            <li>📍 Kolhapur, Maharashtra, India</li>
            <li>📞 +91 9881233102</li>
            <li>✉️ info@wavenxd.com</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        className="text-center py-2 sm:py-3 text-xs sm:text-sm border-t border-gray-300"
        style={{
          background: 'linear-gradient(135deg, #eaeaea 0%, #f5f5f5 100%)',
        }}
      >
        © {new Date().getFullYear()} WaveNxD Technologies. All rights reserved.
      </div>
    </footer>
  );
}
