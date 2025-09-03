/* global WebImporter */
export default function parse(element, { document }) {
  // Find the left column (text content)
  const leftCol = element.querySelector('.cmp-teaser__content');
  // Find the right column (image)
  const rightCol = element.querySelector('.cmp-teaser__image');

  // Defensive: If either column is missing, use empty cell
  const leftCell = leftCol ? leftCol : document.createElement('div');
  const rightCell = rightCol ? rightCol : document.createElement('div');

  // Table header row
  const headerRow = ['Columns (columns62)'];
  // Table columns row
  const columnsRow = [leftCell, rightCell];

  // Build table
  const table = WebImporter.DOMUtils.createTable([headerRow, columnsRow], document);

  // Replace original element with table
  element.replaceWith(table);
}
