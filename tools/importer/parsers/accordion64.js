/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check if element exists
  if (!element) return;

  // Table header as per block guidelines
  const headerRow = ['Accordion (accordion64)'];
  const rows = [headerRow];

  // Find all accordion items (immediate children with class 'cmp-accordion__item')
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title: find the span with class 'cmp-accordion__title' inside the button
    let titleEl = item.querySelector('.cmp-accordion__title');
    // Defensive: fallback to button text if span not found
    if (!titleEl) {
      const button = item.querySelector('button');
      if (button) {
        titleEl = document.createElement('span');
        titleEl.textContent = button.textContent.trim();
      }
    }

    // Content: find the panel div (with data-cmp-hook-accordion="panel")
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Defensive: if panel has only one child, use that, else use the panel itself
      // Usually, the content is a container with text blocks inside
      // We'll use all children of the panel as the content cell
      const children = Array.from(panel.children);
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // fallback: use panel itself
        contentCell = panel;
      }
    } else {
      // fallback: empty cell
      contentCell = document.createTextNode('');
    }

    rows.push([titleEl, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
