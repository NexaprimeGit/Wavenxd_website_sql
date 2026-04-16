import {
  Stethoscope,
  Cpu,
  BatteryCharging,
  FlaskConical,
  Shirt,
  Car,
} from 'lucide-react';
import Link from 'next/link';

const industries = [
  {
    title: 'Medical Coatings',
    desc: 'Precision coating of medical devices, implants, and diagnostics with superior uniformity and material utilization.',
    icon: <Stethoscope size={26} />,
    image: '/industries/medical.jpg',
  },
  {
    title: 'Electronics Manufacturing',
    desc: 'Applying flux, photoresists, and conductive materials for semiconductor, PCB, and display fabrication.',
    icon: <Cpu size={26} />,
    image: '/industries/electronics.jpg',
  },
  {
    title: 'Energy Solutions',
    desc: 'Developing advanced coatings for fuel cells, solar cells, and battery components to enhance performance and durability.',
    icon: <BatteryCharging size={26} />,
    image: '/industries/energy.jpg',
  },
  {
    title: 'Nanotechnology & R&D',
    desc: 'Enabling research and development in advanced materials, nanoparticles, and thin film deposition.',
    icon: <FlaskConical size={26} />,
    image: '/industries/nano.jpg',
  },
  {
    title: 'Textile & Fabric Treatment',
    desc: 'Applying functional coatings to textiles for water repellency, antimicrobial properties, and enhanced durability.',
    icon: <Shirt size={26} />,
    image: '/industries/textiles.jpg',
  },
  {
    title: 'Automotive Applications',
    desc: 'From anti-corrosion layers to specialized paints, our nozzles ensure even and efficient application.',
    icon: <Car size={26} />,
    image: '/industries/automotive.jpg',
  },
];

export default function Industries() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-24">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-12 text-gray-900 text-center sm:text-left">
        Industries We Serve & Our Solutions
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {industries.map((item, index) => (
          <div
            key={index}
            className="group relative h-[260px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* BACKGROUND IMAGE */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url(${item.image})` }}
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/65 to-white/85" />

            {/* CONTENT */}
            <div className="relative h-full p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="mb-2 sm:mb-3 text-green-600">{item.icon}</div>

                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-gray-900">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <Link
                href="/industries"
                className="text-green-600 text-xs sm:text-sm font-medium hover:underline w-fit mt-2 sm:mt-0"
              >
                Learn More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
