import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TextPreviewModal = ({ open, document, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const CHARS_PER_PAGE = 2000;

  // Reset page when modal opens
  useEffect(() => {
    if (open) {
      setCurrentPage(1);
    }
  }, [open]);

  const { totalPages, currentContent } = useMemo(() => {
    if (!document?.textContent) {
      console.warn('No textContent in document:', document?.title);
      return { totalPages: 0, currentContent: '' };
    }

    const text = document.textContent;
    const pages = Math.ceil(text.length / CHARS_PER_PAGE);
    const start = (currentPage - 1) * CHARS_PER_PAGE;
    const end = start + CHARS_PER_PAGE;
    const content = text.substring(start, end);

    console.log('Text Preview - Pages:', pages, 'Current Page:', currentPage, 'Text Length:', text.length);
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

        <div className="fixed inset-0 overflow-y-auto p-4">
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
              <Dialog.Panel className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0e0f13] text-white shadow-[0_25px_90px_rgba(0,0,0,0.65)] sm:rounded-3xl">
                <div className="flex flex-col gap-4 p-3 sm:gap-6 sm:p-6">
                  {/* Header */}
                  <header className="flex flex-col gap-2 border-b border-white/5 pb-3 sm:pb-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-primary/70">Text Preview</p>
                    <Dialog.Title className="font-heading text-xl leading-tight text-white sm:text-3xl">
                      {document?.title || 'Document preview'}
                    </Dialog.Title>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      {document?.category} · {document?.documentType}
                    </p>
                  </header>

                  {/* Content Area */}
                  <div className="min-h-[50vh] rounded-xl border border-white/5 bg-black/30 p-4 sm:min-h-[60vh] sm:rounded-2xl sm:p-6">
                    {totalPages > 0 ? (
                      <div className="flex flex-col gap-4 h-full">
                        {/* Text Content */}
                        <div className="flex-1 overflow-y-auto rounded-lg bg-white/5 p-4 text-sm leading-relaxed text-slate-200 sm:text-base">
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
                              title="Previous page"
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
                              title="Next page"
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
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        No text content available for preview.
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 transition hover:border-primary hover:text-white sm:rounded-2xl sm:px-4 sm:py-3"
                  >
                    Close Preview
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TextPreviewModal;
