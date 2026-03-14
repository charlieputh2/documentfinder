import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, Printer, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { getAvailableFormats, getFormatLabel, formatFileSize } from '../../utils/documents.js';
import { getDocumentTypeConfig } from '../../constants/documentTypes.js';

const PreviewModal = ({ open, document, onClose, onDownload }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const CHARS_PER_PAGE = 2000;
  const formats = useMemo(() => getAvailableFormats(document || {}), [document]);
  const typeConfig = useMemo(() => getDocumentTypeConfig(document?.documentType), [document?.documentType]);

  // Reset states when document changes
  useEffect(() => {
    setCurrentPage(1);
    setIsImageLoaded(false);
    setPdfError(false);
    setImageError(false);
  }, [document?.id]);

  // Reset page when modal opens
  const { totalPages, currentContent } = useMemo(() => {
    if (!document?.textContent) {
      return { totalPages: 0, currentContent: '' };
    }

    const text = document.textContent;
    const pages = Math.ceil(text.length / CHARS_PER_PAGE);
    const start = (currentPage - 1) * CHARS_PER_PAGE;
    const end = start + CHARS_PER_PAGE;
    const content = text.substring(start, end);

    return { totalPages: pages, currentContent: content };
  }, [document?.textContent, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageInput = (e) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPreview = () => {
    // Show text content if available
    if (document?.textContent) {
      return (
        <div className="flex flex-col h-full gap-4">
          <div className="flex-1 rounded-lg bg-white/5 p-4 text-sm leading-relaxed text-slate-200 overflow-hidden">
            <p className="whitespace-pre-wrap break-words">{currentContent}</p>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="rounded-lg border border-white/10 p-2 text-white transition hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Page</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={handlePageInput}
                  className="w-12 rounded border border-white/10 bg-white/5 px-2 py-1 text-center text-sm text-white outline-none transition focus:border-primary focus:bg-primary/10"
                />
                <span className="text-xs text-slate-400">of {totalPages}</span>
              </div>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-white/10 p-2 text-white transition hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-slate-400">
              {Math.min(currentPage * CHARS_PER_PAGE, document?.textContent?.length || 0)} /{' '}
              {document?.textContent?.length || 0} characters
            </div>
          </div>
        </div>
      );
    }

    if (!document?.fileUrl) {
      return (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">
          File not available.
        </div>
      );
    }

    const mime = (document.fileType || '').toLowerCase();
    const isPdf = mime.includes('pdf') || document.fileUrl.toLowerCase().split('?')[0].endsWith('.pdf');
    const isImage = mime.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp|webp)(\?|$)/i.test(document.fileUrl);

    // PDF Preview with error handling
    if (isPdf) {
      return (
        <div className="relative h-full w-full">
          {pdfError ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <FileText className="h-16 w-16 text-slate-500" />
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Unable to preview PDF in browser</p>
                <p className="text-xs text-slate-500">Download the file to view it</p>
              </div>
              <button
                type="button"
                onClick={() => onDownload?.(document)}
                className="flex items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white touch-manipulation tap-highlight"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          ) : (
            <iframe
              title={document.title}
              src={`${document.fileUrl}#view=FitH&toolbar=0&navpanes=0`}
              className="h-full w-full rounded-xl border-0"
              onError={() => setPdfError(true)}
            />
          )}
        </div>
      );
    }

    // Image Preview with loading state
    if (isImage) {
      return (
        <div className="relative h-full w-full flex items-center justify-center">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-slate-400">Loading image...</p>
              </div>
            </div>
          )}
          {imageError ? (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <ImageIcon className="h-12 w-12 text-slate-500" />
              <p className="text-sm">Failed to load image preview</p>
              <button type="button" onClick={() => onDownload?.(document)} className="rounded-full border border-primary/50 px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white">Download instead</button>
            </div>
          ) : (
            <img
              src={document.fileUrl}
              alt={document.title}
              className={`max-h-full max-w-full rounded-xl object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => { setIsImageLoaded(true); setImageError(true); }}
            />
          )}
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-sm text-slate-400">
        <File className="h-16 w-16 text-slate-500" />
        <div className="space-y-2">
          <p className="text-base text-white font-semibold">Preview Not Available</p>
          <p className="max-w-sm text-sm text-slate-400">
            Live preview is not available for this format. You can download or print the file using the options.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDownload?.(document)}
          className="flex items-center gap-2 rounded-full border border-primary/60 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white touch-manipulation tap-highlight active:scale-95"
        >
          <Download className="h-4 w-4" />
          Download File
        </button>
      </div>
    );
  };

  const ActionButton = ({ label, disabled, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 rounded-lg border border-white/10 px-2 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40 sm:rounded-2xl sm:px-4 sm:py-3"
    >
      {label}
    </button>
  );

  const handlePrint = () => {
    if (!document?.fileUrl) return;
    const printWindow = window.open(document.fileUrl, '_blank', 'noopener');
    if (printWindow) {
      printWindow.addEventListener('load', () => printWindow.print());
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
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto p-2 sm:p-4">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl rounded-2xl border border-white/10 bg-[#0e0f13] text-white shadow-[0_25px_90px_rgba(0,0,0,0.65)] sm:rounded-3xl">
                <div className="flex flex-col gap-4 p-3 sm:gap-6 sm:p-6 lg:flex-row">
                  <div className="flex-1">
                    <header className="flex flex-col gap-2 border-b border-white/5 pb-3 sm:pb-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs uppercase tracking-[0.4em] text-primary/70">Preview</p>
                        <button
                          onClick={onClose}
                          className="lg:hidden rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white touch-manipulation tap-highlight"
                          aria-label="Close preview"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <Dialog.Title className="font-heading text-xl leading-tight text-white sm:text-3xl">
                        {document?.title || 'Document preview'}
                      </Dialog.Title>
                      <div className="flex flex-wrap items-center gap-2">
                        {typeConfig && (
                          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${typeConfig.color.bg} ${typeConfig.color.text} ${typeConfig.color.border}`}>
                            {typeConfig.code}
                          </span>
                        )}
                        <span className="text-xs uppercase tracking-[0.35em] text-slate-500">
                          {document?.category}
                        </span>
                      </div>
                    </header>

                    <div className="mt-3 h-[50vh] overflow-hidden rounded-xl border border-white/5 bg-black/30 p-2 sm:mt-4 sm:h-[65vh] sm:rounded-2xl sm:p-4">
                      {renderPreview()}
                    </div>
                  </div>

                  <aside className="w-full space-y-4 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur sm:space-y-5 sm:rounded-2xl sm:p-5 lg:w-80 lg:max-w-md">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Format</p>
                      <span className="rounded-full bg-black/40 px-3 py-1 text-sm font-semibold text-white">
                        {getFormatLabel(document?.fileType)}
                      </span>
                    </div>
                    <dl className="grid gap-4 text-sm text-slate-300">
                      <div className="flex justify-between">
                        <dt className="text-slate-500">File size</dt>
                        <dd className="font-semibold">{formatFileSize(document?.fileSize)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Version</dt>
                        <dd className="font-semibold">{document?.version}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Owner</dt>
                        <dd className="font-semibold">{document?.author?.name ?? 'Unknown'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Last updated</dt>
                        <dd className="font-semibold">{new Date(document?.updatedAt).toLocaleString()}</dd>
                      </div>
                    </dl>

                    <div className="space-y-2 text-xs uppercase tracking-[0.3em] text-slate-500 sm:space-y-3">
                      <p className="text-[0.65rem] text-slate-500">Download options</p>
                      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                        <ActionButton
                          label="PDF"
                          disabled={!formats.pdf}
                          onClick={() => onDownload?.(document, 'pdf')}
                        />
                        <ActionButton
                          label="DOCX"
                          disabled={!formats.docx}
                          onClick={() => onDownload?.(document, 'docx')}
                        />
                        <ActionButton
                          label="DOC"
                          disabled={!formats.doc}
                          onClick={() => onDownload?.(document, 'doc')}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-primary hover:bg-primary/10 sm:rounded-2xl sm:px-4 sm:py-3 touch-manipulation tap-highlight active:scale-95"
                        aria-label="Print document"
                      >
                        <Printer className="h-4 w-4" />
                        <span className="hidden sm:inline">Print</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDownload?.(document)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-primary/60 bg-primary/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-white sm:rounded-2xl sm:px-4 sm:py-3 touch-manipulation tap-highlight active:scale-95"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="hidden lg:flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 transition hover:border-primary hover:text-white sm:rounded-2xl sm:px-4 sm:py-3 touch-manipulation tap-highlight"
                    >
                      <X className="h-4 w-4" />
                      Close Preview
                    </button>
                  </aside>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PreviewModal;
