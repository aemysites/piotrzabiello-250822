/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the UL containing all cards
  const ul = element.querySelector('ul.cmp-product-overview');
  if (!ul) return;

  // Get all LI items (cards)
  const items = Array.from(ul.children).filter(li => li.classList.contains('cmp-product-overview__item'));

  // Table header
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  items.forEach(li => {
    // Defensive: find the teaser link
    const teaser = li.querySelector('.cmp-product-overview-teaser');
    if (!teaser) return;
    const link = teaser.querySelector('a.cmp-teaser__link');
    if (!link) return;

    // Find image (first cell)
    let imgEl = null;
    const imgContainer = teaser.querySelector('.cmp-product-overview-teaser__image .cmp-teaser__image .cmp-image');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    // Defensive: fallback if image not found
    if (!imgEl) {
      // Try to find any img inside the teaser
      imgEl = teaser.querySelector('img');
    }

    // Find text content (second cell)
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    let textCellContent = [];
    if (contentDiv) {
      // Title (h2)
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) textCellContent.push(title);
      // Button (call-to-action)
      const button = contentDiv.querySelector('.cmp-teaser__button');
      if (button) textCellContent.push(button);
    }
    // If no content found, fallback to teaser text
    if (textCellContent.length === 0) {
      textCellContent.push(teaser);
    }

    // Build row: [image, text content]
    rows.push([
      imgEl ? imgEl : '',
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
