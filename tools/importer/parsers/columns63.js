/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Get content and image containers
  const content = element.querySelector('.cmp-teaser__content');
  let textContent = null;
  if (content) {
    // Get description block (contains <p> tags)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      textContent = desc;
    }
  }

  // Get image block
  const imageBlock = element.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageBlock) {
    // Find the <img> inside
    imageEl = imageBlock.querySelector('img');
  }

  // Build the table rows
  const headerRow = ['Columns (columns63)'];
  const columnsRow = [textContent, imageEl];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
