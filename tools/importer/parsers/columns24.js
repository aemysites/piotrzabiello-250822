/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner grid containing the content columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Helper function to get immediate child elements with a given class
  function getChildrenByClass(className) {
    return Array.from(grid.children).filter(child => child.classList.contains(className));
  }

  // Helper function to get first descendant of a class within a parent
  function getFirstDescendantByClass(parent, className) {
    if (!parent) return null;
    return parent.querySelector('.' + className);
  }

  // Helper: get first <img> inside a node
  function getFirstImg(parent) {
    if (!parent) return null;
    return parent.querySelector('img');
  }

  // Gather columns for the first row (3 columns)
  const textBlocks = Array.from(grid.querySelectorAll(':scope > .text'));
  // There are 4 text blocks in HTML, 2 images
  // textBlocks[0], textBlocks[1] before logo image
  // textBlocks[2], textBlocks[3] before photo
  const imageBlocks = Array.from(grid.querySelectorAll(':scope > .dynamicmedia'));
  // imageBlocks[0]: logo, imageBlocks[1]: photo

  // Prepare first row after header: [text, text, image]
  const firstCol1 = getFirstDescendantByClass(textBlocks[0], 'cmp-text');
  const firstCol2 = getFirstDescendantByClass(textBlocks[1], 'cmp-text');
  const firstCol3 = getFirstImg(imageBlocks[0]);

  // Prepare second row: [text, text, image]
  const secondCol1 = getFirstDescendantByClass(textBlocks[2], 'cmp-text');
  const secondCol2 = getFirstDescendantByClass(textBlocks[3], 'cmp-text');
  const secondCol3 = getFirstImg(imageBlocks[1]);

  // Below columns: single text, link, download
  // There may be separator elements and other non-content blocks, filter appropriately
  const belowBlocks = Array.from(grid.children).slice(
    Math.max(...[
      grid.children.length - 6, // heuristically after main columns
      textBlocks[3] ? Array.prototype.indexOf.call(grid.children, textBlocks[3]) + 1 : 0,
      imageBlocks[1] ? Array.prototype.indexOf.call(grid.children, imageBlocks[1]) + 1 : 0
    ])
  );
  let belowText = null, belowLink = null, belowDownload = null;
  for (const block of belowBlocks) {
    if (!belowText && block.querySelector && block.querySelector('.cmp-text')) {
      belowText = block.querySelector('.cmp-text');
    } else if (!belowLink && block.querySelector && block.querySelector('.cmp-button')) {
      belowLink = block.querySelector('a.cmp-button');
    } else if (!belowDownload && block.querySelector && block.querySelector('.cmp-download')) {
      belowDownload = block.querySelector('.cmp-download');
    }
  }

  // Compose the table
  const cells = [
    ['Columns (columns24)'],
    [firstCol1, firstCol2, firstCol3],
    [secondCol1, secondCol2, secondCol3],
    [belowText, belowLink, belowDownload]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
