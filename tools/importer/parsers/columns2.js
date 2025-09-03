/* global WebImporter */
export default function parse(element, { document }) {
  // Extract left column: the cookie description text
  const leftCol = element.querySelector('.b-content') || document.createElement('div');
  // Extract right column: the cookie buttons
  const rightCol = element.querySelector('.b-buttons') || document.createElement('div');

  // Table header row: must match block name exactly
  const headerRow = ['Columns (columns2)'];
  // Second row: left and right columns
  const columnsRow = [leftCol, rightCol];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
