/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block container
  const accordionRoot = element.querySelector('.cmp-accordion');
  if (!accordionRoot) return;
  // Header row exactly as required
  const rows = [['Accordion (accordion9)']];
  // Gather all accordion items (direct children)
  const items = Array.from(accordionRoot.querySelectorAll(':scope > .cmp-accordion__item'));
  items.forEach((item) => {
    // Title cell: get the text content of the .cmp-accordion__title span
    let title = '';
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      title = titleSpan.textContent.trim();
    } else {
      // Fallback: use button text if title span is missing
      const btn = item.querySelector('.cmp-accordion__button');
      if (btn) title = btn.textContent.trim();
    }
    // Content cell: get the panel
    let contentCell = null;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // If there is a single .cmp-text block, use that directly
      const cmpText = panel.querySelector('.cmp-text');
      if (cmpText) {
        contentCell = cmpText;
      } else {
        // Use panel directly for any content (including fallback for edge cases)
        contentCell = panel;
      }
    }
    // Always push a 2-column row: [title, content]
    rows.push([title, contentCell]);
  });
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
