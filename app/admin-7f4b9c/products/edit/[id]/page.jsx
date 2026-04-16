'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
    documents: [{ label: '', link: '' }],
    specs: [{ label: '', value: '' }],
    details: [{ label: '', value: '' }],
    applications: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch product');
        setForm(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleArrayChange = (field, index, key, value) => {
    const copy = [...form[field]];
    copy[index][key] = value;
    setForm({ ...form, [field]: copy });
  };
  const addArrayItem = (field, newItem) =>
    setForm({ ...form, [field]: [...form[field], newItem] });
  const removeArrayItem = (field, index) => {
    const copy = [...form[field]];
    copy.splice(index, 1);
    setForm({ ...form, [field]: copy });
  };
  const handleAppChange = (key, values) =>
    setForm({ ...form, applications: { ...form.applications, [key]: values } });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/products/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Upload failed');
      setForm({ ...form, image: data.path });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setToast('✅ Product updated successfully!');
      setTimeout(() => {
        setToast('');
        router.push('/admin-7f4b9c/products');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setToast('✅ Product deleted successfully!');
      setTimeout(() => router.push('/admin-7f4b9c/products'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-green-600">Edit Product</h1>
      {error && <p className="text-red-600">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Title, Subtitle, Slug */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Subtitle"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Slug"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

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
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        {/* Dynamic sections */}
        {['documents', 'specs', 'details'].map((field) => (
          <div key={field}>
            <h3 className="font-semibold mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </h3>
            {form[field].map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                {Object.keys(item).map((k) => (
                  <input
                    key={k}
                    type="text"
                    placeholder={k}
                    value={item[k]}
                    onChange={(e) =>
                      handleArrayChange(field, i, k, e.target.value)
                    }
                    className="px-2 py-1 border rounded w-1/2"
                  />
                ))}
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
              onClick={() =>
                addArrayItem(
                  field,
                  Object.fromEntries(
                    Object.keys(form[field][0]).map((k) => [k, '']),
                  ),
                )
              }
              className="text-green-600 font-medium mt-1"
            >
              + Add
            </button>
          </div>
        ))}

        {/* Applications */}
        <div>
          <h3 className="font-semibold mb-2">Applications</h3>
          {Object.entries(form.applications).map(([key, values]) => (
            <div key={key} className="flex gap-2 mb-2">
              <input
                type="text"
                value={key}
                disabled
                className="px-2 py-1 border rounded w-1/2"
              />
              <input
                type="text"
                value={values.join(',')}
                onChange={(e) =>
                  handleAppChange(key, e.target.value.split(','))
                }
                className="px-2 py-1 border rounded w-1/2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newKey = prompt('Enter application name:');
              if (newKey) handleAppChange(newKey, []);
            }}
            className="text-green-600 font-medium mt-1"
          >
            + Add Application
          </button>
        </div>

        <label className="inline-flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="rounded"
          />
          <span>Active</span>
        </label>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={() => setDeleteConfirm(true)}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Delete Product
          </button>
        </div>
      </form>

      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg animate-in slide-in-from-top">
          {toast}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <h2 className="text-lg font-bold text-red-600">Confirm Delete</h2>
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDeleteConfirm(false);
                  handleDelete();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
