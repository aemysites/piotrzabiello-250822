/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row, exactly matching the example
  const headerRow = ['Cards (cardsNoImages51)'];

  // Get all direct children that represent cards
  const cardDivs = Array.from(element.querySelectorAll(':scope > div.eventteaser'));

  // For each card, build a cell containing all relevant content
  const rows = cardDivs.map(card => {
    // Find the content container within this card
    const content = card.querySelector('.cmp-teaser__content');
    if (!content) return ['']; // Edge case: missing content, put empty string
    const cellContent = [];

    // Date (if present)
    const date = content.querySelector('.cmp-teaser__date');
    if (date) {
      cellContent.push(date);
    }

    // Title (if present)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      cellContent.push(title);
    }

    // Description (if present)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      cellContent.push(desc);
    }

    // CTA link (if present)
    const action = content.querySelector('.cmp-teaser__action-container');
    if (action && action.querySelector('a')) {
      cellContent.push(action);
    }

    // Always reference existing elements, never clone or create new
    return [cellContent];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
