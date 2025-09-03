/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find main content and image containers
  const content = element.querySelector('.cmp-teaser__content');
  const imageContainer = element.querySelector('.cmp-teaser__image');

  // Defensive: Get all description paragraphs as a single block
  let descriptionBlock = null;
  if (content) {
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      descriptionBlock = desc;
    }
  }

  // Defensive: Get image element
  let imageBlock = null;
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) {
      imageBlock = img;
    }
  }

  // Build table rows
  const headerRow = ['Columns (columns63)'];
  const contentRow = [descriptionBlock, imageBlock];

  const cells = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
