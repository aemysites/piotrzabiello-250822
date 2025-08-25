/* global WebImporter */
export default function parse(element, { document }) {
  // Make the header row as specified
  const cells = [['Accordion (accordion15)']];

  // Get the main accordion block
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return; // Defensive guard

  // Find all top-level accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: find the span with the title in the button
    let titleElem = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let titleCell = titleElem ? titleElem : '';
    // Content cell: find the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Find content wrapper (allows for .cmp-container, .container etc)
      // Prefer the innermost .cmp-container/.container if nested
      let contentWrapper = panel.querySelector('.cmp-container, .container, .responsivegrid, .cmp-container-download-section');
      if (contentWrapper) {
        // Drill down to innermost container if single child and is a known wrapper
        let wrappers = ['cmp-container', 'container', 'responsivegrid', 'cmp-container-download-section'];
        while (
          contentWrapper.children.length === 1 &&
          wrappers.some(cls => contentWrapper.firstElementChild.classList.contains(cls))
        ) {
          contentWrapper = contentWrapper.firstElementChild;
        }
        // Use all children as content
        contentCell = Array.from(contentWrapper.children);
      } else {
        // Fallback to all children of panel
        contentCell = Array.from(panel.children);
      }
      // If nothing, fallback to empty string
      if (!contentCell || contentCell.length === 0) {
        contentCell = '';
      }
    } else {
      contentCell = '';
    }
    cells.push([titleCell, contentCell]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
