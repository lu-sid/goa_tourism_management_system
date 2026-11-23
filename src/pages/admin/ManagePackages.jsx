import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Plus,
  RefreshCw,
  Trash2,
  X
} from 'lucide-react';

import {
  getAdminPackages,
  createPackage,
  updatePackage,
  deletePackage
} from '../../services/packageService';

import '../../styles/packages.css';

const initialForm = {
  name: '',
  description: '',
  category: 'Other',
  days: 1,
  nights: 0,
  price: 0,
  maxPeople: 1,
  inclusions: '',
  exclusions: '',
  images: '',
  status: 'Active'
};

const categories = [
  'Adventure', 'Beach', 'Heritage', 'Nature',
  'Family', 'Honeymoon', 'Other'
];

const splitLines = (value) =>
  value.split('\n').map((item) => item.trim()).filter(Boolean);

export default function ManagePackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  const loadPackages = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getAdminPackages();
      setPackages(response.data.packages || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load packages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openCreate = () => {
    setEditingId('');
    setForm(initialForm);
    setShowForm(true);
    setError('');
    setNotice('');
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      description: item.description || '',
      category: item.category || 'Other',
      days: item.duration?.days || 1,
      nights: item.duration?.nights || 0,
      price: item.price || 0,
      maxPeople: item.maxPeople || 1,
      inclusions: (item.inclusions || []).join('\n'),
      exclusions: (item.exclusions || []).join('\n'),
      images: (item.images || []).join('\n'),
      status: item.status || 'Active'
    });
    setShowForm(true);
    setError('');
    setNotice('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!form.name.trim() || !form.description.trim()) {
      setError('Package name and description are required.');
      return;
    }

    if (
      Number(form.days) < 1 ||
      Number(form.nights) < 0 ||
      Number(form.price) < 0 ||
      Number(form.maxPeople) < 1
    ) {
      setError('Please enter valid duration, price and guest limits.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      duration: {
        days: Number(form.days),
        nights: Number(form.nights)
      },
      price: Number(form.price),
      maxPeople: Number(form.maxPeople),
      inclusions: splitLines(form.inclusions),
      exclusions: splitLines(form.exclusions),
      images: splitLines(form.images),
      status: form.status
    };

    setSaving(true);

    try {
      if (editingId) {
        await updatePackage(editingId, payload);
        setNotice('Package updated successfully.');
      } else {
        await createPackage(payload);
        setNotice('Package created successfully.');
      }

      setShowForm(false);
      setEditingId('');
      setForm(initialForm);
      await loadPackages();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save package.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

    setError('');
    setNotice('');

    try {
      await deletePackage(item._id);
      setNotice('Package deleted.');
      await loadPackages();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete package.');
    }
  };

  return (
    <main className="package-admin-page">
      <div className="package-admin-container">
        <Link to="/admin" className="package-admin-back">
          <ArrowLeft size={17} /> Back to dashboard
        </Link>

        <div className="package-admin-heading">
          <div>
            <span className="discovery-eyebrow dark">SUSHEGAD GOA · ADMIN</span>
            <h1>Manage tour packages</h1>
            <p>Create, update and maintain the experiences shown to tourists.</p>
          </div>

          <button className="discovery-button" onClick={openCreate}>
            <Plus size={17} /> Add package
          </button>
        </div>

        {error && <div className="discovery-error">{error}</div>}
        {notice && <div className="discovery-success">{notice}</div>}

        <div className="package-admin-toolbar">
          <strong>{packages.length} packages</strong>
          <button type="button" onClick={loadPackages}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {showForm && (
          <form className="package-admin-form" onSubmit={handleSubmit}>
            <div className="package-admin-form-heading">
              <h2>{editingId ? 'Edit package' : 'Create package'}</h2>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close form">
                <X size={20} />
              </button>
            </div>

            <div className="package-admin-form-grid">
              <label>
                Package name
                <input required value={form.name} onChange={(e) => setField('name', e.target.value)} />
              </label>

              <label>
                Category
                <select value={form.category} onChange={(e) => setField('category', e.target.value)}>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label className="package-admin-wide">
                Description
                <textarea required rows="4" value={form.description} onChange={(e) => setField('description', e.target.value)} />
              </label>

              <label>
                Duration (days)
                <input type="number" min="1" required value={form.days} onChange={(e) => setField('days', e.target.value)} />
              </label>

              <label>
                Duration (nights)
                <input type="number" min="0" required value={form.nights} onChange={(e) => setField('nights', e.target.value)} />
              </label>

              <label>
                Price per person (₹)
                <input type="number" min="0" required value={form.price} onChange={(e) => setField('price', e.target.value)} />
              </label>

              <label>
                Maximum guests per booking
                <input type="number" min="1" required value={form.maxPeople} onChange={(e) => setField('maxPeople', e.target.value)} />
              </label>

              <label>
                Status
                <select value={form.status} onChange={(e) => setField('status', e.target.value)}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>

              <label>
                Inclusions (one per line)
                <textarea rows="4" value={form.inclusions} onChange={(e) => setField('inclusions', e.target.value)} />
              </label>

              <label>
                Exclusions (one per line)
                <textarea rows="4" value={form.exclusions} onChange={(e) => setField('exclusions', e.target.value)} />
              </label>

              <label className="package-admin-wide">
                Image URLs (one per line)
                <textarea rows="3" value={form.images} onChange={(e) => setField('images', e.target.value)} placeholder="https://..." />
              </label>
            </div>

            <div className="package-admin-form-actions">
              <button type="button" className="package-admin-cancel" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="discovery-button" type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create package'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="package-admin-loading">Loading packages...</p>
        ) : packages.length === 0 ? (
          <div className="package-admin-empty">
            <h2>No packages created yet</h2>
            <p>Add your first Goa experience to make it visible on the website.</p>
          </div>
        ) : (
          <div className="package-admin-list">
            {packages.map((item) => (
              <article className="package-admin-item" key={item._id}>
                <div className="package-admin-item-image">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500'}
                    alt=""
                  />
                </div>

                <div className="package-admin-item-content">
                  <span className={`package-admin-status ${item.status === 'Active' ? 'active' : 'inactive'}`}>
                    {item.status}
                  </span>
                  <h3>{item.name}</h3>
                  <p>{item.category} · {item.duration?.days || 1} days · Up to {item.maxPeople} guests</p>
                  <strong>₹{Number(item.price || 0).toLocaleString('en-IN')} / person</strong>
                </div>

                <div className="package-admin-item-actions">
                  <button type="button" onClick={() => openEdit(item)}>
                    <Edit3 size={16} /> Edit
                  </button>
                  <button type="button" className="delete" onClick={() => handleDelete(item)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
