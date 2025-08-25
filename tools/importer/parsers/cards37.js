/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table rows
  const rows = [];
  // 1. Table header, exactly as in example
  rows.push(['Cards (cards37)']);

  // 2. Find all story teaser blocks directly under the cards section
  const teasers = Array.from(element.querySelectorAll('.cmp-story-teaser'));
  teasers.forEach(teaser => {
    // --- First column: Image ---
    let img = teaser.querySelector('img'); // Use the actual <img> element

    // --- Second column: Text Content ---
    // Gather title(s), description(s), and link(s) if present
    const cellContent = [];

    // Get all visible titles inside teaser (typically h5 with class)
    const titleEl = teaser.querySelector('h5.cmp-story-teaser__title');
    if (titleEl && titleEl.textContent.trim()) {
      cellContent.push(titleEl);
    }

    // Get description: any block with class .cmp-teaser__description
    const descEl = teaser.querySelector('.cmp-teaser__description');
    if (descEl) {
      // If descEl has paragraphs, include each <p>, else whole block
      const ps = descEl.querySelectorAll('p');
      if (ps.length) {
        ps.forEach(p => cellContent.push(p));
      } else {
        cellContent.push(descEl);
      }
    }

    // Optionally include CTA link if present (not shown in example, but robust to future updates)
    // For this HTML, the clickable area is the a.cmp-story-teaser__media-link, but contains everything already

    // Only add row if there is image OR text content
    if (img || cellContent.length) {
      rows.push([img, cellContent.length ? cellContent : '']);
    }
  });

  // Create and replace the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}