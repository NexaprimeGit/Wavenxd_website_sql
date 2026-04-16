'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AddAccessoryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    image: '',
    price: '',
    specifications: [{ label: '', value: '' }],
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Handle text/number changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle specifications array
  const handleSpecChange = (index, field, value) => {
    const specs = [...form.specifications];
    specs[index][field] = value;
    setForm({ ...form, specifications: specs });
  };

  const addSpec = () =>
    setForm({
      ...form,
      specifications: [...form.specifications, { label: '', value: '' }],
    });

  const removeSpec = (index) =>
    setForm({
      ...form,
      specifications: form.specifications.filter((_, i) => i !== index),
    });

  // Handle image upload
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
      if (!data.success) throw new Error(data.error || 'Upload failed');
      setForm({ ...form, image: data.path }); // data.path should be string URL
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/admin/accessories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price), // ensure price is a number
        }),
      });
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || 'Failed to add accessory');
      router.push('/admin-7f4b9c/accessories');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-green-600">Add Accessory</h1>
      {error && <p className="text-red-600">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {/* Image Upload */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Product Image
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
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        {/* Specifications */}
        <div>
          <h3 className="font-semibold mb-2">Specifications</h3>
          {form.specifications.map((spec, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Label"
                value={spec.label}
                onChange={(e) => handleSpecChange(i, 'label', e.target.value)}
                className="px-2 py-1 border rounded w-1/2"
              />
              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                className="px-2 py-1 border rounded w-1/2"
              />
              <button
                type="button"
                onClick={() => removeSpec(i)}
                className="text-red-600 font-bold"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpec}
            className="text-green-600 font-medium mt-1"
          >
            + Add Spec
          </button>
        </div>

        {/* Active */}
        <label className="inline-flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="rounded"
          />
          <span>Active</span>
        </label>

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4">
          Add Accessory
        </button>
      </form>
    </div>
  );
}
