/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main teaser link inside the teaser block
  const teaserLink = element.querySelector('a.cmp-teaser__link');
  if (!teaserLink) return;

  // Get image cell
  let leftCell = '';
  const imageDiv = teaserLink.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    leftCell = Array.from(imageDiv.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
    if (leftCell.length === 1) leftCell = leftCell[0];
  }

  // Get content cell and trim h3 text specifically
  let rightCell = [];
  const contentDiv = teaserLink.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    Array.from(contentDiv.childNodes).forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'H3') {
        // Trim the <h3> text and preserve the element
        n.textContent = n.textContent.trim();
        rightCell.push(n);
      } else if (n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())) {
        rightCell.push(n);
      }
    });
  }

  // Add arrow link if it's not already present
  const href = teaserLink.getAttribute('href');
  if (href) {
    const alreadyHasLink = rightCell.some(el => el.nodeType === Node.ELEMENT_NODE && el.tagName === 'A');
    if (!alreadyHasLink) {
      rightCell.push(document.createElement('br'));
      const arrowLink = document.createElement('a');
      arrowLink.href = href;
      arrowLink.textContent = '→';
      arrowLink.style.display = 'inline-block';
      arrowLink.style.fontSize = '2em';
      arrowLink.style.marginTop = '0.5em';
      arrowLink.style.color = '#0066cc';
      rightCell.push(arrowLink);
    }
  }

  // Compose the table: header EXACTLY as specified
  const cells = [
    ['Columns (columns12)'],
    [leftCell, rightCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
