/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost .cmp-text, where the <table> and any footnote live
  let tableContainer = element.querySelector('.cmp-text');
  let tableElem = null;
  let noteElem = null;

  if (tableContainer) {
    tableElem = tableContainer.querySelector('table');
    // Look for a footnote or note directly after the table as a text node or <p>
    // This covers e.g. *Verpackungseinheit
    let nodes = Array.from(tableContainer.childNodes);
    let tableFound = false;
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      if (!tableFound && node.nodeType === 1 && node.tagName.toLowerCase() === 'table') {
        tableFound = true;
        continue;
      }
      if (tableFound) {
        if (node.nodeType === 3 && node.textContent.trim()) {
          // Text node
          noteElem = document.createElement('p');
          noteElem.textContent = node.textContent.trim();
          break;
        }
        if (node.nodeType === 1 && node.tagName.toLowerCase() === 'p') {
          noteElem = node;
          break;
        }
        // Sometimes there's whitespace or comment nodes, skip
      }
    }
  }

  // Fallback: find table anywhere in element
  if (!tableElem) {
    tableElem = element.querySelector('table');
  }

  // Build the output block table
  const cells = [];
  cells.push(['Table (bordered)']);
  if (tableElem) {
    // Add table (and note if present) in the single content cell
    if (noteElem) {
      cells.push([[tableElem, noteElem]]);
    } else {
      cells.push([tableElem]);
    }
  } else {
    // No table found, insert empty cell
    cells.push(['']);
  }

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
