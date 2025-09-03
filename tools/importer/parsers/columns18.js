/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get main content and button group
  const contentWrapper = element.querySelector('.b-content');
  const buttonsWrapper = element.querySelector('.b-buttons');

  // First column: description text (grab the .b-description or .b-text)
  let descriptionCol = null;
  if (contentWrapper) {
    // Prefer the .b-description div, fallback to .b-content
    const desc = contentWrapper.querySelector('.b-description') || contentWrapper;
    descriptionCol = desc;
  } else {
    // fallback: use the whole element
    descriptionCol = element;
  }

  // Second column: the buttons (all of them in a row)
  let buttonsCol = null;
  if (buttonsWrapper) {
    buttonsCol = buttonsWrapper;
  } else {
    // fallback: empty div
    buttonsCol = document.createElement('div');
  }

  // Table structure: header, then one row with two columns
  const headerRow = ['Columns (columns18)'];
  const contentRow = [descriptionCol, buttonsCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
