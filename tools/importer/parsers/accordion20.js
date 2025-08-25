/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW
  const cells = [['Accordion (accordion20)']];

  // Locate the main accordion container (prefer .cmp-accordion)
  let accordion = element.querySelector('.cmp-accordion');
  if (!accordion) {
    // fallback for variant class names
    accordion = element.querySelector('[class*="accordion"]');
  }
  if (!accordion) return;

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title: Use the text from .cmp-accordion__title (if available), else button
    let titleElem = item.querySelector('.cmp-accordion__title');
    let title = '';
    if (titleElem) {
      title = titleElem.textContent.trim();
    } else {
      // fallback: get full button text (excluding icon)
      const btn = item.querySelector('.cmp-accordion__button');
      if (btn) {
        // Exclude icon
        let btnText = '';
        btn.childNodes.forEach((node) => {
          if (node.nodeType === 3) {
            btnText += node.textContent;
          } else if (node.classList && !node.classList.contains('cmp-accordion__icon')) {
            btnText += node.textContent;
          }
        });
        title = btnText.trim();
      }
    }
    // Content: Reference the actual panel node (include all child HTML)
    let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Remove 'aria-hidden' so content is visible
      panel.removeAttribute('aria-hidden');
    }
    // Add row: [title, content] (content can be null)
    cells.push([
      title,
      panel
    ]);
  });

  // Create the block table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
