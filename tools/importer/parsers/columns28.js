/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be exactly one column, with the header text
  const headerRow = ['Columns (columns28)'];

  // Find image (left column)
  const imageDiv = element.querySelector('.cmp-teaser__image');
  // Find text content (right column)
  const textDiv = element.querySelector('.cmp-teaser__content');

  // Content row: two columns, image left, text right
  const contentRow = [imageDiv, textDiv];

  // Compose table rows: header (1 column), then content (2 columns)
  const cells = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}