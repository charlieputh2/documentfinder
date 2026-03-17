/**
 * Document Type Constants and Utilities
 * Tesla red / white / gray palette only
 */

export const DOCUMENT_TYPES = {
  MN: {
    code: 'MN',
    name: 'Manufacturing Notice',
    description: 'Critical notifications and alerts for manufacturing processes',
    color: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/20',
      hoverBg: 'hover:bg-primary/15',
      badge: 'bg-primary/20'
    },
    icon: '',
    category: 'manufacturing'
  },
  MI: {
    code: 'MI',
    name: 'Manufacturing Instructions',
    description: 'Detailed step-by-step manufacturing procedures and guidelines',
    color: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/20',
      hoverBg: 'hover:bg-primary/15',
      badge: 'bg-primary/20'
    },
    icon: '',
    category: 'manufacturing'
  },
  QI: {
    code: 'QI',
    name: 'Quality Instructions',
    description: 'Quality control procedures and inspection guidelines',
    color: {
      bg: 'bg-white/5',
      text: 'text-white',
      border: 'border-white/10',
      hoverBg: 'hover:bg-white/10',
      badge: 'bg-white/10'
    },
    icon: '',
    category: 'quality'
  },
  QAN: {
    code: 'QAN',
    name: 'Quality Alert Notice',
    description: 'Quality alerts and non-conformance notifications',
    color: {
      bg: 'bg-white/5',
      text: 'text-white',
      border: 'border-white/10',
      hoverBg: 'hover:bg-white/10',
      badge: 'bg-white/10'
    },
    icon: '',
    category: 'quality'
  },
  VA: {
    code: 'VA',
    name: 'Visual Aid',
    description: 'Visual references, diagrams, and instructional images',
    color: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-300',
      border: 'border-slate-500/20',
      hoverBg: 'hover:bg-slate-500/15',
      badge: 'bg-slate-500/15'
    },
    icon: '',
    category: 'visual'
  },
  PCA: {
    code: 'PCA',
    name: 'Process Change Approval',
    description: 'Process modification requests and change control documentation',
    color: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-300',
      border: 'border-slate-500/20',
      hoverBg: 'hover:bg-slate-500/15',
      badge: 'bg-slate-500/15'
    },
    icon: '',
    category: 'approval'
  }
};

// Legacy support for manufacturing/quality
export const LEGACY_TYPES = {
  manufacturing: {
    code: 'MFG',
    name: 'Manufacturing',
    description: 'General manufacturing documentation',
    color: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/20',
      hoverBg: 'hover:bg-primary/15',
      badge: 'bg-primary/20'
    },
    icon: '',
    category: 'manufacturing'
  },
  quality: {
    code: 'QC',
    name: 'Quality Control',
    description: 'General quality documentation',
    color: {
      bg: 'bg-white/5',
      text: 'text-white',
      border: 'border-white/10',
      hoverBg: 'hover:bg-white/10',
      badge: 'bg-white/10'
    },
    icon: '',
    category: 'quality'
  }
};

/**
 * Get document type configuration
 * @param {string} type - Document type code (MN, MI, QI, etc.)
 * @returns {object} Document type configuration
 */
export const getDocumentTypeConfig = (type) => {
  if (!type) return null;

  const normalized = type.toUpperCase().trim();

  if (DOCUMENT_TYPES[normalized]) {
    return DOCUMENT_TYPES[normalized];
  }

  const legacyKey = type.toLowerCase();
  if (LEGACY_TYPES[legacyKey]) {
    return LEGACY_TYPES[legacyKey];
  }

  return {
    code: normalized,
    name: type,
    description: 'Document',
    color: {
      bg: 'bg-white/5',
      text: 'text-slate-400',
      border: 'border-white/10',
      hoverBg: 'hover:bg-white/10',
      badge: 'bg-white/10'
    },
    icon: '',
    category: 'other'
  };
};

/**
 * Get all available document types for filters
 */
export const getAllDocumentTypes = () => {
  return [
    { value: '', label: 'All Types' },
    ...Object.values(DOCUMENT_TYPES).map(type => ({
      value: type.code,
      label: `${type.code} - ${type.name}`,
      category: type.category
    }))
  ];
};

/**
 * Get document types grouped by category
 */
export const getDocumentTypesByCategory = () => {
  const grouped = {
    manufacturing: [],
    quality: [],
    visual: [],
    approval: [],
    other: []
  };

  Object.values(DOCUMENT_TYPES).forEach(type => {
    if (grouped[type.category]) {
      grouped[type.category].push(type);
    } else {
      grouped.other.push(type);
    }
  });

  return grouped;
};

/**
 * Validate if a document type code is valid
 */
export const isValidDocumentType = (type) => {
  if (!type) return false;
  const normalized = type.toUpperCase().trim();
  return DOCUMENT_TYPES[normalized] !== undefined || LEGACY_TYPES[type.toLowerCase()] !== undefined;
};

/**
 * Get badge classes for a document type
 */
export const getDocumentTypeBadgeClasses = (type) => {
  const config = getDocumentTypeConfig(type);
  return `${config.color.bg} ${config.color.text} ${config.color.border}`;
};

/**
 * Get icon for document type
 */
export const getDocumentTypeIcon = (type) => {
  const config = getDocumentTypeConfig(type);
  return config.icon;
};
