'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function TechnicalPapersAdmin() {
  const { industrySlug, appSlug } = useParams();

  const [papers, setPapers] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ title: '', link: '' });

  const [deleteIndex, setDeleteIndex] = useState(null); // 🔴 NEW

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const API_URL = `/api/admin/industries/${industrySlug}/applications/${appSlug}/technical-papers`;

  /* ================= TOAST ================= */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  /* ================= FETCH ================= */
  const fetchPapers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, { cache: 'no-store' });
      const data = await res.json();
      setPapers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load papers');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (industrySlug && appSlug) fetchPapers();
  }, [industrySlug, appSlug, fetchPapers]);

  /* ================= ADD ================= */
  const handleAdd = async () => {
    if (!title.trim() || !/^https?:\/\//.test(link)) {
      showToast('Valid title & https:// link required');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, link }),
      });

      const data = await res.json();
      if (data.success) {
        setPapers(data.technicalPapers);
        setTitle('');
        setLink('');
        showToast('Paper added successfully');
      }
    } catch (err) {
      console.error(err);
      showToast('Add failed');
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: deleteIndex }),
      });

      const data = await res.json();
      if (data.success) {
        setPapers(data.technicalPapers);
        showToast('Paper deleted');
      }
    } catch (err) {
      console.error(err);
      showToast('Delete failed');
    } finally {
      setDeleteIndex(null);
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!editData.title.trim() || !/^https?:\/\//.test(editData.link)) {
      showToast('Valid title & link required');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index: editIndex,
          title: editData.title,
          link: editData.link,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPapers(data.technicalPapers);
        setEditIndex(null);
        showToast('Paper updated');
      }
    } catch (err) {
      console.error(err);
      showToast('Update failed');
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading technical papers...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-green-600">
        Technical Papers – {appSlug}
      </h1>

      {/* ADD FORM */}
      <div className="bg-white shadow rounded-xl p-5 grid md:grid-cols-3 gap-4">
        <input
          placeholder="Paper Title"
          className="border p-2 rounded focus:outline-green-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="https://example.com/file.pdf"
          className="border p-2 rounded focus:outline-green-600"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add Paper
        </button>
      </div>

      {/* LIST */}
      {papers.length === 0 ? (
        <p className="text-gray-500">No technical papers added yet.</p>
      ) : (
        <ul className="space-y-3">
          {papers.map((p, i) => (
            <li
              key={i}
              className="border p-4 rounded flex justify-between gap-4"
            >
              <div>
                <p className="font-semibold">{p.title}</p>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 text-sm hover:underline break-all"
                >
                  {p.link}
                </a>
              </div>

              <div className="flex gap-4">
                <button
                  className="text-blue-600 font-medium"
                  onClick={() => {
                    setEditIndex(i);
                    setEditData({ title: p.title, link: p.link });
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 font-medium"
                  onClick={() => setDeleteIndex(i)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* DELETE MODAL */}
      {deleteIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleteIndex(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl
                       w-[360px] max-w-[90%]
                       p-6 animate-in zoom-in duration-200"
          >
            <h2 className="text-lg font-semibold text-center text-gray-800">
              Delete Technical Paper?
            </h2>

            <p className="text-sm text-gray-600 text-center mt-3">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setDeleteIndex(null)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL (UNCHANGED) */}
      {editIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/50 backdrop-blur-sm"
          onClick={() => setEditIndex(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl
                       w-[380px] max-w-[90%] p-6"
          >
            <h2 className="text-lg font-semibold text-center mb-4">
              Edit Technical Paper
            </h2>

            <input
              className="w-full border p-2 rounded mb-3"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />
            <input
              className="w-full border p-2 rounded"
              value={editData.link}
              onChange={(e) =>
                setEditData({ ...editData, link: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditIndex(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-2 rounded-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
