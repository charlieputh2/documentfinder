import { useState, useMemo } from 'react';
import { Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { getAllDocumentTypes } from '../../constants/documentTypes.js';

const initialState = {
  title: '',
  description: '',
  documentType: 'MN',
  category: '',
  tags: '',
  version: '1.0.0'
};

const DocumentUpload = ({ onUploaded, categorySuggestions = [] }) => {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const documentTypeOptions = useMemo(() => getAllDocumentTypes(), []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.error('Please attach a document file');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('document', file);

    setUploading(true);
    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Document uploaded');
      setForm(initialState);
      setFile(null);
      onUploaded?.();
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-lg border border-white/5 bg-gradient-to-br from-[#1f2026] to-[#15161b] p-3 shadow-glow sm:rounded-2xl sm:p-6">
      <div className="flex items-center gap-2 mb-2">
        <Upload className="h-4 w-4 text-primary/70 sm:h-5 sm:w-5" />
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Upload</p>
          <h3 className="font-heading text-lg text-white sm:text-xl lg:text-2xl">New document</h3>
        </div>
      </div>
      <p className="mb-3 text-2xs text-slate-400 sm:mb-6 sm:text-xs">Upload manufacturing, quality, or process documents</p>

      <form className="space-y-2 sm:space-y-4" onSubmit={handleSubmit}>
        <label className="space-y-1 text-xs sm:space-y-2 sm:text-sm">
          <span className="text-slate-300">Title</span>
          <input
            type="text"
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            required
            className="w-full rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none sm:rounded-xl sm:px-4 sm:py-3"
            placeholder="Battery pack QA"
          />
        </label>

        <label className="space-y-1 text-xs sm:space-y-2 sm:text-sm">
          <span className="text-slate-300">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => handleChange('description', event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none sm:rounded-xl sm:px-4 sm:py-3"
            placeholder="Short summary of the instruction"
          />
        </label>

        <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <label className="space-y-1 text-xs sm:space-y-2 sm:text-sm">
            <span className="text-slate-300">Document Type</span>
            <select
              value={form.documentType}
              onChange={(event) => handleChange('documentType', event.target.value)}
              className="w-full rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none sm:rounded-xl sm:px-4 sm:py-3 touch-manipulation tap-highlight"
              required
            >
              {documentTypeOptions.slice(1).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-3xs text-slate-500 sm:text-xs">Select the type of document you're uploading</p>
          </label>

          <label className="space-y-1 text-xs sm:space-y-2 sm:text-sm">
            <span className="text-slate-300">Category</span>
            <input
              list="category-options"
              value={form.category}
              onChange={(event) => handleChange('category', event.target.value)}
              required
              className="w-full rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none sm:rounded-xl sm:px-4 sm:py-3"
              placeholder="Powertrain"
            />
            <datalist id="category-options">
              {categorySuggestions.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>
        </div>

        <label className="space-y-1 text-xs sm:space-y-2 sm:text-sm">
          <span className="text-slate-300">Tags (comma separated)</span>
          <input
            type="text"
            value={form.tags}
            onChange={(event) => handleChange('tags', event.target.value)}
            className="w-full rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none sm:rounded-xl sm:px-4 sm:py-3"
            placeholder="battery, torque"
          />
        </label>

        <label className="space-y-1 text-xs sm:space-y-2 sm:text-sm">
          <span className="text-slate-300">Version</span>
          <input
            type="text"
            value={form.version}
            onChange={(event) => handleChange('version', event.target.value)}
            className="w-full rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none sm:rounded-xl sm:px-4 sm:py-3"
          />
        </label>

        <label className="space-y-1 text-xs sm:space-y-2 sm:text-sm">
          <span className="text-slate-300">Document (PDF or image)</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full rounded-lg border border-dashed border-white/20 bg-black/20 px-3 py-2 text-sm text-white file:mr-2 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-white sm:rounded-xl sm:px-4 sm:py-3 sm:file:mr-4 sm:file:px-4 sm:file:py-2"
            required
          />
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-glow transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-xl sm:py-3 sm:text-sm touch-manipulation tap-highlight active:scale-95"
        >
          {uploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Uploading…</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default DocumentUpload;
