/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per instructions
  const headerRow = ['Columns (columns49)'];

  // Extract the left (text) and right (image) columns
  // Left: The content column (text, address, phone, email)
  const leftCol = element.querySelector('.cmp-teaser__content');

  // Right: The image column
  const rightCol = element.querySelector('.cmp-teaser__image');

  // Fallback if nodes aren't found: create empty div to keep column count correct
  const leftCell = leftCol || document.createElement('div');
  const rightCell = rightCol || document.createElement('div');

  // Arrange as two columns in the second row
  const cells = [
    headerRow,
    [leftCell, rightCell],
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
