"use client";

import { useState } from "react";
import Image from "next/image";
import ServiceEnquiryModal from "@/app/components/ServiceEnquiryModal";

const services = [
  { title: "60 kHz", img: "/services/60khz.jpg", desc: "High-frequency ultrasonic spray trials" },
  { title: "120 kHz", img: "/services/120khz.jpg", desc: "Precision atomization at 120 kHz" },
  { title: "180 kHz", img: "/services/60khz.jpg", desc: "Advanced high-frequency ultrasonic spray" },
  { title: "Spray Pyrolysis", img: "/services/spray-pyrolysis.jpg", desc: "Material deposition via spray pyrolysis" },
  { title: "Spray System", img: "/services/SpraySystem.jpg", desc: "Custom-designed spray solutions" },
  { title: "Ultrasonic Transducer", img: "/services/ultrasonic.jpg", desc: "Various ultrasonic transducers" },
  { title: "Charge Measurement System", img: "/services/charge-measurement.jpg", desc: "Accurate charge measurement tools" },
];

export default function ServicesPage() {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-20">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent 
                         bg-gradient-to-r from-green-600 via-black to-green-700 h-15">
            Solution Spray Trial Services
          </h1>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            Commercial and research-oriented spray and ultrasonic solutions
            delivered with precision, innovation, and reliability.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <button
              key={service.title}
              onClick={() => {
                setSelectedService(service.title);
                setOpen(true);
              }}
              className={`relative cursor-pointer group overflow-hidden rounded-2xl
                border border-gray-200 bg-white
                shadow-lg transition-all duration-300
                hover:-translate-y-2 hover:shadow-green-400/40
                ${index === 6 ? "lg:col-span-3 flex justify-center" : ""}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-70 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-56 px-6 text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-black drop-shadow-md">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-black/90 mt-2">
                  {service.desc}
                </p>
                <span className="mt-4 text-sm font-medium text-green-700 bg-white/80 px-4 py-1 rounded-full">
                  Enquire Now
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Enquiry Modal */}
      {open && (
        <ServiceEnquiryModal
          service={selectedService}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
