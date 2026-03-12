import api from '../lib/api.js';

const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'document';

export const getFormatLabel = (mime = '') => {
  if (!mime) return 'File';
  const normalized = mime.toLowerCase();
  if (normalized.includes('pdf')) return 'PDF';
  if (normalized.includes('officedocument')) return 'DOCX';
  if (normalized.includes('msword')) return 'DOC';
  if (normalized.startsWith('image/')) return 'Image';
  return normalized.toUpperCase().split('/').pop();
};

export const getExtensionFromMime = (mime = '') => {
  if (!mime) return '';
  const normalized = mime.toLowerCase();
  if (normalized.includes('pdf')) return 'pdf';
  if (normalized.includes('officedocument')) return 'docx';
  if (normalized.includes('msword')) return 'doc';
  if (normalized.startsWith('image/')) {
    const ext = normalized.split('/')[1];
    return ext === 'jpeg' ? 'jpg' : ext;
  }
  return '';
};

export const formatFileSize = (bytes = 0) => {
  if (!bytes) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** idx;
  return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
};

const endsWith = (value = '', suffix = '') => value.toLowerCase().split('?')[0].endsWith(suffix);

export const getAvailableFormats = (doc = {}) => {
  const mime = doc?.fileType?.toLowerCase() || '';
  const url = doc?.fileUrl?.toLowerCase() || '';
  return {
    pdf: mime.includes('pdf') || endsWith(url, '.pdf'),
    docx: mime.includes('officedocument') || endsWith(url, '.docx'),
    doc: mime.includes('msword') || endsWith(url, '.doc'),
    image: mime.startsWith('image/') || /\.(png|jpe?g|gif|bmp|webp)$/i.test(url)
  };
};

export const buildFilename = (title = 'document', extension = 'file') => {
  const safeTitle = slugify(title);
  const safeExt = extension.replace(/\.+/, '').toLowerCase();
  return `${safeTitle}.${safeExt || 'file'}`;
};

export const downloadDocumentFile = async ({ doc, preferredExtension } = {}) => {
  if (typeof window === 'undefined') {
    throw new Error('Downloads are not available in this environment');
  }

  if (!doc?.id && !doc?.fileUrl) {
    throw new Error('Document is missing');
  }

  // Use the backend proxy to avoid CORS issues
  if (doc.id) {
    try {
      const response = await api.get(`/documents/${doc.id}/download`, {
        responseType: 'blob'
      });

      const ext = preferredExtension || getExtensionFromMime(doc.fileType) || 'file';
      const filename = buildFilename(doc.title, ext);

      const href = URL.createObjectURL(response.data);
      const anchor = window.document.createElement('a');
      anchor.href = href;
      anchor.download = filename;
      window.document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(href), 4000);
      return;
    } catch (proxyError) {
      console.warn('Proxy download failed, trying direct:', proxyError.message);
      // Fall through to direct download
    }
  }

  // Fallback: direct download (may fail with CORS for external URLs)
  if (!doc.fileUrl) {
    throw new Error('Document file URL is missing');
  }

  const ext = preferredExtension || getExtensionFromMime(doc.fileType) || 'file';
  const filename = buildFilename(doc.title, ext);

  // Try opening in new tab as ultimate fallback
  const anchor = window.document.createElement('a');
  anchor.href = doc.fileUrl;
  anchor.download = filename;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};
