/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns39) block
  // Get left column: title and description
  const teaserContent = element.querySelector('.cmp-teaser__content');
  // Get right column: image
  const teaserImage = element.querySelector('.cmp-teaser__image');

  // Defensive: if elements missing, fallbacks
  const leftCell = teaserContent || document.createElement('div');
  const rightCell = teaserImage || document.createElement('div');

  const headerRow = ['Columns (columns39)'];
  const contentRow = [leftCell, rightCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
