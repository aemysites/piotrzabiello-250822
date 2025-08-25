/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row exactly as in the requirements
  const headerRow = ['Accordion (accordion47)'];
  const rows = [headerRow];

  // Find all accordion items (direct children)
  const accordionItems = element.querySelectorAll('.cmp-accordion__item');
  accordionItems.forEach((item) => {
    // Title cell: the visible text label for the accordion item
    let titleElem = item.querySelector('.cmp-accordion__title');
    let titleCell = titleElem ? titleElem : document.createTextNode('');

    // Content cell: the body that appears when the panel is expanded
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = '';
    if (panel) {
      // Gather all childNodes excluding empty text nodes
      const nodes = Array.from(panel.childNodes).filter(n => {
        // NodeType 1 = element, 3 = text
        if (n.nodeType === 1) return true;
        if (n.nodeType === 3 && n.textContent.trim() !== '') return true;
        return false;
      });
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else if (nodes.length > 1) {
        contentCell = nodes;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
