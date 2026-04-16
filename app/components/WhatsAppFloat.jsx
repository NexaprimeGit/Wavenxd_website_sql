'use client';

export default function WhatsAppFloat() {
  const phoneNumber = '9561701860';
  const message = encodeURIComponent(
    'Hello WaveNxD Team, I would like to know more about your products.',
  );

  return (
    <a
      href={`https://wa.me/91${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[999] w-14 h-14 bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center transition transform hover:scale-110 animate-float-soft group"
    >
      {/* Tooltip */}
      <span className="absolute bottom-16 right-1/2 translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none">
        WhatsApp Now
      </span>

      {/* WhatsApp SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.97.52 3.89 1.52 5.6L2 22l4.64-1.6a9.86 9.86 0 0 0 5.4 1.58h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.73 14.27c-.24.67-1.37 1.27-1.93 1.36-.53.08-1.2.11-1.94-.12-.45-.14-1.02-.33-1.75-.64-3.08-1.33-5.08-4.43-5.24-4.63-.16-.2-1.25-1.67-1.25-3.19 0-1.52.79-2.27 1.07-2.58.28-.31.62-.39.83-.39.21 0 .41 0 .59.01.19.01.44-.07.69.53.24.59.82 2.03.89 2.18.07.14.12.31.02.51-.1.2-.15.31-.3.48-.15.17-.31.37-.44.49-.15.15-.31.31-.13.61.18.3.8 1.32 1.71 2.14 1.17 1.04 2.16 1.36 2.46 1.52.31.16.49.13.67-.08.18-.21.77-.89.98-1.2.2-.31.41-.25.69-.15.28.1 1.78.84 2.08.99.3.15.5.23.57.36.07.13.07.75-.17 1.42z" />
      </svg>
    </a>
  );
}
