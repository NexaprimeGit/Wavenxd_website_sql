'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AddProduct() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [documents, setDocuments] = useState([{ label: '', link: '' }]);
  const [specs, setSpecs] = useState([{ label: '', value: '' }]);
  const [details, setDetails] = useState([{ label: '', value: '' }]);
  const [applications, setApplications] = useState({});

  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');

  const handleArrayChange = (setter, index, field, value) => {
    setter((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const addArrayItem = (setter, newItem) =>
    setter((prev) => [...prev, newItem]);
  const removeArrayItem = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));
  const handleAppChange = (key, values) =>
    setApplications((prev) => ({ ...prev, [key]: values }));

  const handleArrayInputChange = (setter, index, key, value) => {
    handleArrayChange(setter, index, key, value);
  };

  const handleApplicationNameChange = (oldKey, newKey, values) => {
    const copy = { ...applications };
    delete copy[oldKey];
    copy[newKey] = values;
    setApplications(copy);
  };

  const handleApplicationValuesChange = (key, value) => {
    handleAppChange(key, value.split(','));
  };

  const removeApplication = (key) => {
    const copy = { ...applications };
    delete copy[key];
    setApplications(copy);
  };

  const addApplication = () => {
    const newKey = `Application ${Object.keys(applications).length + 1}`;
    setApplications((prev) => ({ ...prev, [newKey]: [''] }));
  };

  const handleAppNameChange = (oldKey, newKey, values) => {
    handleApplicationNameChange(oldKey, newKey, values);
  };

  const handleAppValChange = (key, value) => {
    handleApplicationValuesChange(key, value);
  };

  const handleRemoveApp = (key) => {
    removeApplication(key);
  };

  const handleDynamicSectionInputChange = (setter, index, key, e) => {
    handleArrayInputChange(setter, index, key, e.target.value);
  };

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
      if (!res.ok || !data.success)
        throw new Error(data.error || 'Upload failed');
      setImage(data.path);
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
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug,
          title,
          subtitle,
          description,
          image,
          isActive,
          documents,
          specs,
          details,
          applications,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || 'Failed to add product');

      setToast('✅ Product added successfully!');
      setTimeout(() => {
        setToast('');
        router.push('/admin-7f4b9c/products');
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h1 className="text-2xl font-bold text-green-600">Add Product</h1>
      {error && <p className="text-red-600">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <div className="flex flex-col">
            <label htmlFor="product-image" className="text-sm font-medium text-gray-600 mb-1">
              Product Image
            </label>
            <input
              id="product-image"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              required
            />
            {uploading && (
              <span className="text-sm text-gray-500 mt-1">Uploading...</span>
            )}
            {image && (
              <Image
                src={image}
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
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        {/* Dynamic sections: Documents, Specifications, Details */}
        {['Documents', 'Specifications', 'Details'].map((section) => {
          const stateMap = {
            Documents: documents,
            Specifications: specs,
            Details: details,
          };
          const setterMap = {
            Documents: setDocuments,
            Specifications: setSpecs,
            Details: setDetails,
          };
          const placeholderMap = {
            Documents: ['Label', 'Link'],
            Specifications: ['Label', 'Value'],
            Details: ['Label', 'Value'],
          };

          return (
            <div key={section}>
              <h3 className="font-semibold mb-2">{section}</h3>
              {stateMap[section].map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  {Object.keys(item).map((key) => (
                    <input
                      key={`${section}-${i}-${key}`}
                      type="text"
                      placeholder={placeholderMap[section][Object.keys(item).indexOf(key)]}
                      value={item[key]}
                      onChange={(e) =>
                        handleDynamicSectionInputChange(
                          setterMap[section],
                          i,
                          key,
                          e,
                        )
                      }
                      className="px-2 py-1 border rounded w-1/2"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => removeArrayItem(setterMap[section], i)}
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
                    setterMap[section],
                    Object.fromEntries(
                      Object.keys(stateMap[section][0]).map((k) => [k, '']),
                    ),
                  )
                }
                className="text-green-600 font-medium mt-1"
              >
                + Add {section.slice(0, -1)}
              </button>
            </div>
          );
        })}

        {/* Applications section – now behaves like normal dynamic section */}
        {/* Applications section – behaves like normal dynamic section */}
        <div>
          <h3 className="font-semibold mb-2">Applications</h3>
          {Object.entries(applications).map(([key, values], index) => (
            <div key={index} className="flex gap-2 mb-2">
              {/* Application Name input */}
              <input
                type="text"
                placeholder="Application Name"
                value={key}
                onChange={(e) => handleAppNameChange(key, e.target.value, values)}
                className="px-2 py-1 border rounded w-1/2"
              />

              {/* Application Values input */}
              <input
                type="text"
                placeholder="Comma-separated values"
                value={values.join(',')}
                onChange={(e) => handleAppValChange(key, e.target.value)}
                className="px-2 py-1 border rounded w-1/2"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveApp(key)}
                className="text-red-600 font-bold"
              >
                X
              </button>
            </div>
          ))}

          {/* Add new application as a blank row */}
          <button
            type="button"
            onClick={addApplication}
            className="text-green-600 font-medium mt-1"
          >
            + Add Application
          </button>
        </div>

        <label className="inline-flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded"
          />
          <span>Active</span>
        </label>

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4">
          Add Product
        </button>
      </form>

      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg animate-in slide-in-from-top">
          {toast}
        </div>
      )}
    </div>
  );
}
