/* global WebImporter */
export default function parse(element, { document }) {
  // Find the product overview list
  const list = element.querySelector('ul.cmp-product-overview');
  if (!list) return;

  // Table header matches exactly
  const cells = [['Cards (cards7)']];

  // All product items
  const items = Array.from(list.querySelectorAll('li.cmp-product-overview__item'));
  items.forEach((item) => {
    // Image extraction: <img> inside the card
    const img = item.querySelector('img');

    // Text extraction: get title and button (as in screenshot)
    const teaserContent = item.querySelector('.cmp-teaser__content');
    let textArr = [];
    if (teaserContent) {
      // Title (h2)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) textArr.push(title);
      // Button (call-to-action)
      const button = teaserContent.querySelector('.cmp-teaser__button');
      if (button) textArr.push(button);
    }
    // Edge case: missing content
    if (textArr.length === 0 && teaserContent) textArr.push(teaserContent);

    // Push image and text to the table
    cells.push([
      img || '',
      textArr.length === 1 ? textArr[0] : textArr
    ]);
  });

  // Create the table block and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
