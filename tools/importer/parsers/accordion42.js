/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Accordion (accordion42)'];
  const rows = [headerRow];

  // Find all accordion item elements
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title: find the button > span.cmp-accordion__title
    let titleNode = null;
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        // Use the existing span element (do not clone)
        titleNode = titleSpan;
      }
    }
    // Fallback: if title not found
    if (!titleNode) {
      titleNode = document.createTextNode('');
    }

    // Content: panel body
    let contentNode = null;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Usually content is inside a .cmp-container or .text, or aem-GridColumn
      // Find the first content block with meaningful text
      let childContent = null;
      childContent = panel.querySelector('.cmp-container');
      if (!childContent) {
        childContent = panel.querySelector('.text');
      }
      if (!childContent) {
        // Some panels may have content directly inside themselves
        // If there are multiple direct elements, wrap them in a div
        const children = Array.from(panel.children);
        if (children.length === 1) {
          childContent = children[0];
        } else if (children.length > 1) {
          const wrapper = document.createElement('div');
          children.forEach(child => wrapper.appendChild(child));
          childContent = wrapper;
        } else {
          childContent = panel;
        }
      }
      contentNode = childContent;
    }
    if (!contentNode) {
      contentNode = document.createTextNode('');
    }

    rows.push([titleNode, contentNode]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
