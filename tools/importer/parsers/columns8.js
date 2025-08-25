/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row matching the block name in the example
  const headerRow = ['Columns (columns8)'];

  // The block structure is two columns:
  // Column 1: All the text content
  // Column 2: The image

  // Get the content column (text)
  const contentDiv = element.querySelector('.cmp-teaser__description');

  // Get the image column
  let imageEl = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // If contentDiv or imageEl are missing, use empty string so cell is never undefined
  const leftCell = contentDiv || '';
  const rightCell = imageEl || '';

  // Compose table rows
  const rows = [
    headerRow,
    [leftCell, rightCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
