import dayjs from 'dayjs';

const RecentDocuments = ({ documents = [], onPreview, onDownload }) => (
  <section className="rounded-lg border border-white/5 bg-[#15161b] p-3 shadow-lg shadow-black/40 sm:rounded-2xl sm:p-6">
    <div className="mb-3 flex items-center justify-between sm:mb-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Recent</p>
        <h3 className="font-heading text-lg text-white sm:text-xl lg:text-2xl">Latest uploads</h3>
      </div>
    </div>

    {documents.length === 0 ? (
      <p className="py-4 text-xs text-slate-500 sm:py-6 sm:text-sm">No recent documents yet.</p>
    ) : (
      <ul className="space-y-2 sm:space-y-4">
        {documents.map((doc) => (
          <li key={doc.id} className="flex flex-col gap-2 rounded-lg border border-white/5 bg-white/5 p-3 text-xs text-slate-300 sm:gap-3 sm:rounded-2xl sm:p-4 sm:text-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{doc.title}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{doc.category} · {doc.documentType}</p>
            </div>
            <div className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-slate-500 sm:gap-2 lg:flex-row lg:items-center lg:gap-4">
              <span className="whitespace-nowrap">{dayjs(doc.createdAt).format('DD MMM, HH:mm')}</span>
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                <button
                  type="button"
                  onClick={() => onPreview?.(doc)}
                  className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-primary hover:bg-primary/10 sm:rounded-full sm:px-4 sm:py-2"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => onDownload?.(doc)}
                  className="rounded-lg border border-primary/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-white sm:rounded-full sm:px-4 sm:py-2"
                >
                  Download
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default RecentDocuments;
