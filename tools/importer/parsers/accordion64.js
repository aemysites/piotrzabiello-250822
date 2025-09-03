/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process if element contains accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));
  if (!items.length) return;

  // Header row as required
  const headerRow = ['Accordion (accordion64)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Title: Find the button's title span
    const button = item.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        // Fallback: use button text
        title = button.textContent.trim();
      }
    }

    // Content: Find the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = '';
    if (panel) {
      // Defensive: Use the entire panel content
      // But only reference the actual content, not the panel wrapper
      // Find the first .cmp-text inside the panel
      const textBlock = panel.querySelector('.cmp-text');
      if (textBlock) {
        content = textBlock;
      } else {
        // Fallback: use all children of panel
        const panelChildren = Array.from(panel.children);
        if (panelChildren.length) {
          content = panelChildren;
        } else {
          content = panel;
        }
      }
    }

    rows.push([title, content]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
