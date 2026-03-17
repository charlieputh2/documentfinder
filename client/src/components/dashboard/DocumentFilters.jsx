import { useMemo, useState, useEffect } from 'react';
import { RotateCcw, X, Search } from 'lucide-react';
import { getAllDocumentTypes, getDocumentTypeConfig } from '../../constants/documentTypes.js';

const FILE_TYPE_OPTIONS = [
  { label: 'All formats', value: '' },
  { label: 'PDF', value: 'application/pdf' },
  { label: 'DOCX', value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { label: 'DOC', value: 'application/msword' },
  { label: 'Images', value: 'image/%' }
];

const DEPARTMENT_OPTIONS = [
  '', 'Battery Module', 'Battery Pack', 'Drive Unit', 'Energy',
  'Mega Pack', 'Power Wall', 'PCS', 'Semi'
];

const SelectField = ({ label, value, onChange, options, active }) => (
  <label className="space-y-1 text-2xs sm:text-xs">
    <span className="text-slate-400 font-medium">{label}</span>
    <select
      value={value}
      onChange={onChange}
      className={`w-full rounded-lg border bg-black/30 px-2.5 py-2 text-xs text-white transition-all duration-200 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm touch-manipulation appearance-none cursor-pointer ${
        active ? 'border-primary/30 bg-primary/5' : 'border-white/5 hover:border-white/10'
      }`}
    >
      {options.map((opt) => (
        <option key={typeof opt === 'string' ? opt || '__all__' : opt.value ?? opt.label} value={typeof opt === 'string' ? opt : opt.value}>
          {typeof opt === 'string' ? (opt || `All ${label.toLowerCase()}s`) : opt.label}
        </option>
      ))}
    </select>
  </label>
);

const DocumentFilters = ({ filters, onChange, onReset, categories = [], tags = [], activeCount = 0 }) => {
  const documentTypeOptions = useMemo(() => getAllDocumentTypes(), []);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (!trimmed) {
      if (filters.search) onChange({ search: '' });
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      onChange({ search: searchInput });
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const activeFilters = [];
  if (filters.documentType) {
    const config = getDocumentTypeConfig(filters.documentType);
    activeFilters.push({ key: 'documentType', label: config?.code || filters.documentType, color: 'text-primary' });
  }
  if (filters.category) activeFilters.push({ key: 'category', label: filters.category, color: 'text-slate-200' });
  if (filters.tag) activeFilters.push({ key: 'tag', label: `#${filters.tag}`, color: 'text-slate-200' });
  if (filters.fileType) {
    const match = FILE_TYPE_OPTIONS.find(o => o.value === filters.fileType);
    activeFilters.push({ key: 'fileType', label: match?.label || 'Custom', color: 'text-slate-200' });
  }

  return (
    <section className="rounded-xl border border-white/5 bg-[#15161b] p-3 shadow-lg shadow-black/30 sm:rounded-2xl sm:p-5 animate-slide-up">

      {/* Header */}
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <div className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">Filters</h3>
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.5rem] font-bold text-white sm:h-5 sm:w-5 sm:text-2xs">
              {activeCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={activeCount === 0 && !searchInput}
          className="flex items-center gap-1 rounded-md border border-white/5 bg-white/[0.03] px-2 py-1 text-2xs text-slate-400 transition-all duration-200 hover:bg-white/[0.06] hover:text-white active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed sm:px-2.5 sm:py-1.5 sm:text-xs touch-manipulation"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1 sm:gap-1.5">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-2xs font-medium transition-all animate-scale-in sm:text-xs"
            >
              <span className={f.color}>{f.label}</span>
              <button
                type="button"
                onClick={() => onChange({ [f.key]: '' })}
                className="rounded p-0.5 text-slate-500 transition hover:text-white touch-manipulation"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="space-y-2.5 sm:space-y-3">

        {/* Search Input */}
        <div className="space-y-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500 sm:left-3 sm:h-4 sm:w-4" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search documents..."
              inputMode="search"
              className="w-full rounded-lg border border-white/5 bg-black/30 py-2 pl-8 pr-8 text-xs text-white placeholder:text-slate-500 transition-all duration-200 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 sm:rounded-xl sm:py-2.5 sm:pl-10 sm:pr-10 sm:text-sm touch-manipulation"
            />
            {isSearching && (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 sm:right-3">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              </div>
            )}
            {searchInput && !isSearching && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition hover:text-white active:scale-90 sm:right-3 touch-manipulation"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid gap-2 grid-cols-2 sm:gap-2.5">
          <SelectField
            label="Type"
            value={filters.documentType}
            onChange={(e) => onChange({ documentType: e.target.value })}
            options={documentTypeOptions}
            active={!!filters.documentType}
          />
          <SelectField
            label="Department"
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value })}
            options={DEPARTMENT_OPTIONS.map(d => ({ value: d, label: d || 'All departments' }))}
            active={!!filters.category}
          />
          <SelectField
            label="Tag"
            value={filters.tag}
            onChange={(e) => onChange({ tag: e.target.value })}
            options={[{ value: '', label: 'All tags' }, ...tags.map(t => ({ value: t, label: t }))]}
            active={!!filters.tag}
          />
          <SelectField
            label="Format"
            value={filters.fileType}
            onChange={(e) => onChange({ fileType: e.target.value })}
            options={FILE_TYPE_OPTIONS}
            active={!!filters.fileType}
          />
        </div>
      </div>
    </section>
  );
};

export default DocumentFilters;
