/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header, matches example exactly
  const headerRow = ['Cards (cards10)'];

  // 2. Get all cards (li elements)
  const cardEls = Array.from(element.querySelectorAll('ul > li'));
  
  // 3. Map each card to a row: [Image, Text]
  const rows = cardEls.map(card => {
    // Image extraction: find <img> inside .cmp-image
    const img = card.querySelector('.cmp-image img');
    // Use <img> element as-is for the image cell
    const imageCell = img;

    // Text extraction: find title and CTA
    const teaserContent = card.querySelector('.cmp-teaser__content');
    let textCellContent = [];
    if (teaserContent) {
      // Title (h2)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) {
        // Keep semantic heading (h2)
        textCellContent.push(title);
      }
      // No description in this HTML
    }
    // CTA: find the link/button
    const teaserLink = card.querySelector('.cmp-teaser__link');
    if (teaserLink) {
      const button = teaserLink.querySelector('.cmp-teaser__button');
      if (button) {
        // Create a <a> tag for the CTA, referencing the link
        const cta = document.createElement('a');
        cta.href = teaserLink.getAttribute('href');
        cta.textContent = button.textContent.trim();
        textCellContent.push(document.createElement('br'));
        textCellContent.push(cta);
      }
    }
    // If no heading or CTA, fallback to empty string
    if (textCellContent.length === 0) textCellContent = [''];

    return [imageCell, textCellContent];
  });

  // 4. Create the table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  // 5. Replace original element
  element.replaceWith(table);
}
