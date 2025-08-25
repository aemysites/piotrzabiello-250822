/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header, matching exactly
  const headerRow = ['Cards (cards58)'];
  const cells = [headerRow];

  // Find first block description
  const descriptionEl = element.querySelector('.cmp-text');

  // Find all product overview items
  const ul = element.querySelector('.cmp-product-overview');
  if (!ul) return;
  const items = Array.from(ul.querySelectorAll(':scope > li.cmp-product-overview__item'));

  // For each card (product item)
  items.forEach((item, idx) => {
    // Image: first <img> inside this card
    const imgEl = item.querySelector('img');
    // Card text cell
    const textCell = [];
    // Only in first card: include block description
    if (idx === 0 && descriptionEl) textCell.push(descriptionEl);
    // Teaser content
    const teaserContent = item.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title
      const titleEl = teaserContent.querySelector('.cmp-teaser__title');
      if (titleEl) textCell.push(titleEl);
      // Button
      const buttonEl = teaserContent.querySelector('.cmp-teaser__button');
      if (buttonEl) textCell.push(buttonEl);
    }
    // Each row: [image, text cell]
    cells.push([imgEl || '', textCell.length > 1 ? textCell : (textCell[0] || '')]);
  });

  // Build and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
