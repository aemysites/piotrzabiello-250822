/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as in example: Columns (columns6)
  const headerRow = ['Columns (columns6)'];

  // 2. Content extraction
  // Get immediate children of the main block
  // Usually the block is split into content (.cmp-teaser__content) and image (.cmp-teaser__image)
  const contentCol = element.querySelector('.cmp-teaser__content');
  const imageCol = element.querySelector('.cmp-teaser__image');

  // Defensive: if not found, set as empty
  const left = contentCol || document.createElement('div');
  const right = imageCol || document.createElement('div');

  // 3. Table cells layout: header row, then one row with two columns
  const cells = [headerRow, [left, right]];

  // 4. Create table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}