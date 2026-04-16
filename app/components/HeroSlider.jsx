'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    src: '/slider/1.png',
    title: 'Ultrasonic Spray Nozzle – Standard',
    frequency: '60 kHz',
  },
  {
    src: '/slider/2.jpeg',
    title: 'Ultrasonic Spray Nozzle – Wide Angle',
    frequency: '40 kHz',
  },
  {
    src: '/slider/3.png',
    title: 'High Precision Coating Nozzle',
    frequency: '120 kHz',
  },
  {
    src: '/slider/4.jpg',
    title: 'Micro Flow Ultrasonic Nozzle',
    frequency: '80 kHz',
  },
  {
    src: '/slider/5.jpg',
    title: 'Industrial Spray System',
    frequency: '25 kHz',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const total = slides.length;

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 3500);
    return () => clearInterval(interval);
  }, [total]);

  if (!mounted) return null;

  const getIndex = (offset) => (current + offset + total) % total;

  const SlideCard = ({ slide, size = 'md', dimmed = false }) => {
    const sizes = {
      sm: 'w-[260px] h-[170px]',
      md: 'w-[300px] h-[200px]',
      lg: 'w-[380px] h-[250px]',
    };

    return (
      <div
        className={`relative ${sizes[size]} rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${
          dimmed ? 'opacity-60 scale-95' : ''
        }`}
      >
        <Image
          src={slide.src}
          alt={slide.title}
          fill
          className="object-cover"
        />

        {/* TOP TITLE */}
        <div className="absolute top-3 left-3 right-3 bg-black/45 backdrop-blur-md text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
          {slide.title}
        </div>

        {/* BOTTOM FREQUENCY */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-green-600/90 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
          {slide.frequency}
        </div>
      </div>
    );
  };

  return (
    <section
      className="relative text-center px-4 overflow-hidden py-16"
      style={{
        background:
          'linear-gradient(135deg, #e5e7eb 0%, #f1f5f9 45%, #ffffff 100%)',
      }}
    >
      {/* FLOATING BLOBS */}
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-green-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-48 -right-48 w-[480px] h-[480px] bg-emerald-300/20 rounded-full blur-3xl animate-float delay-3000"></div>

      {/* CONTENT */}
      <div className="relative z-10">
        <br></br>

        {/* SLIDER */}
        <div className="relative max-w-7xl mx-auto">
          <div className="relative flex items-center justify-center gap-6 md:gap-10">
            {/* LEFT FAR */}
            <div className="hidden lg:block">
              <SlideCard slide={slides[getIndex(-2)]} size="sm" dimmed />
            </div>

            {/* LEFT */}
            <div
              onClick={() => setCurrent(getIndex(-1))}
              className="cursor-pointer"
            >
              <SlideCard slide={slides[getIndex(-1)]} size="md" dimmed />
            </div>

            {/* CENTER */}
            <div className="z-20 scale-110">
              <SlideCard slide={slides[current]} size="lg" />
            </div>

            {/* RIGHT */}
            <div
              onClick={() => setCurrent(getIndex(1))}
              className="cursor-pointer"
            >
              <SlideCard slide={slides[getIndex(1)]} size="md" dimmed />
            </div>

            {/* RIGHT FAR */}
            <div className="hidden lg:block">
              <SlideCard slide={slides[getIndex(2)]} size="sm" dimmed />
            </div>

            {/* ARROWS */}
            <button
              onClick={() => setCurrent(getIndex(-1))}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white w-11 h-11 rounded-full shadow-lg z-30"
            >
              ❮
            </button>

            <button
              onClick={() => setCurrent(getIndex(1))}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white w-11 h-11 rounded-full shadow-lg z-30"
            >
              ❯
            </button>
          </div>
        </div>

        {/* CTA */}
        <Link href="/products">
          <button className="mt-10 bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-all hover:scale-105 shadow-md">
            Explore More
          </button>
        </Link>
      </div>

      {/* FLOAT ANIMATION */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(28px);
          }
        }

        .animate-float {
          animation: float 14s ease-in-out infinite;
        }

        .delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </section>
  );
}
