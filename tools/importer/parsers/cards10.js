/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Defensive: Find all card items
  const items = element.querySelectorAll('ul.cmp-product-overview > li.cmp-product-overview__item');

  items.forEach((item) => {
    // Find the teaser link (contains all card content)
    const teaserLink = item.querySelector('a.cmp-teaser__link');
    if (!teaserLink) return;

    // Find the image element (first image in the card)
    let imageEl = teaserLink.querySelector('.cmp-product-overview-teaser__image img, .cmp-teaser__image img');
    // Defensive: If not found, try any img inside teaserLink
    if (!imageEl) imageEl = teaserLink.querySelector('img');

    // Find the title (h2)
    const titleEl = teaserLink.querySelector('.cmp-teaser__title, h2');
    // Find the button (call-to-action)
    const buttonEl = teaserLink.querySelector('.cmp-teaser__button, button');

    // Compose the text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (buttonEl) textCell.push(buttonEl);

    // Compose the row: [image, text]
    const row = [imageEl, textCell];
    rows.push(row);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
