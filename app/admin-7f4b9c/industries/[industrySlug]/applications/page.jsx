'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';

export default function ApplicationsPage({ params }) {
  const { industrySlug } = use(params); // ✅ unwrap the params

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!industrySlug) return; // avoid fetching undefined

    async function fetchApplications() {
      try {
        const res = await fetch(
          `/api/admin/industries/${industrySlug}/applications`,
          {
            cache: 'no-store',
          },
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : data.applications || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [industrySlug]);

  if (loading) return <p className="p-6">Loading applications...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-green-600">
        Select Application
      </h1>
      {applications.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <li
              key={app.slug}
              className="border p-4 rounded-md hover:bg-gray-50"
            >
              <Link
                href={`/admin-7f4b9c/industries/${industrySlug}/applications/${app.slug}/technical-papers`}
                className="font-semibold text-blue-600"
              >
                {app.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
