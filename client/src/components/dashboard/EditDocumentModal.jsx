import { useState, useEffect, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api.js';
import { getAllDocumentTypes } from '../../constants/documentTypes.js';

const EditDocumentModal = ({ open, document, onClose, onSaved, categories = [] }) => {
  const documentTypeOptions = useMemo(() => getAllDocumentTypes(), []);
  const [form, setForm] = useState({
    title: '',
    description: '',
    documentType: '',
    category: '',
    tags: '',
    version: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (document) {
      setForm({
        title: document.title || '',
        description: document.description || '',
        documentType: document.documentType || '',
        category: document.category || '',
        tags: Array.isArray(document.tags) ? document.tags.join(', ') : '',
        version: document.version || '1.0.0'
      });
    }
  }, [document]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document?.id) return;

    setSaving(true);
    try {
      await api.put(`/documents/${document.id}`, {
        title: form.title.trim(),
        description: form.description.trim(),
        documentType: form.documentType,
        category: form.category.trim(),
        tags: form.tags,
        version: form.version.trim()
      });
      toast.success('Document updated');
      onSaved?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update document');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e0f13] p-5 text-white shadow-[0_25px_90px_rgba(0,0,0,0.65)] sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Edit</p>
                  <Dialog.Title className="font-heading text-xl text-white">
                    Update document
                  </Dialog.Title>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 transition hover:text-white hover:bg-white/10 touch-manipulation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <label className="block space-y-1.5 text-sm">
                  <span className="text-slate-300">Title</span>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="block space-y-1.5 text-sm">
                  <span className="text-slate-300">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none resize-none"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300">Document Type</span>
                    <select
                      value={form.documentType}
                      onChange={(e) => handleChange('documentType', e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                    >
                      {documentTypeOptions.slice(1).map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300">Category</span>
                    <input
                      list="edit-category-options"
                      value={form.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                    />
                    <datalist id="edit-category-options">
                      {categories.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300">Tags (comma separated)</span>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={(e) => handleChange('tags', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                      placeholder="battery, torque"
                    />
                  </label>

                  <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300">Version</span>
                    <input
                      type="text"
                      value={form.version}
                      onChange={(e) => handleChange('version', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                    />
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-slate-400 transition hover:text-white hover:border-white/20 touch-manipulation active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60 touch-manipulation active:scale-95"
                  >
                    {saving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditDocumentModal;
