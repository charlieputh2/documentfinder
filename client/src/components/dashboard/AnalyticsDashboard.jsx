import { useMemo } from 'react';

const AnalyticsDashboard = ({ overview, loading }) => {
  // Calculate analytics data
  const analytics = useMemo(() => {
    if (!overview) return null;

    const total = overview.totals?.totalDocuments || 0;
    const mfg = overview.totals?.manufacturingCount || 0;
    const quality = overview.totals?.qualityCount || 0;
    const mfgPercent = total > 0 ? Math.round((mfg / total) * 100) : 0;
    const qualityPercent = total > 0 ? Math.round((quality / total) * 100) : 0;

    return {
      total,
      mfg,
      quality,
      mfgPercent,
      qualityPercent,
      categories: overview.categoryBreakdown || []
    };
  }, [overview]);

  if (loading || !analytics) {
    return (
      <div className="grid gap-3 sm:gap-4 md:gap-6 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-lg bg-white/5 sm:rounded-2xl" />
        <div className="h-64 animate-pulse rounded-lg bg-white/5 sm:rounded-2xl" />
      </div>
    );
  }

  // Simple bar chart for document types
  const maxCount = Math.max(analytics.mfg, analytics.quality, 1);
  const mfgHeight = (analytics.mfg / maxCount) * 100;
  const qualityHeight = (analytics.quality / maxCount) * 100;

  // Category distribution
  const topCategories = analytics.categories.slice(0, 5);
  const maxCategoryCount = Math.max(...topCategories.map(c => c.count), 1);

  return (
    <section className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Analytics Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary/80">Analytics</p>
        <h2 className="font-heading text-xl text-white sm:text-2xl">Real-time insights</h2>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Document Types Chart */}
        <div className="rounded-lg border border-white/5 bg-[#15161b] p-4 shadow-lg shadow-black/40 sm:rounded-2xl sm:p-6">
          <div className="mb-4 sm:mb-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Document Types</p>
            <h3 className="font-heading text-lg text-white sm:text-xl">Distribution</h3>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Manufacturing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-300">Manufacturing</span>
                <span className="font-semibold text-primary">{analytics.mfg} ({analytics.mfgPercent}%)</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10 sm:h-3">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                  style={{ width: `${analytics.mfgPercent}%` }}
                />
              </div>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-300">Quality</span>
                <span className="font-semibold text-emerald-400">{analytics.quality} ({analytics.qualityPercent}%)</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10 sm:h-3">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-400/60 transition-all duration-500"
                  style={{ width: `${analytics.qualityPercent}%` }}
                />
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-white/5 pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Total Documents</span>
                <span className="font-heading text-2xl text-white sm:text-3xl">{analytics.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="rounded-lg border border-white/5 bg-[#15161b] p-4 shadow-lg shadow-black/40 sm:rounded-2xl sm:p-6">
          <div className="mb-4 sm:mb-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Top Categories</p>
            <h3 className="font-heading text-lg text-white sm:text-xl">By count</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {topCategories.length > 0 ? (
              topCategories.map((category, idx) => (
                <div key={category.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="truncate text-slate-300">{category.category}</span>
                    <span className="ml-2 whitespace-nowrap font-semibold text-white">{category.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10 sm:h-3">
                    <div
                      className={`h-full transition-all duration-500 ${
                        idx === 0
                          ? 'bg-gradient-to-r from-primary to-primary/60'
                          : idx === 1
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-400/60'
                          : idx === 2
                          ? 'bg-gradient-to-r from-blue-400 to-blue-400/60'
                          : idx === 3
                          ? 'bg-gradient-to-r from-purple-400 to-purple-400/60'
                          : 'bg-gradient-to-r from-cyan-400 to-cyan-400/60'
                      }`}
                      style={{ width: `${(category.count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No categories yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
        <div className="rounded-lg border border-white/5 bg-gradient-to-br from-primary/10 to-primary/5 p-3 sm:rounded-2xl sm:p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Mfg Docs</p>
          <p className="mt-2 font-heading text-xl text-primary sm:text-2xl">{analytics.mfg}</p>
          <p className="mt-1 text-xs text-slate-500">{analytics.mfgPercent}% of total</p>
        </div>

        <div className="rounded-lg border border-white/5 bg-gradient-to-br from-emerald-400/10 to-emerald-400/5 p-3 sm:rounded-2xl sm:p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Quality Docs</p>
          <p className="mt-2 font-heading text-xl text-emerald-400 sm:text-2xl">{analytics.quality}</p>
          <p className="mt-1 text-xs text-slate-500">{analytics.qualityPercent}% of total</p>
        </div>

        <div className="rounded-lg border border-white/5 bg-gradient-to-br from-blue-400/10 to-blue-400/5 p-3 sm:rounded-2xl sm:p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Categories</p>
          <p className="mt-2 font-heading text-xl text-blue-400 sm:text-2xl">{analytics.categories.length}</p>
          <p className="mt-1 text-xs text-slate-500">Total active</p>
        </div>

        <div className="rounded-lg border border-white/5 bg-gradient-to-br from-purple-400/10 to-purple-400/5 p-3 sm:rounded-2xl sm:p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Total Docs</p>
          <p className="mt-2 font-heading text-xl text-purple-400 sm:text-2xl">{analytics.total}</p>
          <p className="mt-1 text-xs text-slate-500">All documents</p>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
