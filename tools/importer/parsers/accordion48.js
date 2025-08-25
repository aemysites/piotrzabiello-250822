/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row matches example exactly
  const headerRow = ['Accordion (accordion48)'];

  // Find all accordion items directly under the main element
  const items = element.querySelectorAll('.cmp-accordion__item');
  const rows = [headerRow];

  items.forEach(item => {
    // Extract the title from the .cmp-accordion__title span inside the button
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell = titleSpan ? titleSpan : document.createTextNode('');

    // Extract the content panel
    let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = null;
    if (panel) {
      // Find the main container/content block inside the panel (reference, do not clone)
      // Prefer a .container or .cmp-container, but fallback to the panel itself if needed
      let mainContent = panel.querySelector('.container, .cmp-container, .download');
      contentCell = mainContent ? mainContent : panel;
    } else {
      contentCell = document.createTextNode('');
    }
    
    rows.push([titleCell, contentCell]);
  });

  // Create the block table using the extracted rows
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}