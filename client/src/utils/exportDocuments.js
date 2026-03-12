import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
import { getFormatLabel, formatFileSize } from './documents.js';
import { getDocumentTypeConfig } from '../constants/documentTypes.js';

/**
 * Prepare document rows for export
 */
const prepareRows = (documents) =>
  documents.map((doc) => {
    const typeConfig = getDocumentTypeConfig(doc.documentType);
    return {
      title: doc.title || '',
      type: typeConfig ? `${typeConfig.code} - ${typeConfig.name}` : doc.documentType || '',
      category: doc.category || '',
      format: getFormatLabel(doc.fileType),
      fileSize: formatFileSize(doc.fileSize),
      owner: doc.author?.name ?? 'Unknown',
      version: doc.version || '1.0.0',
      updatedAt: doc.updatedAt ? dayjs(doc.updatedAt).format('DD MMM YYYY') : ''
    };
  });

const COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'type', label: 'Document Type' },
  { key: 'category', label: 'Category' },
  { key: 'format', label: 'Format' },
  { key: 'fileSize', label: 'File Size' },
  { key: 'owner', label: 'Owner' },
  { key: 'version', label: 'Version' },
  { key: 'updatedAt', label: 'Last Updated' }
];

// ── CSV Export ────────────────────────────────────────────────────────

const escapeCSV = (value) => {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const exportToCSV = (documents) => {
  const rows = prepareRows(documents);
  const header = COLUMNS.map((c) => escapeCSV(c.label)).join(',');
  const body = rows
    .map((row) => COLUMNS.map((c) => escapeCSV(row[c.key])).join(','))
    .join('\n');

  const csv = `${header}\n${body}`;
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `documents-export-${dayjs().format('YYYY-MM-DD')}.csv`);
};

// ── PDF Export ────────────────────────────────────────────────────────

export const exportToPDF = (documents) => {
  const rows = prepareRows(documents);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Document Library Export', 14, 18);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated on ${dayjs().format('MMMM D, YYYY [at] h:mm A')}`, 14, 25);
  doc.text(`Total documents: ${documents.length}`, 14, 30);

  // Table
  autoTable(doc, {
    startY: 36,
    head: [COLUMNS.map((c) => c.label)],
    body: rows.map((row) => COLUMNS.map((c) => row[c.key])),
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [220, 220, 220],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 20 },
      4: { cellWidth: 22 },
      5: { cellWidth: 35 },
      6: { cellWidth: 20 },
      7: { cellWidth: 28 }
    },
    didDrawPage: (data) => {
      // Footer with page number
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 8
      );
      doc.text(
        'Document Finder - Confidential',
        doc.internal.pageSize.width - data.settings.margin.right - 45,
        doc.internal.pageSize.height - 8
      );
    }
  });

  doc.save(`documents-export-${dayjs().format('YYYY-MM-DD')}.pdf`);
};

// ── Word/DOC Export ──────────────────────────────────────────────────

export const exportToWord = (documents) => {
  const rows = prepareRows(documents);

  const tableRows = rows
    .map(
      (row) => `
    <tr>
      ${COLUMNS.map(
        (c) => `<td style="border:1px solid #ccc;padding:6px 10px;font-size:11px;">${row[c.key]}</td>`
      ).join('')}
    </tr>`
    )
    .join('');

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Calibri, Arial, sans-serif; color: #333; margin: 20px; }
        h1 { font-size: 22px; color: #1e3a8a; margin-bottom: 4px; }
        .meta { font-size: 11px; color: #888; margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; margin-top: 8px; }
        th { background-color: #1e3a8a; color: white; padding: 8px 10px; font-size: 11px; text-align: left; border: 1px solid #1e3a8a; }
        td { border: 1px solid #ccc; padding: 6px 10px; font-size: 11px; }
        tr:nth-child(even) td { background-color: #f5f7fa; }
      </style>
    </head>
    <body>
      <h1>Document Library Export</h1>
      <p class="meta">Generated on ${dayjs().format('MMMM D, YYYY [at] h:mm A')} &bull; ${documents.length} documents</p>
      <table>
        <thead>
          <tr>${COLUMNS.map((c) => `<th>${c.label}</th>`).join('')}</tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + html], {
    type: 'application/msword'
  });
  downloadBlob(blob, `documents-export-${dayjs().format('YYYY-MM-DD')}.doc`);
};

// ── Shared download helper ───────────────────────────────────────────

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = filename;
  window.document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
};
