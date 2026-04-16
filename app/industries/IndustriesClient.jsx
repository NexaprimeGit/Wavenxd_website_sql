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
