/* global WebImporter */
export default function parse(element, { document }) {
  // Header row - must match example exactly
  const headerRow = ['Accordion (accordion26)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = element.querySelectorAll(':scope .cmp-accordion__item');
  items.forEach((item) => {
    // Find the button title (text only)
    let titleText = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan && titleSpan.textContent) {
        titleText = titleSpan.textContent.trim();
      } else {
        titleText = button.textContent.trim();
      }
    }
    // Use <strong> for title to match example's bold styling
    const titleElement = document.createElement('strong');
    titleElement.textContent = titleText;

    // Find the content block: panel > container > text (reference actual existing element)
    let contentCell = null;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Try to find the innermost meaningful content block
      let candidate = panel;
      // Prefer .cmp-container, then .cmp-text, else panel itself
      const container = candidate.querySelector('.cmp-container');
      const textBlock = container ? container.querySelector('.cmp-text') : null;
      if (textBlock) {
        contentCell = textBlock;
      } else if (container) {
        contentCell = container;
      } else {
        // Fallback: use panel itself
        contentCell = panel;
      }
    } else {
      // Edge case: missing content panel
      contentCell = document.createElement('span');
      contentCell.textContent = '';
    }

    // Add row with 2 cells: title, content
    rows.push([titleElement, contentCell]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
