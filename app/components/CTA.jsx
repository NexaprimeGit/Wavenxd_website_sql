"use client";

import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="mt-20 bg-slate-100 py-14">
      <div className="max-w-4xl mx-auto text-center px-6">
        {/* HEADING */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Ready to Innovate with Ultrasonic Technology?
        </h2>

        {/* SUBTEXT */}
        <p className="text-gray-700 mb-6">
          Partner with WaveNxD Technologies to achieve unmatched precision,
          efficiency, and performance for your applications.
        </p>

        {/* CTA BUTTON */}
        <button
          onClick={() => router.push("/contact")}
          className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition"
        >
          Get in Touch
        </button>
      </div>
    </section>
  );
}
