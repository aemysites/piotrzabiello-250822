/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table header
  const tableRows = [['Cards (cards14)']];

  // Find the main grid that holds all cards and text blocks
  const mainGrid = element.querySelector('.aem-Grid') || element;
  // Find all top-level card containers (teaser cards)
  const cardContainers = Array.from(mainGrid.querySelectorAll(':scope > .container.cmp-info-teaser-container'));

  // Extract all cards
  cardContainers.forEach((cardContainer) => {
    const teaser = cardContainer.querySelector('.cmp-teaser');
    if (!teaser) return;
    // Get the image (only the <img> element)
    const img = teaser.querySelector('img');

    // Get all text content: Title, Description, etc.
    const content = teaser.querySelector('.cmp-teaser__content');
    // We'll assemble a fragment so we retain real elements
    const frag = document.createDocumentFragment();
    if (content) {
      // Title (usually an h3), keep heading element
      const title = content.querySelector('.cmp-teaser__title');
      if (title) frag.appendChild(title);
      // Description (may be <div> or <p>), can contain HTML
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) {
        // If <div>, append its children instead of the div
        if (desc.children.length) {
          Array.from(desc.childNodes).forEach(node => frag.appendChild(node));
        } else {
          frag.appendChild(document.createTextNode(desc.textContent.trim()));
        }
      }
    }
    // Add CTA if the card itself is a link
    const link = teaser.querySelector('a.cmp-teaser__link');
    if (link && link.href) {
      // Only add if not already present as a link in the description
      const existingLink = Array.from(frag.querySelectorAll('a')).some(a => a.href === link.href);
      if (!existingLink) {
        frag.appendChild(document.createElement('br'));
        const cta = document.createElement('a');
        cta.href = link.href;
        // Try to extract CTA text from the title, fallback to href
        const ctaTitle = content && content.querySelector('.cmp-teaser__title');
        cta.textContent = ctaTitle ? ctaTitle.textContent.trim() : link.href;
        frag.appendChild(cta);
      }
    }
    // Add card row: [image, text content]
    tableRows.push([img || '', frag]);
  });

  // Find any top-level .text blocks that are not part of cards (to preserve info like Werbewidersprüche)
  // Only top-level direct children that are .text or .cmp-text and not inside a card
  Array.from(mainGrid.children).forEach(child => {
    // If it's a .text or .cmp-text div
    const isText = child.classList.contains('text') || child.classList.contains('cmp-text');
    // Make sure it's not part of a card
    if (isText && !child.closest('.container.cmp-info-teaser-container')) {
      // Get its .cmp-text if present, otherwise itself
      const cmpText = child.querySelector('.cmp-text') || child;
      // Only add if has text
      if (cmpText && cmpText.textContent.trim()) {
        tableRows.push(['', cmpText]);
      }
    }
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
