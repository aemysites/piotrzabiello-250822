/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the example exactly
  const headerRow = ['Columns (columns56)'];

  // --- Extract Downloads ---
  const mainContainer = element.querySelector('.cmp-container');
  let downloads = [];
  if (mainContainer) {
    const downloadDivs = Array.from(mainContainer.querySelectorAll(':scope > div.download'));
    downloads = downloadDivs.map(downloadDiv => downloadDiv.querySelector(':scope > .cmp-download'));
  }

  // --- Extract Product Overview Teasers ---
  const prodOverview = element.querySelector('.productoverview.list');
  let teasers = [];
  if (prodOverview) {
    const ul = prodOverview.querySelector('ul.cmp-product-overview');
    if (ul) {
      const items = Array.from(ul.querySelectorAll(':scope > li.cmp-product-overview__item'));
      teasers = items.map(li => li.querySelector(':scope > .cmp-product-overview-teaser'));
    }
  }

  // --- Pair downloads and teasers as rows, like the example ---
  const maxRows = Math.max(downloads.length, teasers.length);
  const bodyRows = [];
  for (let i = 0; i < maxRows; i++) {
    bodyRows.push([
      downloads[i] || '',
      teasers[i] || ''
    ]);
  }

  // Compose the cells array for the block table
  const cells = [headerRow, ...bodyRows];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
