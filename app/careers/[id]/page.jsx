'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function CareerDetailPage() {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/careers/${id}`)
      .then((res) => res.json())
      .then((data) => setCareer(data));
  }, [id]);

  if (!career) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <main className="career-detail-page max-w-6xl mx-auto px-4 py-10">
      {/* HERO */}
      <header className="career-hero bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl p-8 mb-10">
        <h1 className="text-3xl font-bold mb-2 text-green-600">
          {career.title}
        </h1>

        <p className="text-sm opacity-90 text-gray-700">
          {career.location}
          <span className="mx-2">•</span>
          {career.experience}
        </p>

        <button
          onClick={() => setOpen(true)}
          className="mt-6 px-6 py-3 rounded-full font-bold text-black bg-gradient-to-r from-green-400 to-green-600 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:from-green-500 hover:to-green-700"
        >
          Apply Now
        </button>
      </header>

      {/* CONTENT */}
      <section className="career-content space-y-8">
        <Block title="Job Description">
          <p>{career.description}</p>
        </Block>

        <Block title="Responsibilities">
          <ul>
            {career.responsibilities?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Block>

        <Block title="Eligibility & Qualifications">
          <ul>
            {career.eligibility?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Block>

        <Block title="Required Skills">
          <div className="flex flex-wrap gap-2">
            {career.skills?.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </Block>

        <Block title="Benefits & Perks">
          <ul>
            {career.benefits?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Block>
      </section>

      {/* APPLY MODAL */}
      {open && (
        <ApplyModal careerTitle={career.title} onClose={() => setOpen(false)} />
      )}
    </main>
  );
}

/* ------------------ REUSABLE BLOCK ------------------ */
function Block({ title, children }) {
  return (
    <div className="career-block bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-green-600 mb-3">{title}</h2>
      <div className="text-sm text-gray-700 space-y-2">{children}</div>
    </div>
  );
}

/* ------------------ APPLY MODAL ------------------ */
function ApplyModal({ onClose, careerTitle }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData(e.target);
      formData.append('careerTitle', careerTitle);

      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage('✅ Application submitted successfully!');
      setTimeout(() => onClose(), 1500);
    } catch {
      setMessage('❌ Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white max-w-2xl w-full rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="WaveNxD" width={120} height={40} />
            <h2 className="text-lg font-semibold text-green-700">
              Apply for Position
            </h2>
          </div>
          <button onClick={onClose} className="text-2xl leading-none">
            &times;
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-sm">
          <div>
            <label className="block mb-1 font-medium">Position</label>
            <input
              value={careerTitle}
              disabled
              className="input bg-gray-100 cursor-not-allowed"
            />
          </div>

          <h3 className="font-semibold text-green-600">Applicant Details</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="fullName"
              placeholder="Full Name *"
              required
              className="input"
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address *"
              required
              className="input"
            />
            <input
              name="phone"
              placeholder="Phone Number *"
              required
              className="input"
            />
            <input
              name="resume"
              type="file"
              accept=".pdf"
              required
              className="input"
            />
          </div>

          <textarea
            name="coverLetter"
            placeholder="Cover Letter (Optional)"
            className="input h-28"
          />

          {message && <p className="text-center font-medium">{message}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
