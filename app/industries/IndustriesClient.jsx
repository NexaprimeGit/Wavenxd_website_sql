'use client';

import { useEffect, useState } from 'react';
import IndustriesTop from './IndustriesTop';
import IndustryContent from './IndustryContent';

export default function IndustriesClient({
  industries: initialIndustries = [],
}) {
  const [industries] = useState(initialIndustries);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    // default selection
    if (industries.length && industries[0].applications.length) {
      setSelectedContent(industries[0].applications[0]);
    }
  }, [industries]);

  const handleSelect = (industrySlug, appSlug) => {
    // Find industry from state
    const industry = industries.find((ind) => ind.slug === industrySlug);
    if (!industry) return;

    // Find application
    const application = industry.applications.find(
      (app) => app.slug === appSlug,
    );
    if (!application) return;

    setSelectedContent(application);
  };

  if (industries.length === 0) {
    return (
      <div className="w-full py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No Industries Available</h2>
        <p className="text-lg text-gray-600">Industries will be added soon. Check back later!</p>
      </div>
    );
  }

  return (
    <>
      <IndustriesTop industries={industries} onSelect={handleSelect} />

      {selectedContent && (
        <div className="mt-10">
          <IndustryContent content={selectedContent} />
        </div>
      )}
    </>
  );
}
