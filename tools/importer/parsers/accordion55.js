/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as in the example
  const headerRow = ['Accordion (accordion55)'];
  const cells = [headerRow];

  // Find all accordion items under the given element
  const items = element.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title: always from the .cmp-accordion__title span
    let titleSpan = item.querySelector('.cmp-accordion__title');
    // fallback if not found, use button text
    let titleCell = titleSpan || '';

    // Content: all content under the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentElements = [];
    if (panel) {
      // Try to find major content containers (.container, .cmp-container, .aem-Grid, etc.)
      // These may be nested, but sometimes panel has just content
      let foundMajor = false;
      // Try responsive containers first
      panel.querySelectorAll(':scope > .container.responsivegrid, :scope > .cmp-container, :scope > .aem-Grid').forEach((cont) => {
        foundMajor = true;
        // try to grab direct content blocks from each
        // for .aem-Grid, use its children
        if (cont.classList.contains('aem-Grid')) {
          cont.querySelectorAll(':scope > *').forEach((block) => {
            contentElements.push(block);
          });
        } else {
          // For other containers, push direct children
          cont.querySelectorAll(':scope > *').forEach((block) => {
            contentElements.push(block);
          });
        }
      });
      // If not found any major containers, just take content nodes of panel
      if (!foundMajor) {
        // Only push element nodes
        panel.childNodes.forEach((node) => {
          if (node.nodeType === 1) {
            contentElements.push(node);
          }
        });
      }
    }
    // If contentElements empty, fall back to blank
    let contentCell = contentElements.length === 1 ? contentElements[0] : contentElements;
    if (contentElements.length === 0) contentCell = '';
    cells.push([titleCell, contentCell]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
