'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EditAccessoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Fetch accessory
  useEffect(() => {
    async function fetchAccessory() {
      try {
        const res = await fetch(`/api/admin/accessories/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch');

        setForm({
          ...data,
          price: data.price ?? '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchAccessory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSpecChange = (i, field, value) => {
    const specs = [...form.specifications];
    specs[i][field] = value;
    setForm({ ...form, specifications: specs });
  };

  const addSpec = () =>
    setForm({
      ...form,
      specifications: [...form.specifications, { label: '', value: '' }],
    });

  const removeSpec = (i) =>
    setForm({
      ...form,
      specifications: form.specifications.filter((_, idx) => idx !== i),
    });

  // Image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/accessories/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error('Upload failed');

      setForm({ ...form, image: data.path });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`/api/admin/accessories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Update failed');

      router.push('/admin-7f4b9c/accessories');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!form) return <p className="text-center text-red-600">Not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-green-600">Edit Accessory</h1>
      {error && <p className="text-red-600">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Accessory Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          {uploading && (
            <span className="text-sm text-gray-500 mt-1">Uploading...</span>
          )}
          {form.image && (
            <Image
              src={form.image}
              alt="Uploaded"
              width={400}
              height={160}
              unoptimized
              className="mt-2 w-full h-40 object-contain rounded-lg border"
            />
          )}
        </div>

        {/* Specs */}
        <div>
          <h3 className="font-semibold">Specifications</h3>
          {form.specifications.map((spec, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={spec.label}
                onChange={(e) => handleSpecChange(i, 'label', e.target.value)}
                className="border px-2 py-1 w-1/2"
              />
              <input
                value={spec.value}
                onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                className="border px-2 py-1 w-1/2"
              />
              <button
                type="button"
                onClick={() => removeSpec(i)}
                className="text-red-600"
              >
                X
              </button>
            </div>
          ))}
          <button type="button" onClick={addSpec} className="text-green-600">
            + Add Spec
          </button>
        </div>

        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={handleChange}
            name="isActive"
          />
          Active
        </label>

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Update Accessory
        </button>
      </form>
    </div>
  );
}
