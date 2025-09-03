/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the UL containing all cards
  const ul = element.querySelector('ul.cmp-product-overview');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Get all LI elements (each card)
  const items = ul.querySelectorAll(':scope > li.cmp-product-overview__item');

  items.forEach((li) => {
    // Find the teaser link (contains image and text)
    const teaserLink = li.querySelector('a.cmp-teaser__link, a.cmp-teaser__link.lock');
    if (!teaserLink) return;

    // --- IMAGE CELL ---
    // Find the image container
    let imageEl = null;
    const imgContainer = teaserLink.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      // Find the actual <img> inside
      imageEl = imgContainer.querySelector('img');
    }
    // Defensive: If no image found, skip this card
    if (!imageEl) return;

    // --- TEXT CELL ---
    // Find the content container
    const contentDiv = teaserLink.querySelector('.cmp-teaser__content');
    const textCellContent = [];
    if (contentDiv) {
      // Title (h2)
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) textCellContent.push(title);
      // Button (call to action)
      const button = contentDiv.querySelector('.cmp-teaser__button');
      if (button) textCellContent.push(button);
    }
    // If no text content, skip this card
    if (textCellContent.length === 0) return;

    // Add row: [image, text content]
    rows.push([imageEl, textCellContent]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
