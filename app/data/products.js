export const products = [
  {
    slug: 'ultrasonic-spray-nozzle-60khz',
    title: 'Ultrasonic Spray Nozzle 60KHZ',
    image: '/products/60khz.jpg',
    description: 'High-frequency ultrasonic nozzle for thin, uniform coatings.',

    specs: [
      { label: 'Business Type', value: 'Manufacturer, Supplier' },
      { label: 'Operating Frequency', value: '60 KHz ±10%' },
      { label: 'Median Drop Diameter', value: '40 µm' },
      { label: 'Max Flow Rate', value: '10 ml/min' },
      { label: 'Power Consumption', value: '20 Watts' },
      { label: 'Weight', value: '1000 gms' },
      { label: 'Material', value: 'Titanium' },
      { label: 'Operating Temp', value: '15–70 °C' },
    ],

    applications: {
      medical: [
        'Blood Collection Tube Coating',
        'Stents',
        'Medical Textiles',
        'Bio-aerosol',
      ],
      nanotech: ['CNTs & Nanowires', 'Thin Film Coating', 'Spin Coating'],
      energy: ['Fuel Cell', 'Hydrogen Electrolyser'],
      electronics: ['PCB Spray Fluxing', 'EMI Shielding'],
    },
  },
];
