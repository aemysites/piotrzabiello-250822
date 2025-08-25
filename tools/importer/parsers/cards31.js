/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards31) block: Table header matches example EXACTLY
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Find all card list items - each is a row
  const items = element.querySelectorAll('ul.cmp-product-overview > li.cmp-product-overview__item');
  items.forEach((item) => {
    // Find the teaser block within the card
    const teaser = item.querySelector('.cmp-product-overview-teaser');
    if (!teaser) return;

    // --- Image extraction (first column) ---
    // Always reference the existing <img> element
    let image = teaser.querySelector('img');

    // --- Text content extraction (second column) ---
    const textCell = document.createElement('div');

    // Title in <strong> as per example
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textCell.appendChild(strong);
    }

    // Description: Prefer data-cmp-data-layer, fallback to direct text
    let description = '';
    try {
      const teaserData = teaser.getAttribute('data-cmp-data-layer');
      if (teaserData) {
        const teaserObj = JSON.parse(teaserData.replace(/&quot;/g, '"'));
        const key = Object.keys(teaserObj)[0];
        if (teaserObj[key]['dc:description']) {
          description = teaserObj[key]['dc:description'].trim();
        }
      }
    } catch(e) {}

    // Only add description if present and not duplicate of title
    const titleText = titleEl ? titleEl.textContent.trim() : '';
    if (description && description !== titleText) {
      const descDiv = document.createElement('div');
      descDiv.textContent = description;
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(descDiv);
    }

    // CTA - always reference the <a> from teaser
    const link = teaser.querySelector('a');
    if (link && link.getAttribute('href')) {
      // Use button text if present, fallback to title
      let ctaText = '';
      const btn = teaser.querySelector('button');
      if (btn && btn.textContent.trim()) {
        ctaText = btn.textContent.trim();
      } else if (titleText) {
        ctaText = titleText;
      } else {
        ctaText = link.getAttribute('href');
      }
      const ctaEl = document.createElement('a');
      ctaEl.href = link.getAttribute('href');
      ctaEl.textContent = ctaText;
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(ctaEl);
    }

    // Add row for this card (always two columns)
    rows.push([image, textCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
