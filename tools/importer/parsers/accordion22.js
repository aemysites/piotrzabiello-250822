/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block (parent of multiple accordion items or fallback to element)
  let accordionBlock = element;
  if (element.classList.contains('cmp-accordion__item')) {
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      const count = parent.querySelectorAll(':scope > .cmp-accordion__item').length;
      if (count > 1) {
        accordionBlock = parent;
        break;
      }
      parent = parent.parentElement;
    }
  }
  // Get all accordion items to process
  const items = Array.from(
    accordionBlock.querySelectorAll(':scope > .cmp-accordion__item')
  );
  const rows = [ ['Accordion (accordion22)'] ];
  (items.length ? items : [element]).forEach((item) => {
    // ----- Title cell -----
    let titleContent = '';
    const header = item.querySelector('.cmp-accordion__header');
    if (header) {
      // Use the actual span if present, else the button or header text
      const titleSpan = header.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleContent = titleSpan;
      } else {
        // fallback: collect visible text from header
        const div = document.createElement('div');
        div.textContent = header.textContent.trim();
        titleContent = div;
      }
    }
    // ----- Content cell -----
    let contentCell;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Collect all direct children of the panel
      const children = Array.from(panel.children);
      // If any child has meaningful content, use all children as a group
      let contentArr = [];
      if (children.length) {
        children.forEach(child => {
          // If child is a container, expose its children, else include as-is
          if (
            child.classList.contains('container') ||
            child.classList.contains('cmp-container')
          ) {
            // Flatten one level
            contentArr.push(...Array.from(child.children));
          } else {
            contentArr.push(child);
          }
        });
        // Remove empty wrappers
        contentArr = contentArr.filter(el => {
          if (el.nodeType !== 1) return true;
          // Remove blank text wrappers or empty divs
          return el.textContent.trim() || el.querySelector('*');
        });
      }
      // Fallback: if still empty, use panel text
      if (contentArr.length === 0) {
        const textDiv = document.createElement('div');
        textDiv.textContent = panel.textContent.trim();
        contentArr.push(textDiv);
      }
      // If only one element, put directly, else array
      contentCell = contentArr.length === 1 ? contentArr[0] : contentArr;
    } else {
      // No panel: fallback to all text in this item
      const txt = item.textContent.trim();
      const div = document.createElement('div');
      div.textContent = txt;
      contentCell = div;
    }
    rows.push([titleContent, contentCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordionBlock.replaceWith(table);
}
