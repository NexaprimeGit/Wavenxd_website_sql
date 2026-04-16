'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/careers')
      .then((res) => res.json())
      .then((data) => {
        const jobsList = data.filter((c) => (c.type || 'job') === 'job');
        const internshipsList = data.filter((c) => c.type === 'internship');
        setJobs(jobsList);
        setInternships(internshipsList);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading careers...</p>;
  }

  return (
    <main className="career-page max-w-7xl mx-auto px-6 py-12">
      {/* HEADER */}
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          Explore Careers at <span className="text-green-600">WaveNxD</span>
        </h1>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Build precision technologies with a world-class engineering team.
          Check out our open jobs and internships.
        </p>
      </header>

      {/* JOBS SECTION */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-green-600 mb-6">
          Open Jobs
        </h2>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No job openings available currently.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {jobs.map((job) => (
              <li
                key={job._id}
                className="flex justify-between items-center px-4 py-3 rounded-lg hover:bg-green-50 transition cursor-pointer"
              >
                <Link
                  href={`/careers/${job._id}`}
                  className="flex-1 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-gray-500 mt-1">
                      {job.location} · {job.experience}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {job.isOpen && (
                      <span className="text-green-600 font-semibold">Open</span>
                    )}
                    <span className="text-green-600 text-xl">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* INTERNSHIPS SECTION */}
      <section>
        <h2 className="text-3xl font-semibold text-green-600 mb-6">
          Internships
        </h2>
        {internships.length === 0 ? (
          <p className="text-gray-500">
            No internship openings available currently.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {internships.map((intern) => (
              <li
                key={intern._id}
                className="flex justify-between items-center px-4 py-3 rounded-lg hover:bg-green-50 transition cursor-pointer"
              >
                <Link
                  href={`/careers/${intern._id}`}
                  className="flex-1 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{intern.title}</h3>
                    <p className="text-gray-500 mt-1">
                      {intern.location} ·{' '}
                      {intern.duration || 'Flexible Duration'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {intern.isOpen && (
                      <span className="text-green-600 font-semibold">Open</span>
                    )}
                    <span className="text-green-600 text-xl">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
