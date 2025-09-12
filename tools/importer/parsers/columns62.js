/* global WebImporter */
export default function parse(element, { document }) {
  // Find the left (text) and right (image) columns
  const content = element.querySelector('.cmp-teaser__content');
  const image = element.querySelector('.cmp-teaser__image');

  // Defensive: fallback if selectors fail
  const leftCell = content || element;
  const rightCell = image || null;

  // Table header row: must match block name exactly
  const headerRow = ['Columns (columns62)'];

  // Table content row: two columns, left is text, right is image
  const contentRow = [leftCell, rightCell];

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block table
  element.replaceWith(table);
}
