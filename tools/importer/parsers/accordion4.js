/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ["Accordion (accordion4)"];
  const rows = [];

  // Find all accordion items in the element
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach(item => {
    // Title cell: get the span.cmp-accordion__title inside the button
    let titleCell;
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const span = button.querySelector('.cmp-accordion__title');
      if (span) {
        // Reference the actual span DOM node
        titleCell = span;
      } else {
        // If not found, fallback to the button's text
        titleCell = document.createTextNode(button.textContent.trim());
      }
    } else {
      // No button found, fallback to item text
      titleCell = document.createTextNode(item.textContent.trim());
    }

    // Content cell: all content in the panel div[data-cmp-hook-accordion="panel"]
    let contentCell;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // If the panel is empty, use an empty string
      if (panel.childElementCount === 0 && !panel.textContent.trim()) {
        contentCell = document.createTextNode('');
      } else {
        // Collect all children (usually one wrapper div)
        // If only one child, use it directly. If multiple, put them in an array.
        const children = Array.from(panel.children);
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          // No children, but maybe text content exists
          if (panel.textContent.trim()) {
            contentCell = document.createTextNode(panel.textContent.trim());
          } else {
            contentCell = document.createTextNode('');
          }
        }
      }
    } else {
      contentCell = document.createTextNode('');
    }

    rows.push([titleCell, contentCell]);
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
