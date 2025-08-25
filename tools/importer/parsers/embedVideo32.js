/* global WebImporter */
export default function parse(element, { document }) {
  // Exact header as in the example
  const headerRow = ['Embed (embedVideo32)'];

  // Collect direct text nodes under element (if any)
  const cellContent = [];
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = node.textContent.trim();
      cellContent.push(p);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // If node is a video element, extract its src as a link
      if (node.tagName.toLowerCase() === 'video') {
        const source = node.querySelector('source');
        if (source && source.getAttribute('src')) {
          const link = document.createElement('a');
          link.href = source.getAttribute('src');
          link.textContent = source.getAttribute('src');
          cellContent.push(link);
        }
      } else {
        // For other elements (e.g., buttons), include them
        cellContent.push(node);
      }
    }
  });

  // Fallback: if nothing found, include the element itself
  if (cellContent.length === 0) {
    cellContent.push(element);
  }

  const cells = [
    headerRow,
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
