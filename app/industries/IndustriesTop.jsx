'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Stethoscope,
  Cpu,
  Car,
  BatteryCharging,
  Shirt,
  FlaskConical,
} from 'lucide-react';

export default function IndustriesTop({ industries = [], onSelect }) {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [openIndustry, setOpenIndustry] = useState(null);
  const total = industries.length;

  useEffect(() => {
    setMounted(true);

    if (!openIndustry && total > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [openIndustry, total]);

  if (!mounted) return null;

  if (total === 0) {
    return (
      <section
        className="relative w-full overflow-visible py-16"
        style={{
          background:
            'linear-gradient(135deg, #ffffffff 0%, #f1f5f9 45%, #ffffffff 100%)',
        }}
      >
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-green-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-48 -right-48 w-[480px] h-[480px] bg-gray-300/20 rounded-full blur-3xl animate-float delay-3000"></div>

        <div className="relative max-w-7xl mx-auto flex items-center justify-center py-20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Industries Yet</h3>
            <p className="text-gray-600">Industries will be displayed here soon.</p>
          </div>
        </div>
      </section>
    );
  }

  const getIndex = (offset) => (current + offset + total) % total;

  const IndustryCard = ({ industry, size = 'md', dimmed = false }) => {
    const sizes = {
      sm: 'w-[260px] h-[170px]',
      md: 'w-[300px] h-[200px]',
      lg: 'w-[380px] h-[250px]',
    };

    const Icon =
      industry.slug === 'medical'
        ? Stethoscope
        : industry.slug === 'electronics'
          ? Cpu
          : industry.slug === 'automotive'
            ? Car
            : industry.slug === 'energy'
              ? BatteryCharging
              : industry.slug === 'textile' || industry.slug === 'textiles'
                ? Shirt
                : FlaskConical;

    const isOpen = openIndustry === industry.slug;

    return (
      <div
        className={`relative ${sizes[size]} rounded-2xl overflow-hidden shadow-xl transition-all duration-500 cursor-pointer ${
          dimmed ? 'opacity-60 scale-95' : ''
        }`}
        onClick={() => setOpenIndustry(isOpen ? null : industry.slug)}
      >
        {(industry.image || industry.slug) && (
          <Image
            src={industry.image || `/industries/${industry.slug}.jpg`}
            alt={industry.title || industry.name}
            fill
            className="object-cover brightness-75"
            priority={false}
          />
        )}

        <div className="absolute inset-0 bg-black/20 rounded-2xl" />

        <div className="absolute top-3 left-3 right-3 text-white text-sm font-semibold px-3 py-1.5 flex flex-col gap-1 drop-shadow-lg z-10">
          <div className="flex justify-center">
            <Icon size={20} className="text-green-400" />
          </div>
          <div className="text-center">{industry.title || industry.name}</div>
          <div className="text-center text-xs font-normal">
            {industry.tagline || 'Industry Application'}
          </div>
        </div>

        {!dimmed && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
            <ChevronDown
              size={22}
              className={`text-white transition-transform duration-300 ${
                isOpen ? 'rotate-180' : 'animate-bounce'
              }`}
            />
          </div>
        )}
      </div>
    );
  };

  const activeIndustry = industries[current];

  return (
    <section
      className="relative w-full overflow-visible py-16"
      style={{
        background:
          'linear-gradient(135deg, #ffffffff 0%, #f1f5f9 45%, #ffffffff 100%)',
      }}
    >
      {/* FLOATING BLOBS */}
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-green-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-48 -right-48 w-[480px] h-[480px] bg-gray-300/20 rounded-full blur-3xl animate-float delay-3000"></div>

      {/* SLIDER */}
      <div className="relative max-w-7xl mx-auto">
        <div className="relative flex items-center justify-center gap-6 md:gap-10 overflow-visible">
          <div className="hidden lg:block">
            <IndustryCard
              industry={industries[getIndex(-2)]}
              size="sm"
              dimmed
            />
          </div>

          <div
            onClick={() => setCurrent(getIndex(-1))}
            className="cursor-pointer"
          >
            <IndustryCard
              industry={industries[getIndex(-1)]}
              size="md"
              dimmed
            />
          </div>

          <div className="z-20 scale-110 relative">
            <IndustryCard industry={activeIndustry} size="lg" />

            <AnimatePresence>
              {openIndustry === activeIndustry.slug &&
                Array.isArray(activeIndustry.applications) &&
                activeIndustry.applications.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -14, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -14, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-5 w-80 z-50"
                  >
                    <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] backdrop-blur-xl bg-white/80 border border-white/40">
                      <div className="h-1.5 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500"></div>

                      <div className="py-2">
                        {activeIndustry.applications.map((app) => (
                          <motion.div
                            key={app.slug}
                            whileHover={{ x: 6 }}
                            onClick={() => {
                              onSelect(activeIndustry.slug, app.slug);
                              setOpenIndustry(null);
                            }}
                            className="group flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 cursor-pointer transition-all"
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-gray-300 group-hover:bg-green-500 transition-colors"></span>
                            <span className="group-hover:text-green-700 transition-colors">
                              {app.title}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          <div
            onClick={() => setCurrent(getIndex(1))}
            className="cursor-pointer"
          >
            <IndustryCard industry={industries[getIndex(1)]} size="md" dimmed />
          </div>

          <div className="hidden lg:block">
            <IndustryCard industry={industries[getIndex(2)]} size="sm" dimmed />
          </div>

          {/* ARROWS — UNTOUCHED */}
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
    </section>
  );
}
