/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must match the example exactly
  const cells = [['Cards (cardsNoImages46)']];

  // Find the .cmp-teaser block(s)
  // The HTML provided only has one teaser, but make this robust for possible multiples
  let cardEls = [];
  if (element.classList.contains('cmp-teaser')) {
    cardEls = [element];
  } else {
    cardEls = Array.from(element.querySelectorAll(':scope > .cmp-teaser'));
    if (cardEls.length === 0) {
      cardEls = Array.from(element.querySelectorAll('.cmp-teaser'));
    }
    if (cardEls.length === 0) {
      // Treat element itself as a card if no .cmp-teaser found
      cardEls = [element];
    }
  }

  cardEls.forEach((cardEl) => {
    // Extract the main content for the card.
    // Always reference existing elements, never clone unless needed for fragments.
    const content = cardEl.querySelector('.cmp-teaser__content') || cardEl;
    const rowChildren = [];
    // Heading: .cmp-teaser__title (usually an h3)
    const heading = content.querySelector('.cmp-teaser__title');
    if (heading) rowChildren.push(heading);
    // Description: .cmp-teaser__description
    const descContainer = content.querySelector('.cmp-teaser__description');
    if (descContainer) {
      // Collect all childNodes (preserve any markup)
      Array.from(descContainer.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          rowChildren.push(node);
        }
      });
    }
    // CTA/action link: .cmp-teaser__action-container
    const actionContainer = content.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      rowChildren.push(actionContainer);
    }
    // Only add row if some content exists
    if (rowChildren.length > 0) {
      cells.push([rowChildren]);
    }
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
