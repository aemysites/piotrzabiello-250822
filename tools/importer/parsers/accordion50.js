/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row, exactly as in example
  const rows = [['Accordion (accordion50)']];

  // Find accordion container
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;
  // Each accordion item
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: extract the .cmp-accordion__title span (preserves formatting)
    let titleCell;
    const button = item.querySelector('button.cmp-accordion__button');
    const titleSpan = button ? button.querySelector('.cmp-accordion__title') : null;
    if (titleSpan) {
      titleCell = titleSpan;
    } else if (button) {
      // fallback, preserve formatting from button if any
      titleCell = button;
    } else {
      titleCell = document.createTextNode(item.textContent.trim());
    }
    // Content cell: extract the panel and its children
    let contentCell;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Usually only one child: the container with content, but could be multiple
      // If there are only text nodes, preserve formatting if possible
      const childEls = Array.from(panel.children);
      if (childEls.length === 1) {
        contentCell = childEls[0];
      } else if (childEls.length > 1) {
        contentCell = childEls;
      } else {
        // fallback: if only text, preserve formatting
        contentCell = document.createTextNode(panel.textContent.trim());
      }
    } else {
      contentCell = document.createTextNode('');
    }
    rows.push([titleCell, contentCell]);
  });
  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}