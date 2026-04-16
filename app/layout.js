import './globals.css';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';

import HeroStatements from './components/HeroStatements';
export const metadata = {
  title: 'WaveNxd Technologies',
  description: 'Ultrasonic Spray Solutions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        <Navbar />

        <HeroStatements />

        {children}

        {/* ✅ Client-only floating UI */}
        <FloatingWidgets />

        <Footer />
      </body>
    </html>
  );
}
