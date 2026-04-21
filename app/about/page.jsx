'use client';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      {/* ================= GET TO KNOW US ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-green-600 font-semibold mb-4 text-lg">
              Get to know us!
            </h2>

            <p className="text-gray-700 leading-relaxed mb-5">
              In February 2022, two dedicated engineering college professors
              embarked on a remarkable journey, giving birth to{' '}
              <span className="text-green-600 font-medium">
                WaveNxD Technologies Pvt. Ltd.
              </span>{' '}
              Our core mission revolves around crafting innovative solutions to
              simplify and elevate the quality of human life through the realms
              of electronics and computing engineering.
            </p>

            <p className="text-gray-700 leading-relaxed">
              With relentless dedication and Hercules efforts, we have delved
              into the intricacies of complex technologies, endeavoring to
              create pathways that offer high-quality, cost-effective, and
              homegrown alternatives for industries, research communities, and
              the common person. At the heart of our endeavor lies a vision that
              fuels our every action – to build a business of substantial value
              within a mere five years.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative w-full">
            {/* ================= MOBILE IMAGE (ONLY ONE) ================= */}
            <div className="block md:hidden w-full h-64 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/about/2.jpg"
                fill
                className="object-cover"
                alt="About WaveNxD"
              />
            </div>

            {/* ================= DESKTOP IMAGE CLUSTER (UNCHANGED) ================= */}
            <div className="hidden md:block relative w-full h-[480px]">
              {/* TOP RIGHT */}
              <div className="absolute top-0 right-6 w-48 h-48 rounded-full overflow-hidden shadow-lg animate-float z-20">
                <Image
                  src="/about/1.jpg"
                  fill
                  className="object-cover"
                  alt=""
                />
              </div>

              {/* CENTER LARGE */}
              <div className="absolute top-24 right-52 w-64 h-64 rounded-full overflow-hidden shadow-lg animate-float-slow z-10">
                <Image
                  src="/about/2.jpg"
                  fill
                  className="object-cover"
                  alt=""
                />
              </div>

              {/* BOTTOM RIGHT */}
              <div className="absolute bottom-0 right-24 w-48 h-48 rounded-full overflow-hidden shadow-lg animate-float-fast z-20">
                <Image
                  src="/about/3.jpg"
                  fill
                  className="object-cover"
                  alt=""
                />
              </div>

              {/* EXTRA SMALL */}
              <div className="absolute top-44 right-8 w-28 h-28 rounded-full overflow-hidden shadow-lg animate-float-slower z-30">
                <Image
                  src="/about/4.jpg"
                  fill
                  className="object-cover"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION & STORY ================= */}
      <section
        className="relative py-20"
        style={{
          backgroundImage: 'url(/about/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/70" />

        <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div className="bg-green-100/80 p-8 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-green-900">
              Our Mission
            </h3>
            <p className="text-sm text-gray-800 leading-relaxed">
              Our mission is to offer innovative, environment-friendly products
              and services which are less costly, effective, high quality,
              complying standards, minimizing resources consuming in general and
              less energy consuming in particular.
            </p>
          </div>

          <div className="bg-green-100/80 p-8 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-green-900">
              Our Story
            </h3>
            <p className="text-sm text-gray-800 leading-relaxed">
              Founded in Feb. 2022 by professors of Electronics and
              Telecommunication department of KIT’s College of Engineering,
              WaveNxD Technologies Pvt. Ltd. delivers innovative solutions
              through electronics and computing engineering.
            </p>
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold text-center mb-3">
          Meet Our Visionary Team
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Mrs. Ketaki A. Nigavekar ', role: 'Director', image: '/about/Director1.jpg' },
            { name: 'Prof. Atul R. Nigavekar', role: 'Co-founder - WaveNxd Technologies Pvt. Ltd.', image: '/about/Founder1.jpg' },
            {
              name: "Prof. Vivek K. Desai",
              role: 'Co-founder and Promoter - WaveNxd Technologies Pvt. Ltd.',
              image: '/about/Founder2.jpg',
            },
            { name: 'Mr. Pratapsinh K. Desai', role: 'Director', image: '/about/Director2.jpg' },
          ].map((m, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md text-center"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 mb-4 overflow-hidden" >
                <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-semibold">{m.name}</h4>
              <p className="text-sm text-gray-600">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            Our Core Values
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed space-y-2">
            We strongly believe in building trust by unwavering ethics.
            <br />
            We recognize the importance of mutual respect and nurturing
            relationships.
            <br />
            We worship knowledge and its application to build an ecosystem of
            inclusion.
            <br />
            We deliver innovative, high-quality and reliable solutions that win
            customer confidence.
          </p>
        </div>
      </section>
    </>
  );
}
