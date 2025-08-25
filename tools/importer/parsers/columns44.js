/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one cell
  const headerRow = ['Columns (columns44)'];

  // Text column
  let textCell = '';
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    const teaserDesc = teaserContent.querySelector('.cmp-teaser__description');
    textCell = teaserDesc ? teaserDesc : teaserContent;
  }

  // Image column
  let imageCell = '';
  const teaserImage = element.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    const img = teaserImage.querySelector('img');
    imageCell = img ? img : teaserImage;
  }

  // Construct table: header is single column, then one row with two columns
  const cells = [
    headerRow,
    [textCell, imageCell],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
