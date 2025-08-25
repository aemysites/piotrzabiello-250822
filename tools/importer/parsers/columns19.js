/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner grid where the columns are defined
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  // Find the categorylist block that contains the column items
  const categoryList = grid.querySelector('.cmp-categorylist');
  if (!categoryList) return;
  // Each list item (li) is a column
  const items = categoryList.querySelectorAll('li.cmp-list__item');
  // Array to hold column cells for the 2nd row (one per li)
  const row = [];
  items.forEach(item => {
    const teaser = item.querySelector('.cmp-category-teaser');
    if (teaser) {
      row.push(teaser);
    }
  });
  // Only create a columns block if there are at least one column
  if (row.length > 0) {
    const headerRow = ['Columns (columns19)']; // <-- FIX: Only one cell in header row
    const cells = [headerRow, row]; // <-- second row: N cells, first row: 1 cell
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
