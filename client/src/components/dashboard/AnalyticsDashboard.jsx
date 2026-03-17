import { useMemo, useState, useRef, useEffect } from 'react';
import {
  Bell, ClipboardList, ShieldCheck, AlertTriangle, Eye, FileCheck2,
  ExternalLink, Battery, Box, Cog, Zap, Container, Home, Cpu, Truck,
  X, ChevronRight, ChevronDown, BookOpen, Database, ShieldAlert, Wrench, Users,
  CheckCircle2, Clock, AlertCircle, FileText, Link2, BarChart3, Folder
} from 'lucide-react';
import { DOCUMENT_TYPES, getDocumentTypeConfig } from '../../constants/documentTypes.js';

/* ── Icon Maps ─────────────────────────────────────────────────────── */

const TYPE_ICONS = {
  MN: Bell,
  MI: ClipboardList,
  QI: ShieldCheck,
  QAN: AlertTriangle,
  VA: Eye,
  PCA: FileCheck2
};

const DEPARTMENTS = [
  { key: 'Battery Module', label: 'Battery Module', abbr: 'BM', icon: Battery },
  { key: 'Battery Pack', label: 'Battery Pack', abbr: 'BP', icon: Box },
  { key: 'Drive Unit', label: 'Drive Unit', abbr: 'DU', icon: Cog },
  { key: 'Energy', label: 'Energy', abbr: 'EN', icon: Zap },
  { key: 'Mega Pack', label: 'Mega Pack', abbr: 'MP', icon: Container },
  { key: 'Power Wall', label: 'Power Wall', abbr: 'PW', icon: Home },
  { key: 'PCS', label: 'PCS', abbr: 'PCS', icon: Cpu },
  { key: 'Semi', label: 'Semi', abbr: 'SM', icon: Truck }
];

/* ── SVG Icons ─────────────────────────────────────────────────────── */

const JiraIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.94 4.35 4.34 4.35V2.84A.84.84 0 0021.16 2H11.53z" />
    <path d="M6.77 6.8a4.36 4.36 0 004.34 4.34h1.8v1.72a4.36 4.36 0 004.34 4.34V7.63a.84.84 0 00-.84-.83H6.77z" opacity=".85" />
    <path d="M2 11.6a4.36 4.36 0 004.35 4.34h1.78v1.72C8.13 20.06 10.07 22 12.47 22V12.44a.84.84 0 00-.84-.84H2z" opacity=".65" />
  </svg>
);

const ConfluenceIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.04 18.43c-.29.47-.57 1-.57 1a.52.52 0 00.2.7l3.12 1.93a.52.52 0 00.72-.18s.47-.82.99-1.64c1.67-2.63 3.34-2.12 6.35-.67l3.07 1.47a.52.52 0 00.7-.24l1.43-3.36a.52.52 0 00-.26-.68s-1.51-.72-3.07-1.47C9.13 11.67 4.71 14.1 2.04 18.43z" />
    <path d="M21.96 5.57c.29-.47.57-1 .57-1a.52.52 0 00-.2-.7L19.2 1.94a.52.52 0 00-.72.18s-.47.82-.99 1.64c-1.67 2.63-3.34 2.12-6.35.67L8.07 2.96a.52.52 0 00-.7.24L5.94 6.56a.52.52 0 00.26.68s1.51.72 3.07 1.47c5.5 2.63 9.92.2 12.69-3.14z" />
  </svg>
);

/* ── Quick Link Panel Data ─────────────────────────────────────────── */

