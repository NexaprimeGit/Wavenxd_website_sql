'use client';

import { useRouter } from 'next/navigation';

export default function Welcome() {
  const router = useRouter();

  return (
    <section className="max-w-6xl mx-auto px-6 mt-16">
      {/* HEADING */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900">
        Welcome to <span className="text-green-600">WaveNxD</span> Technologies
      </h2>

      {/* PARAGRAPH */}
      <p className="text-gray-700 leading-relaxed text-justify max-w-5xl mb-3">
        In February 2022, two dedicated engineering college professors embarked
        on a remarkable journey, giving birth to WaveNxD Technologies Pvt. Ltd.
        Our core mission revolves around crafting innovative solutions to
        simplify and elevate the quality of human life through the realms of
        electronics and computing engineering. With relentless dedication and
        Herculean efforts, we have delved into the intricacies of complex
        technologies, endeavoring to create pathways that offer high-quality,
        cost-effective, and homegrown alternatives for industries, research
        communities, and the common person.
      </p>

      {/* READ MORE → ABOUT PAGE */}
      <button
        onClick={() => router.push('/about')}
        className="mt-3 text-green-600 font-medium hover:underline focus:outline-none"
      >
        Read more
      </button>
    </section>
  );
}
