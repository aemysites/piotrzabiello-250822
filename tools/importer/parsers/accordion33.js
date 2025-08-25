/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Accordion (accordion33)'];

  // Get the accordion root
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  if (!items.length) return;

  const rows = [];

  items.forEach((item) => {
    // Title: get the span inside the button, which contains the title text
    let titleCell = '';
    const btn = item.querySelector('.cmp-accordion__button');
    if (btn) {
      const titleSpan = btn.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        // Use a <strong> for the title, as in the example
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        titleCell = strong;
      } else {
        titleCell = btn.textContent.trim();
      }
    } else {
      // fallback: use item's text
      titleCell = item.textContent.trim();
    }

    // Content cell: find the panel and its content
    let contentCell = document.createElement('div');
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // The panel usually contains a grid/container structure
      // We'll collect all visible text blocks inside it, in order
      const textBlocks = Array.from(panel.querySelectorAll(':scope .cmp-text'));
      textBlocks.forEach((tb) => {
        contentCell.appendChild(tb);
      });
    }

    rows.push([titleCell, contentCell]);
  });

  // Assemble table data
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
