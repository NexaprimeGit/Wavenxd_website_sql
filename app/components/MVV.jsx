import { Target, Eye, HeartHandshake } from 'lucide-react';

const data = [
  {
    title: 'Our Mission',
    desc: 'To deliver innovative ultrasonic spray solutions that enable precision, efficiency, and sustainability across diverse industrial applications.',
    icon: <Target size={32} className="text-green-600" />,
    image: '/mvv/mission.jpg',
  },
  {
    title: 'Our Vision',
    desc: 'To become a globally trusted leader in ultrasonic spray technology by driving innovation and exceeding customer expectations.',
    icon: <Eye size={32} className="text-green-600" />,
    image: '/mvv/vision.jpg',
  },
  {
    title: 'Our Values',
    desc: 'Integrity, innovation, customer-centricity, and continuous improvement guide everything we do.',
    icon: <HeartHandshake size={32} className="text-green-600" />,
    image: '/mvv/values.jpg',
  },
];

export default function MVV() {
  return (
    <section className="mt-20 py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HEADING */}
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-gray-900">
          Mission, Vision & Values
        </h2>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* BACKGROUND IMAGE */}
              <div
                className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${item.image})` }}
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/65 to-white/85" />

              {/* CONTENT */}
              <div className="relative w-full h-full p-4 sm:p-8 text-center flex flex-col justify-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  {item.icon}
                </div>

                <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900">
                  {item.title}
                </h3>

                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
