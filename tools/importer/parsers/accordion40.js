/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Accordion block
  const headerRow = ['Accordion (accordion40)'];

  // -- Title cell: Always use the element's actual title
  // Locate the accordion button and its title span
  let titleText = '';
  const h3 = element.querySelector('h3');
  let titleElem = null;
  if (h3) {
    const button = h3.querySelector('button');
    if (button) {
      const span = button.querySelector('.cmp-accordion__title');
      if (span) {
        titleText = span.textContent.trim();
      } else {
        titleText = button.textContent.trim();
      }
    } else {
      titleText = h3.textContent.trim();
    }
  }
  // Create a div element for the title cell to match expected structure
  titleElem = document.createElement('div');
  titleElem.textContent = titleText;

  // -- Content cell: Reference the actual content block inside the accordion panel
  let contentCell = null;
  // Find the accordion panel
  const panel = element.querySelector('[data-cmp-hook-accordion="panel"]');
  if (panel) {
    // The content is typically a grid/container inside the panel
    // Use the first child with class 'cmp-container', else fallback to the panel itself
    const container = panel.querySelector('.cmp-container');
    if (container) {
      contentCell = container;
    } else {
      // fallback to panel content
      contentCell = panel;
    }
  } else {
    // fallback: use the element itself if panel is missing
    contentCell = element;
  }

  // Build the table rows
  const rows = [
    headerRow,
    [titleElem, contentCell]
  ];

  // Create the block table using the provided helper
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