const QUICK_LINK_DATA = {
  jira: {
    title: 'JIRA Tickets',
    description: 'Active issues and tasks',
    items: [
      { id: 'MFG-1024', title: 'Battery Module Assembly Line B Rework', status: 'In Progress', priority: 'high', assignee: 'J. Martinez', url: 'https://jira.atlassian.net/browse/MFG-1024' },
      { id: 'QA-892', title: 'QAN Review - Drive Unit Torque Spec Update', status: 'Open', priority: 'critical', assignee: 'S. Chen', url: 'https://jira.atlassian.net/browse/QA-892' },
      { id: 'MFG-1031', title: 'PCA Approval Pending - Mega Pack Weld Fixture', status: 'In Review', priority: 'medium', assignee: 'R. Patel', url: 'https://jira.atlassian.net/browse/MFG-1031' },
      { id: 'QA-901', title: 'Visual Aid Update - Semi Brake Assembly', status: 'Open', priority: 'high', assignee: 'A. Kim', url: 'https://jira.atlassian.net/browse/QA-901' },
      { id: 'MFG-1042', title: 'MI Revision - Power Wall Installation Guide', status: 'Done', priority: 'low', assignee: 'T. Williams', url: 'https://jira.atlassian.net/browse/MFG-1042' },
      { id: 'QA-910', title: 'Containment Action - PCS Connector Defect', status: 'In Progress', priority: 'critical', assignee: 'M. Johnson', url: 'https://jira.atlassian.net/browse/QA-910' }
    ]
  },
  confluence: {
    title: 'Confluence Spaces',
    description: 'Documentation and knowledge base',
    items: [
      { id: 'space-1', title: 'Manufacturing Operations Wiki', space: 'MFG-OPS', pages: 142, updated: '2 hours ago', url: 'https://confluence.atlassian.net/display/MFGOPS' },
      { id: 'space-2', title: 'Quality Standards & Procedures', space: 'QA-STD', pages: 89, updated: '1 day ago', url: 'https://confluence.atlassian.net/display/QASTD' },
      { id: 'space-3', title: 'Engineering Change Notices', space: 'ECN', pages: 56, updated: '3 hours ago', url: 'https://confluence.atlassian.net/display/ECN' },
      { id: 'space-4', title: 'Safety & Compliance', space: 'SAFETY', pages: 203, updated: '5 hours ago', url: 'https://confluence.atlassian.net/display/SAFETY' },
      { id: 'space-5', title: 'Training Materials', space: 'TRAIN', pages: 78, updated: '1 week ago', url: 'https://confluence.atlassian.net/display/TRAIN' }
    ]
  },
  sql: {
    title: 'SQL Scripts',
    description: 'Database queries and reports',
    items: [
      { id: 'sql-1', title: 'Daily Production Output Report', category: 'Production', lastRun: '10 min ago', status: 'Active' },
      { id: 'sql-2', title: 'Quality Defect Rate by Department', category: 'Quality', lastRun: '1 hour ago', status: 'Active' },
      { id: 'sql-3', title: 'Document Revision History Audit', category: 'Compliance', lastRun: '3 hours ago', status: 'Active' },
      { id: 'sql-4', title: 'Containment Action Tracker', category: 'Quality', lastRun: '30 min ago', status: 'Active' },
      { id: 'sql-5', title: 'Equipment Downtime Analysis', category: 'Maintenance', lastRun: '2 hours ago', status: 'Scheduled' }
    ]
  },
  containment: {
    title: 'Containment Actions',
    description: 'Active containment and corrective actions',
    items: [
      { id: 'CA-301', title: 'PCS Connector Pin Misalignment', severity: 'Critical', department: 'PCS', dueDate: 'Mar 18, 2026', status: 'Open' },
      { id: 'CA-298', title: 'Battery Module Cell Voltage Deviation', severity: 'High', department: 'Battery Module', dueDate: 'Mar 20, 2026', status: 'In Progress' },
      { id: 'CA-295', title: 'Drive Unit Bearing Noise - Lot 4420', severity: 'Medium', department: 'Drive Unit', dueDate: 'Mar 25, 2026', status: 'In Progress' },
      { id: 'CA-290', title: 'Mega Pack Enclosure Seal Failure', severity: 'High', department: 'Mega Pack', dueDate: 'Mar 19, 2026', status: 'Open' },
      { id: 'CA-288', title: 'Semi Brake Pad Thickness OOS', severity: 'Critical', department: 'Semi', dueDate: 'Mar 17, 2026', status: 'Escalated' }
    ]
  },
  engineering: {
    title: 'Engineering Resources',
    description: 'Tools, specs, and engineering docs',
    items: [
      { id: 'eng-1', title: 'CAD Drawing Library', type: 'Tool', description: 'Access 3D models and technical drawings', icon: Folder },
      { id: 'eng-2', title: 'Material Specifications Database', type: 'Database', description: 'Component and material specs lookup', icon: Database },
      { id: 'eng-3', title: 'Test & Validation Reports', type: 'Reports', description: 'DVP&R and test result archives', icon: FileText },
      { id: 'eng-4', title: 'BOM Management System', type: 'Tool', description: 'Bill of materials and revision control', icon: ClipboardList },
      { id: 'eng-5', title: 'Engineering Change Request Portal', type: 'Portal', description: 'Submit and track ECRs/ECNs', icon: Link2 }
    ]
  },
  leadership: {
    title: 'Leadership Dashboard',
    description: 'KPIs, metrics, and executive reports',
    items: [
      { id: 'lead-1', title: 'Weekly Production Summary', type: 'Report', frequency: 'Weekly', lastUpdated: 'Mar 14, 2026', icon: BarChart3 },
      { id: 'lead-2', title: 'Quality Metrics Dashboard', type: 'Dashboard', frequency: 'Real-time', lastUpdated: 'Live', icon: ShieldCheck },
      { id: 'lead-3', title: 'Headcount & Capacity Planning', type: 'Report', frequency: 'Monthly', lastUpdated: 'Mar 1, 2026', icon: Users },
      { id: 'lead-4', title: 'Safety Incident Tracker', type: 'Dashboard', frequency: 'Real-time', lastUpdated: 'Live', icon: AlertTriangle },
      { id: 'lead-5', title: 'Cost Reduction Initiatives', type: 'Report', frequency: 'Quarterly', lastUpdated: 'Q1 2026', icon: FileText }
    ]
  }
};

