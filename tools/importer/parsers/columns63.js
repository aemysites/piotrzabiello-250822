/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find main content and image containers
  const contentBlock = element.querySelector('.cmp-teaser__content');
  let textCell = null;
  if (contentBlock) {
    // Use the entire content block for text (includes description)
    textCell = contentBlock;
  } else {
    // Fallback: use all paragraphs inside element
    const paragraphs = Array.from(element.querySelectorAll('p'));
    if (paragraphs.length) {
      textCell = document.createElement('div');
      paragraphs.forEach(p => textCell.appendChild(p));
    } else {
      textCell = document.createElement('div');
      textCell.textContent = '';
    }
  }

  // Defensive: Find image container
  const imageBlock = element.querySelector('.cmp-teaser__image');
  let imageCell = null;
  if (imageBlock) {
    // Use the image container directly
    imageCell = imageBlock;
  } else {
    // Fallback: use first img
    const img = element.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      imageCell = document.createElement('div');
      imageCell.textContent = '';
    }
  }

  // Table header
  const headerRow = ['Columns (columns63)'];
  // Table content row: text left, image right
  const contentRow = [textCell, imageCell];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
