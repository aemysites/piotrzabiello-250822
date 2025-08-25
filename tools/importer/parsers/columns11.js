/* global WebImporter */
export default function parse(element, { document }) {
  // Find the form inside the provided element
  const form = element.querySelector('form');
  if (!form) return;

  // Get all direct children of the form, filtering out hidden inputs and honeypot fields
  const formChildren = Array.from(form.children).filter(child => {
    // Exclude hidden fields and honeypots
    if (child.tagName === 'INPUT' && (child.type === 'hidden' || child.classList.contains('cmp-form__fnPassword'))) {
      return false;
    }
    // Exclude .hidden class blocks
    if (child.classList.contains('hidden')) return false;
    return true;
  });

  // Separate left and right columns based on grid offset
  const leftColumn = [];
  const rightColumn = [];

  formChildren.forEach(child => {
    if (child.classList.contains('aem-GridColumn--default--5')) {
      if (child.classList.contains('aem-GridColumn--offset--default--0')) {
        leftColumn.push(child);
      } else if (child.classList.contains('aem-GridColumn--offset--default--2')) {
        rightColumn.push(child);
      }
    } else if (child.classList.contains('aem-GridColumn--default--12')) {
      // Full-width: textarea and button blocks (visually left-aligned)
      if (child.querySelector('textarea, button')) leftColumn.push(child);
    }
  });

  // Construct the table so the header row is a single cell/column as required
  const cells = [
    ['Columns (columns11)'], // header row: single cell ONLY
    [leftColumn.length ? leftColumn : '', rightColumn.length ? rightColumn : ''] // content row: 2 cells (columns)
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
