// src/utils/pdf.js
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Generate a simple table-based PDF
 *
 * @param {string} title - Document title
 * @param {string[]} headers - Table headers
 * @param {Array<Array<string | number>>} rows - Table body rows
 * @param {Object} options - Optional config
 */
export function generateTablePDF(
  title,
  headers = [],
  rows = [],
  options = {}
) {
  const {
    orientation = "portrait",
    unit = "mm",
    format = "a4",
    fileName,
  } = options;

  const doc = new jsPDF({ orientation, unit, format });

  // -------------------------
  // TITLE
  // -------------------------
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  // -------------------------
  // TABLE
  // -------------------------
  doc.autoTable({
    startY: 30,
    head: [headers],
    body: rows,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [0, 119, 182], // theme color
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // -------------------------
  // FOOTER
  // -------------------------
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  // -------------------------
  // SAVE
  // -------------------------
  const safeTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  doc.save(
    fileName ||
      `${safeTitle}-${new Date().toISOString().slice(0, 10)}.pdf`
  );
}
