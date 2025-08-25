/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion35)'];

  // Find title for accordion item
  let titleEl = null;
  const button = element.querySelector('.cmp-accordion__button');
  if (button) {
    const titleSpan = button.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      // Use a <div> for the cell, preserve bold if present
      titleEl = document.createElement('div');
      // If titleSpan contains HTML (like <b>), preserve it
      titleEl.innerHTML = titleSpan.innerHTML.trim();
    }
  }
  // Edge case: if no title found, fallback to empty div
  if (!titleEl) {
    titleEl = document.createElement('div');
  }

  // Find accordion body/content
  let contentCell;
  const panel = element.querySelector('.cmp-accordion__panel');
  if (panel) {
    // In this example, the real content is inside .container.responsivegrid (only child)
    // We want to reference the existing content block(s) directly.
    const grid = panel.querySelector('.container.responsivegrid');
    if (grid && grid.children.length > 0) {
      // Reference all child elements of the grid as the content
      contentCell = Array.from(grid.children);
    } else {
      // If no grid, include all direct children of panel
      contentCell = Array.from(panel.children);
    }
  } else {
    // If no panel, fallback to empty div
    contentCell = document.createElement('div');
  }

  // Compose table rows as per example: header, then [title, content]
  const rows = [
    headerRow,
    [titleEl, contentCell]
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