const QUICK_LINKS = [
  { key: 'jira', label: 'JIRA', icon: JiraIcon, color: '#2684FF' },
  { key: 'confluence', label: 'Confluence', icon: ConfluenceIcon, color: '#1868DB' },
  { key: 'sql', label: 'SQL Script', icon: Database, color: '#F59E0B' },
  { key: 'containment', label: 'Containment', icon: ShieldAlert, color: '#EF4444' },
  { key: 'engineering', label: 'Engineering', icon: Wrench, color: '#10B981' },
  { key: 'leadership', label: 'Leadership', icon: Users, color: '#8B5CF6' }
];

/* ── Status / Priority Badges ──────────────────────────────────────── */

const statusColors = {
  'Open': 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  'In Progress': 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  'In Review': 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  'Done': 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  'Escalated': 'border-red-500/30 bg-red-500/10 text-red-400',
  'Active': 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  'Scheduled': 'border-slate-500/30 bg-slate-500/10 text-slate-400'
};

const severityColors = {
  'Critical': 'border-red-500/30 bg-red-500/10 text-red-400',
  'High': 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  'Medium': 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  'Low': 'border-slate-500/30 bg-slate-500/10 text-slate-400'
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-semibold sm:text-2xs ${statusColors[status] || statusColors['Open']}`}>
    {status === 'Done' && <CheckCircle2 className="h-2.5 w-2.5" />}
    {status === 'In Progress' && <Clock className="h-2.5 w-2.5" />}
    {status === 'Escalated' && <AlertCircle className="h-2.5 w-2.5" />}
    {status}
  </span>
);

const PriorityDot = ({ priority }) => (
  <span className={`inline-block h-1.5 w-1.5 rounded-full ${
    priority === 'critical' ? 'bg-red-400 animate-pulse' :
    priority === 'high' ? 'bg-amber-400' :
    priority === 'medium' ? 'bg-blue-400' : 'bg-slate-400'
  }`} title={priority} />
);

/* ── Quick Link Panel Renderers ────────────────────────────────────── */

const JiraPanel = ({ items }) => (
  <div className="space-y-1.5">
    {items.map((item, idx) => (
      <a
        key={item.id}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ animationDelay: `${idx * 60}ms` }}
        className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-2.5 transition-all duration-300 hover:border-[#2684FF]/30 hover:bg-[#2684FF]/5 hover:shadow-md active:scale-[0.99] animate-ql-item sm:p-3"
      >
        <PriorityDot priority={item.priority} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[0.6rem] font-mono font-bold text-[#2684FF] sm:text-2xs">{item.id}</span>
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-300 group-hover:text-white transition-colors sm:text-sm">{item.title}</p>
        </div>
        <span className="hidden text-2xs text-slate-500 sm:block">{item.assignee}</span>
        <ExternalLink className="h-3 w-3 text-slate-600 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-[#2684FF] sm:h-3.5 sm:w-3.5" />
      </a>
    ))}
  </div>
);

const ConfluencePanel = ({ items }) => (
  <div className="space-y-1.5">
    {items.map((item, idx) => (
      <a
        key={item.id}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ animationDelay: `${idx * 60}ms` }}
        className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-2.5 transition-all duration-300 hover:border-[#1868DB]/30 hover:bg-[#1868DB]/5 hover:shadow-md active:scale-[0.99] animate-ql-item sm:p-3"
      >
        <BookOpen className="h-4 w-4 shrink-0 text-[#1868DB] sm:h-5 sm:w-5" />
        <div className="flex-1 min-w-0">
          <p className="truncate text-xs font-medium text-slate-300 group-hover:text-white transition-colors sm:text-sm">{item.title}</p>
          <div className="mt-0.5 flex items-center gap-2 text-[0.6rem] text-slate-500 sm:text-2xs">
            <span className="font-mono text-[#1868DB]/70">{item.space}</span>
            <span>·</span>
            <span>{item.pages} pages</span>
            <span>·</span>
            <span>Updated {item.updated}</span>
          </div>
        </div>
        <ExternalLink className="h-3 w-3 text-slate-600 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-[#1868DB] sm:h-3.5 sm:w-3.5" />
      </a>
    ))}
  </div>
);

const SqlPanel = ({ items }) => (
  <div className="space-y-1.5">
    {items.map((item, idx) => (
      <div
        key={item.id}
        style={{ animationDelay: `${idx * 60}ms` }}
        className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-2.5 transition-all duration-300 hover:border-amber-500/30 hover:bg-amber-500/5 hover:shadow-md cursor-pointer active:scale-[0.99] animate-ql-item sm:p-3"
      >
        <Database className="h-4 w-4 shrink-0 text-amber-500 sm:h-5 sm:w-5" />
        <div className="flex-1 min-w-0">
          <p className="truncate text-xs font-medium text-slate-300 group-hover:text-white transition-colors sm:text-sm">{item.title}</p>
          <div className="mt-0.5 flex items-center gap-2 text-[0.6rem] text-slate-500 sm:text-2xs">
            <span className="text-amber-500/70">{item.category}</span>
            <span>·</span>
            <span>Last run: {item.lastRun}</span>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>
    ))}
  </div>
);

const ContainmentPanel = ({ items }) => (
  <div className="space-y-1.5">
    {items.map((item, idx) => (
      <div
        key={item.id}
        style={{ animationDelay: `${idx * 60}ms` }}
        className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-2.5 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/5 hover:shadow-md cursor-pointer active:scale-[0.99] animate-ql-item sm:p-3"
      >
        <ShieldAlert className={`h-4 w-4 shrink-0 sm:h-5 sm:w-5 ${item.severity === 'Critical' ? 'text-red-400 animate-pulse' : 'text-red-400/70'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[0.6rem] font-mono font-bold text-red-400 sm:text-2xs">{item.id}</span>
            <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[0.6rem] font-semibold sm:text-2xs ${severityColors[item.severity]}`}>{item.severity}</span>
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-300 group-hover:text-white transition-colors sm:text-sm">{item.title}</p>
          <div className="mt-0.5 flex items-center gap-2 text-[0.6rem] text-slate-500 sm:text-2xs">
            <span>{item.department}</span>
            <span>·</span>
            <span>Due: {item.dueDate}</span>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>
    ))}
  </div>
);

const EngineeringPanel = ({ items }) => (
  <div className="grid gap-1.5 sm:grid-cols-2">
    {items.map((item, idx) => {
      const ItemIcon = item.icon;
      return (
        <div
          key={item.id}
          style={{ animationDelay: `${idx * 60}ms` }}
          className="group flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:shadow-md cursor-pointer active:scale-[0.99] animate-ql-item sm:p-3.5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 transition-all duration-300 group-hover:bg-emerald-500/20 group-hover:scale-110 sm:h-10 sm:w-10">
            <ItemIcon className="h-4 w-4 text-emerald-400 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors sm:text-sm">{item.title}</p>
            <p className="mt-0.5 text-[0.6rem] text-slate-500 sm:text-2xs">{item.description}</p>
            <span className="mt-1 inline-flex rounded-md border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-0.5 text-[0.55rem] font-semibold text-emerald-400 sm:text-[0.6rem]">{item.type}</span>
          </div>
        </div>
      );
    })}
  </div>
);

const LeadershipPanel = ({ items }) => (
  <div className="grid gap-1.5 sm:grid-cols-2">
    {items.map((item, idx) => {
      const ItemIcon = item.icon;
      return (
        <div
          key={item.id}
          style={{ animationDelay: `${idx * 60}ms` }}
          className="group flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-500/5 hover:shadow-md cursor-pointer active:scale-[0.99] animate-ql-item sm:p-3.5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 transition-all duration-300 group-hover:bg-purple-500/20 group-hover:scale-110 sm:h-10 sm:w-10">
            <ItemIcon className="h-4 w-4 text-purple-400 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors sm:text-sm">{item.title}</p>
            <div className="mt-0.5 flex items-center gap-2 text-[0.6rem] text-slate-500 sm:text-2xs">
              <span className="text-purple-400/70">{item.frequency}</span>
              <span>·</span>
              <span>{item.lastUpdated}</span>
            </div>
            <span className="mt-1 inline-flex rounded-md border border-purple-500/20 bg-purple-500/5 px-1.5 py-0.5 text-[0.55rem] font-semibold text-purple-400 sm:text-[0.6rem]">{item.type}</span>
          </div>
        </div>
      );
    })}
  </div>
);

const PANEL_RENDERERS = {
  jira: JiraPanel,
  confluence: ConfluencePanel,
  sql: SqlPanel,
  containment: ContainmentPanel,
  engineering: EngineeringPanel,
  leadership: LeadershipPanel
};

/* ── Component ─────────────────────────────────────────────────────── */

const AnalyticsDashboard = ({
  overview,
  loading,
  activeType = '',
  onTypeClick,
  activeCategory = '',
  onCategoryClick
}) => {
  const [expandedLink, setExpandedLink] = useState(null);
  const panelRef = useRef(null);

  const analytics = useMemo(() => {
    if (!overview) return null;

    const total = overview.totals?.totalDocuments || 0;
    const mfg = overview.totals?.manufacturingCount || 0;
    const quality = overview.totals?.qualityCount || 0;

    const typeBreakdown = (overview.typeBreakdown || []).map((item) => {
      const config = getDocumentTypeConfig(item.type);
      return {
        type: item.type,
        count: item.count,
        name: config.name,
        code: config.code,
        color: config.color
      };
    }).sort((a, b) => b.count - a.count);

    return { total, mfg, quality, categories: overview.categoryBreakdown || [], typeBreakdown };
  }, [overview]);

  // Close panel on outside click
  useEffect(() => {
    if (!expandedLink) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setExpandedLink(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [expandedLink]);

  // Close panel on Escape key
  useEffect(() => {
    if (!expandedLink) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setExpandedLink(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [expandedLink]);

  const toggleLink = (key) => {
    setExpandedLink((prev) => (prev === key ? null : key));
  };

  /* ── Loading skeleton ──────────────────────────────────────────── */

  if (loading || !analytics) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="grid gap-2 grid-cols-3 md:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-xl bg-white/5" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
        <div className="grid gap-2 grid-cols-3 md:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  const activeTypeConfig = activeType ? DOCUMENT_TYPES[activeType] : null;
  const activeLinkData = expandedLink ? QUICK_LINK_DATA[expandedLink] : null;
  const activeLinkConfig = expandedLink ? QUICK_LINKS.find(l => l.key === expandedLink) : null;
  const PanelRenderer = expandedLink ? PANEL_RENDERERS[expandedLink] : null;

  return (
    <section className="space-y-3 sm:space-y-4 md:space-y-5">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="min-w-0">
            <p className="text-2xs uppercase tracking-[0.3em] text-primary/70 sm:text-xs">Analytics</p>
            <h2 className="font-heading text-lg text-white sm:text-2xl">Real-time insights</h2>
          </div>
        </div>

        {/* Quick Links Toolbar */}
        <div className="relative" ref={panelRef}>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide sm:gap-2">
            {QUICK_LINKS.map((link, idx) => {
              const LinkIcon = link.icon;
              const isActive = expandedLink === link.key;
              return (
                <button
                  key={link.key}
                  type="button"
                  onClick={() => toggleLink(link.key)}
                  style={{ animationDelay: `${idx * 50}ms`, borderColor: isActive ? `${link.color}60` : `${link.color}20`, backgroundColor: isActive ? `${link.color}18` : `${link.color}08` }}
                  className={`group flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-2xs font-semibold transition-all duration-300 hover:shadow-md active:scale-95 sm:gap-2 sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-xs touch-manipulation animate-scale-in ${isActive ? 'shadow-lg ring-1' : ''}`}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = `${link.color}18`; e.currentTarget.style.borderColor = `${link.color}40`; }}}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.backgroundColor = `${link.color}08`; e.currentTarget.style.borderColor = `${link.color}20`; }}}
                >
                  <LinkIcon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} style={{ color: link.color }} />
                  <span className="whitespace-nowrap" style={{ color: link.color }}>{link.label}</span>
                  <ChevronDown
                    className={`h-2.5 w-2.5 transition-transform duration-300 sm:h-3 sm:w-3 ${isActive ? 'rotate-180' : ''}`}
                    style={{ color: link.color }}
                  />
                </button>
              );
            })}
          </div>

          {/* ── Expanded Panel ──────────────────────────────────────── */}
          {expandedLink && activeLinkData && PanelRenderer && (
            <div
              className="mt-2 rounded-xl border bg-[#15161b] shadow-2xl shadow-black/40 overflow-hidden animate-ql-panel sm:rounded-2xl"
              style={{ borderColor: `${activeLinkConfig.color}20` }}
            >
              {/* Panel Header */}
              <div
                className="flex items-center justify-between px-3.5 py-2.5 sm:px-5 sm:py-3"
                style={{ background: `linear-gradient(135deg, ${activeLinkConfig.color}08, transparent)` }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9"
                    style={{ backgroundColor: `${activeLinkConfig.color}15`, border: `1px solid ${activeLinkConfig.color}30` }}
                  >
                    <activeLinkConfig.icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: activeLinkConfig.color }} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white sm:text-sm">{activeLinkData.title}</h3>
                    <p className="text-[0.6rem] text-slate-500 sm:text-2xs">{activeLinkData.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedLink(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-90 sm:h-8 sm:w-8"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="max-h-[50vh] overflow-y-auto px-3 pb-3 sm:px-4 sm:pb-4 scrollbar-hide">
                <PanelRenderer items={activeLinkData.items} />
              </div>

              {/* Panel Footer */}
              <div
                className="border-t px-3.5 py-2 text-center sm:px-5 sm:py-2.5"
                style={{ borderColor: `${activeLinkConfig.color}15` }}
              >
                <span className="text-[0.6rem] text-slate-500 sm:text-2xs">
                  Showing {activeLinkData.items.length} items · Click any item to open
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Active Filter Breadcrumb ───────────────────────────────── */}
      {(activeType || activeCategory) && (
        <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 sm:rounded-xl sm:px-4 sm:py-2.5 animate-ql-panel">
          <span className="text-2xs text-slate-500 sm:text-xs">Filtering:</span>
          <div className="flex items-center gap-1.5">
            {activeType && (
              <button
                type="button"
                onClick={() => onTypeClick?.(activeType)}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-2xs font-semibold transition-all duration-200 hover:opacity-80 active:scale-95 sm:text-xs ${activeTypeConfig?.color.bg} ${activeTypeConfig?.color.text} ${activeTypeConfig?.color.border}`}
              >
                {activeType}
                <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </button>
            )}
            {activeType && activeCategory && (
              <ChevronRight className="h-3 w-3 text-slate-600" />
            )}
            {activeCategory && (
              <button
                type="button"
                onClick={() => onCategoryClick?.('')}
                className="inline-flex items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 text-2xs font-semibold text-primary transition-all duration-200 hover:opacity-80 active:scale-95 sm:text-xs"
              >
                {activeCategory}
                <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Document Type Cards ─────────────────────────────────────── */}
      <div className="grid gap-2 grid-cols-3 sm:gap-2.5 md:grid-cols-6">
        {Object.values(DOCUMENT_TYPES).map((dt, idx) => {
          const Icon = TYPE_ICONS[dt.code];
          const match = analytics.typeBreakdown.find((t) => t.code === dt.code);
          const count = match?.count ?? 0;
          const isActive = activeType === dt.code;
          const hasActive = !!activeType;

          return (
            <button
              key={dt.code}
              type="button"
              onClick={() => onTypeClick?.(dt.code)}
              style={{ animationDelay: `${idx * 70}ms` }}
              className={`group relative flex flex-col items-center rounded-xl border p-2.5 touch-manipulation sm:rounded-2xl sm:p-3.5
                transition-all duration-300 ease-out animate-stagger-up
                ${isActive
                  ? 'border-primary/50 bg-primary/10 ring-2 ring-primary/30 shadow-xl shadow-primary/15 scale-105'
                  : hasActive
                    ? 'border-white/5 bg-white/[0.02] opacity-40 hover:opacity-70 hover:bg-white/[0.04] active:scale-95'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 hover:shadow-md hover:-translate-y-0.5 active:scale-95'
                }`}
            >
              {isActive && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary sm:h-3 sm:w-3">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/50" />
                </span>
              )}
              {Icon && (
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:scale-110 ${isActive ? 'text-primary drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]' : 'text-slate-400'}`} />
              )}
              <span className={`mt-1 text-2xs font-bold sm:text-xs transition-colors duration-300 ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                {dt.code}
              </span>
              <span className={`font-heading text-lg leading-none sm:text-xl transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Department Picker ──────────────────────────────────────── */}
      {activeType && (
        <div className="rounded-xl border border-white/5 bg-[#13141a] shadow-lg shadow-black/30 sm:rounded-2xl animate-ql-panel">
          <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-2xs font-bold text-primary sm:text-xs">
                {activeType}
              </span>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <span className={`text-2xs sm:text-xs transition-colors duration-200 ${activeCategory ? 'text-primary font-medium' : 'text-slate-400'}`}>
                {activeCategory || 'Select a department'}
              </span>
            </div>
            {activeCategory && (
              <button
                type="button"
                onClick={() => onCategoryClick?.('')}
                className="flex items-center gap-1 rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-2xs text-slate-500 transition-all duration-200 hover:bg-white/[0.06] hover:text-white sm:text-xs"
              >
                Clear
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-1.5 px-3 pb-3 sm:grid-cols-8 sm:gap-2 sm:px-4 sm:pb-4">
            {DEPARTMENTS.map((dept, idx) => {
              const DeptIcon = dept.icon;
              const isDeptActive = activeCategory === dept.key;
              const hasDeptActive = !!activeCategory;

              return (
                <button
                  key={dept.key}
                  type="button"
                  onClick={() => onCategoryClick?.(isDeptActive ? '' : dept.key)}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className={`group flex flex-col items-center gap-1 rounded-lg border p-2 touch-manipulation sm:rounded-xl sm:p-3
                    transition-all duration-300 ease-out animate-scale-in
                    ${isDeptActive
                      ? 'border-primary/40 bg-primary/10 text-primary shadow-lg shadow-primary/10 scale-105 ring-1 ring-primary/30'
                      : hasDeptActive
                        ? 'border-white/5 bg-white/[0.02] text-slate-500 opacity-40 hover:opacity-70 hover:bg-white/[0.04] active:scale-95'
                        : 'border-white/5 bg-white/[0.02] text-slate-500 hover:border-white/10 hover:bg-white/[0.05] hover:text-white hover:-translate-y-0.5 hover:shadow-md active:scale-95'
                    }`}
                >
                  <DeptIcon className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 group-hover:scale-110 ${isDeptActive ? 'text-primary drop-shadow-[0_0_6px_rgba(239,68,68,0.3)]' : ''}`} />
                  <span className="text-center text-[0.55rem] font-medium leading-tight sm:text-2xs">{dept.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default AnalyticsDashboard;
