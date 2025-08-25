/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match exactly from instructions
  const headerRow = ['Columns (columns43)'];

  // Find the left (text) column
  let leftCol = null;
  // The text content is inside .cmp-teaser__content .cmp-teaser__description
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // To preserve semantic meaning, use the .cmp-teaser__description child (contains paragraphs)
    const description = teaserContent.querySelector('.cmp-teaser__description');
    leftCol = description ? description : teaserContent;
  }

  // Find the right (image) column
  let rightCol = null;
  // The image is inside .cmp-teaser__image (may contain image and caption)
  const teaserImage = element.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    rightCol = teaserImage;
  }

  // Fallback for missing columns to preserve table structure
  const col1 = leftCol || document.createElement('div');
  const col2 = rightCol || document.createElement('div');

  const cells = [
    headerRow,
    [col1, col2]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
