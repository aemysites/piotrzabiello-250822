/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content and image containers
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const imageDiv = element.querySelector('.cmp-teaser__image');

  // Defensive: fallback if not found
  const leftCol = contentDiv || element;
  const rightCol = imageDiv || null;

  // Table header as per block requirements
  const headerRow = ['Columns (columns62)'];

  // Prepare columns: left = text, right = image
  const columnsRow = [leftCol, rightCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
