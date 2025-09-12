/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get main content and button area
  const content = element.querySelector('.b-content');
  const buttons = element.querySelector('.b-buttons');

  // Defensive: fallback if structure changes
  const leftCol = content || element;
  const rightCol = buttons || null;

  // Table header as required
  const headerRow = ['Columns (columns2)'];
  // Table content row: two columns, left is description, right is buttons
  const contentRow = [leftCol, rightCol];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
