import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import api from '../../lib/api.js';

dayjs.extend(relativeTime);

const actionLabels = {
  DOCUMENT_CREATED: 'Created',
  DOCUMENT_UPDATED: 'Updated',
  DOCUMENT_DELETED: 'Deleted',
  BULK_UPLOAD: 'Bulk upload',
  CSV_IMPORT: 'CSV import',
  USER_REGISTERED: 'Registered',
  USER_VERIFIED: 'Verified',
  USER_LOGGED_IN: 'Logged in',
  PASSWORD_CHANGED: 'Password changed',
  USER_UPDATED: 'User updated',
  USER_DEACTIVATED: 'Deactivated',
  USER_REACTIVATED: 'Reactivated'
};

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await api.get('/documents/activity');
        setActivities(data || []);
      } catch (error) {
        console.error('Activity feed error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
    const interval = setInterval(fetchActivity, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/5 bg-[#15161b] p-4 sm:p-6">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Activity</p>
          <h3 className="font-heading text-lg text-white">Recent actions</h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-white/10" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 rounded bg-white/5" />
                <div className="h-2.5 w-1/2 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/5 bg-[#15161b] p-4 sm:p-6">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Activity</p>
        <h3 className="font-heading text-lg text-white sm:text-xl">Recent actions</h3>
      </div>

      {activities.length === 0 ? (
        <p className="py-4 text-sm text-slate-500">No recent activity.</p>
      ) : (
        <div className="space-y-1">
          {activities.slice(0, 10).map((activity) => (
            <div key={activity.id} className="group flex items-start gap-3 rounded-xl px-2 py-2 transition hover:bg-white/[0.03]">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-300 sm:text-sm">
                  <span className="font-semibold text-white">
                    {actionLabels[activity.action] || activity.action?.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
                </p>
                <p className="truncate text-[0.65rem] text-slate-500 sm:text-xs">{activity.description}</p>
              </div>
              <span className="shrink-0 text-[0.6rem] text-slate-600 sm:text-xs">{dayjs(activity.createdAt).fromNow()}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ActivityFeed;
