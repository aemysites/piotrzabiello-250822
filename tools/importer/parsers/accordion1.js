/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header as in the example
  const headerRow = ['Accordion (accordion1)'];

  // Title extraction: get the button title text
  let title = '';
  const headerButton = element.querySelector('h3 > button');
  if (headerButton) {
    const titleSpan = headerButton.querySelector('.cmp-accordion__title');
    if (titleSpan && titleSpan.textContent) {
      title = titleSpan.textContent.trim();
    } else {
      title = headerButton.textContent.trim();
    }
  }

  // Body extraction: get all major content blocks in panel
  const panel = element.querySelector('[data-cmp-hook-accordion="panel"]');
  let contentElements = [];
  if (panel) {
    // Find the grid structure inside the panel
    // .container.responsivegrid > .cmp-container > .aem-Grid > ...
    const responsiveGrid = panel.querySelector('.container.responsivegrid');
    if (responsiveGrid) {
      const gridContainer = responsiveGrid.querySelector('.cmp-container');
      if (gridContainer) {
        const grid = gridContainer.querySelector('.aem-Grid');
        if (grid) {
          Array.from(grid.children).forEach(child => {
            // Only push major content blocks (text and image)
            if (child.classList.contains('text')) {
              const textDiv = child.querySelector('.cmp-text');
              if (textDiv) contentElements.push(textDiv);
            } else if (child.classList.contains('image')) {
              const imgDiv = child.querySelector('.cmp-image');
              if (imgDiv) contentElements.push(imgDiv);
            }
          });
        }
      }
    }
  }

  // Edge case: no content blocks found, fallback to panel innerHTML
  if (contentElements.length === 0 && panel) {
    // create a div and use the panel's innerHTML
    const fallbackDiv = document.createElement('div');
    fallbackDiv.innerHTML = panel.innerHTML;
    contentElements.push(fallbackDiv);
  }

  // Compose rows: header, then [title, content]
  const rows = [headerRow, [title, contentElements]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
