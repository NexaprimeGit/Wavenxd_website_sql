'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditCareerPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCareer() {
      try {
        const res = await fetch(`/api/admin/careers/${id}`);
        const data = await res.json();

        // Ensure all array fields exist
        setForm({
          ...data,
          responsibilities: data.responsibilities || [''],
          eligibility: data.eligibility || [''],
          skills: data.skills || [''],
          benefits: data.benefits || [''],
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch career');
      } finally {
        setLoading(false);
      }
    }
    fetchCareer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const arr = [...form[field]];
    arr[index] = value;
    setForm({ ...form, [field]: arr });
  };

  const addArrayItem = (field) =>
    setForm({ ...form, [field]: [...form[field], ''] });
  const removeArrayItem = (field, index) =>
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`/api/admin/careers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || 'Failed to update career');
      router.push('/admin-7f4b9c/careers');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading career...</p>;
  if (!form) return <p className="text-center mt-10">Career not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-green-600">Edit Career</h1>
      {error && <p className="text-red-600">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title || ''}
            onChange={handleChange}
            required
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location || ''}
            onChange={handleChange}
            required
            className="border px-4 py-2 rounded"
          />
          <select
            name="type"
            value={form.type || 'job'}
            onChange={handleChange}
            className="border px-4 py-2 rounded"
          >
            <option value="job">Job</option>
            <option value="internship">Internship</option>
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isOpen || false}
              onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
              className="rounded"
            />
            Open
          </label>
        </div>

        {form.type === 'job' && (
          <input
            type="text"
            name="experience"
            placeholder="Experience"
            value={form.experience || ''}
            onChange={handleChange}
            className="border px-4 py-2 rounded w-full"
          />
        )}

        {form.type === 'internship' && (
          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={form.duration || ''}
            onChange={handleChange}
            className="border px-4 py-2 rounded w-full"
          />
        )}

        <textarea
          name="description"
          placeholder="Description"
          value={form.description || ''}
          onChange={handleChange}
          className="border px-4 py-2 rounded w-full"
        />

        {['responsibilities', 'eligibility', 'skills', 'benefits'].map(
          (field) => (
            <div key={field}>
              <h3 className="font-semibold mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </h3>
              {form[field]?.map((item, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleArrayChange(field, i, e.target.value)
                    }
                    className="border px-2 py-1 rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(field, i)}
                    className="text-red-600 font-bold"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem(field)}
                className="text-green-600 font-medium mt-1"
              >
                + Add {field}
              </button>
            </div>
          ),
        )}

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4">
          Update Career
        </button>
      </form>
    </div>
  );
}
