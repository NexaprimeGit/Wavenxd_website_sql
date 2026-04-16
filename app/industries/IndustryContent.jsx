'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function IndustryContent({ content }) {
  if (!content) {
    return (
      <div className="text-gray-500 text-center py-10 text-md">
        Select an application to view details.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Image Section */}
        <div className="w-full md:w-1/3 flex justify-center items-start">
          {content.image && (
            <div className="relative w-full h-60 md:h-72 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={content.image}
                alt={content.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-2/3 flex flex-col gap-4 md:gap-6">
          {/* 🔄 MOVING AD STRIP (ABOVE TITLE) */}
          <Link
            href="/products"
            className="relative w-full h-11 overflow-hidden rounded-full cursor-pointer
             bg-gradient-to-r from-green-50 via-white to-green-50
             border border-green-200
             shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Edge Fade */}
            <div className="pointer-events-none absolute inset-0 z-10">
              <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-green-50 to-transparent" />
              <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-green-50 to-transparent" />
            </div>

            {/* Moving Content */}
            <div
              className="flex items-center h-full"
              style={{
                position: 'absolute',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                gap: '3.5rem',
                animation: 'moveAd 26s linear infinite alternate',
                fontWeight: 600,
                color: '#166534',
                fontSize: '0.95rem',
                willChange: 'transform',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.animationPlayState = 'paused')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.animationPlayState = 'running')
              }
            >
              <span className="flex items-center gap-2">
                <span className="text-green-600">➜</span>
                View related products for <strong>{content.title}</strong>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-green-600">➜</span>
                View related products for <strong>{content.title}</strong>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-green-600">➜</span>
                View related products for <strong>{content.title}</strong>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-green-600">➜</span>
                View related products for <strong>{content.title}</strong>
              </span>
            </div>
          </Link>

          {/* Title */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
              {content.title}
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify text-sm md:text-base">
              {content.description}
            </p>
          </div>

          {/* Technical Papers */}
          {content.technicalPapers?.length > 0 && (
            <div className="mt-4 p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">
                📄 Technical Papers
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {content.technicalPapers.map((paper, idx) => (
                  <li key={idx}>
                    <a
                      href={paper.link} // <-- must match admin field
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      {paper.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* GLOBAL KEYFRAMES (CANNOT FAIL) */}
      <style jsx global>{`
        @keyframes moveAd {
          from {
            transform: translateX(-40%);
          }
          to {
            transform: translateX(40%);
          }
        }
      `}</style>
    </div>
  );
}
