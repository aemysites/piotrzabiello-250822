/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches exactly
  const headerRow = ['Cards (cards45)'];
  const rows = [headerRow];

  // Get all card items from source
  const items = element.querySelectorAll('ul.cmp-product-overview > li.cmp-product-overview__item');
  items.forEach((item) => {
    // 1. IMAGE COLUMN
    let imageEl = null;
    const teaserImage = item.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imageEl = teaserImage;
    }
    // 2. TEXT COLUMN
    const textCol = document.createElement('div');
    // Title (bold)
    const titleEl = item.querySelector('.cmp-teaser__title');
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textCol.appendChild(strong);
      textCol.appendChild(document.createElement('br'));
    }
    // Description: Try to get from data-cmp-data-layer
    let description = '';
    const teaserDiv = item.querySelector('.cmp-product-overview-teaser');
    if (teaserDiv) {
      try {
        const dl = JSON.parse(teaserDiv.getAttribute('data-cmp-data-layer') || '{}');
        const key = Object.keys(dl)[0];
        if (key && dl[key] && dl[key]["dc:description"] && dl[key]["dc:description"].trim()) {
          description = dl[key]["dc:description"].trim();
        }
      } catch (e) {}
    }
    if (description) {
      const descP = document.createElement('p');
      descP.textContent = description;
      textCol.appendChild(descP);
    }
    // If no extracted description, fallback: get all text nodes from .cmp-teaser__content except the title
    if (!description) {
      const contentDiv = item.querySelector('.cmp-teaser__content');
      if (contentDiv) {
        Array.from(contentDiv.childNodes).forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const p = document.createElement('span');
            p.textContent = node.textContent.trim();
            textCol.appendChild(p);
            textCol.appendChild(document.createElement('br'));
          }
          // If it's an element (other than the title), and has text
          if (node.nodeType === Node.ELEMENT_NODE && node !== titleEl && node.textContent.trim()) {
            if (!node.classList.contains('cmp-teaser__title')) {
              const p = document.createElement('span');
              p.textContent = node.textContent.trim();
              textCol.appendChild(p);
              textCol.appendChild(document.createElement('br'));
            }
          }
        });
      }
    }
    // CTA (always as link, never as button)
    const teaserLink = item.querySelector('a.cmp-teaser__link');
    const buttonEl = item.querySelector('.cmp-teaser__button');
    if (teaserLink && buttonEl && buttonEl.textContent.trim()) {
      const ctaLink = document.createElement('a');
      ctaLink.href = teaserLink.getAttribute('href');
      ctaLink.textContent = buttonEl.textContent.trim();
      textCol.appendChild(ctaLink);
    }
    // Push row: [image, textCol]
    rows.push([imageEl, textCol]);
  });

  // Create table using referenced elements
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
