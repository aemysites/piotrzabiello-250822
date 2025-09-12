/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists
  if (!element) return;

  // Header row as specified
  const headerRow = ['Accordion (accordion64)'];
  const rows = [headerRow];

  // Find all accordion items (direct children with class 'cmp-accordion__item')
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: Find the .cmp-accordion__title span inside the button
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell;
    if (titleSpan) {
      // Use the span directly for semantic markup
      titleCell = titleSpan;
    } else {
      // Fallback: Try to get text from button or header
      const button = item.querySelector('button');
      titleCell = button ? document.createTextNode(button.textContent.trim()) : document.createTextNode('');
    }

    // Content cell: Find the panel div
    let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Defensive: Find the main content container inside the panel
      // Usually a .container or .cmp-container
      let container = panel.querySelector('.cmp-container') || panel;
      // Use the container directly as the cell
      contentCell = container;
    } else {
      // Fallback: Empty cell
      contentCell = document.createTextNode('');
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
