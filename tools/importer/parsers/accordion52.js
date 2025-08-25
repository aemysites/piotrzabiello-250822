/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell only, per spec
  const headerRow = ['Accordion (accordion52)'];

  // Title extraction
  let titleContent = '';
  const titleSpan = element.querySelector('.cmp-accordion__title');
  if (titleSpan) {
    titleContent = titleSpan.textContent.trim();
  }
  const titleEl = document.createElement('strong');
  titleEl.textContent = titleContent;

  // Content extraction
  let contentEls = [];
  const panel = element.querySelector('.cmp-accordion__panel');
  if (panel) {
    const grid = panel.querySelector('.aem-Grid');
    if (grid) {
      contentEls = Array.from(grid.children).map(child => {
        if (child.classList.contains('text') || child.classList.contains('image')) {
          const contentDiv = child.querySelector('div');
          return contentDiv ? contentDiv : child;
        }
        return child;
      }).filter(Boolean);
    } else {
      contentEls = Array.from(panel.children);
    }
  }
  if (contentEls.length === 0) {
    const emptyP = document.createElement('p');
    emptyP.textContent = '';
    contentEls = [emptyP];
  }

  // Trick: Only pass a single cell for header row; for content row, if table expects two columns, pad header row with colspan attribute
  // Create table using DOMUtils; then set the header cell's colspan to 2 to match columns in content rows
  const tableData = [
    headerRow,
    [titleEl, contentEls]
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Fix: Set colspan on first header row so it covers both columns visually
  if (table && table.rows.length > 0 && table.rows[0].cells.length === 1) {
    table.rows[0].cells[0].setAttribute('colspan', '2');
  }

  element.replaceWith(table);
}
