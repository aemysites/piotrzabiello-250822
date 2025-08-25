/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the block name in the example
  const headerRow = ['Cards (cardsNoImages17)'];
  const rows = [headerRow];

  // Select all direct child eventteaser (teaser) elements
  const teaserDivs = element.querySelectorAll(':scope > .eventteaser');
  teaserDivs.forEach(teaser => {
    // Each card cell will collect all relevant content from the teaser
    const contentArr = [];

    // Get the .cmp-event-teaser content container
    const cmpTeaser = teaser.querySelector('.cmp-event-teaser');
    if (!cmpTeaser) return;
    const content = cmpTeaser.querySelector('.cmp-teaser__content');
    if (!content) return;

    // Date (if present)
    const date = content.querySelector('.cmp-teaser__date');
    if (date) contentArr.push(date);
    // Title (if present)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) contentArr.push(title);
    // Description (if present)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) contentArr.push(desc);
    // Call-to-action (if present)
    const ctaContainer = content.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const cta = ctaContainer.querySelector('a.cmp-teaser__action-link');
      if (cta) contentArr.push(cta);
    }
    
    // Only add row if there is any content
    if (contentArr.length > 0) {
      rows.push([contentArr]);
    }
  });

  // Create the table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
