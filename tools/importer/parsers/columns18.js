/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: matches exact example
  const headerRow = ['Columns (columns18)'];

  // 2. Extract the left column: the content description
  // This is a div with class 'b-description', which contains actual text
  // We want to reference the actual element for robustness
  let leftCol = null;
  const scrollContent = element.querySelector('.b-scrollabel-content');
  if (scrollContent) {
    // We expect: .b-content > .b-description
    const content = scrollContent.querySelector('.b-content');
    if (content) {
      // .b-description holds the text (with .b-text inside)
      const desc = content.querySelector('.b-description');
      if (desc) {
        leftCol = desc;
      }
    }
  }

  // 3. Extract the right column: the block of buttons
  // This is the '.b-flex.b-buttons' element (which includes all buttons)
  let rightCol = null;
  const buttonsBlock = element.querySelector('.b-flex.b-buttons');
  if (buttonsBlock) {
    rightCol = buttonsBlock;
  }

  // 4. Build the table respecting example structure: header (single column), then content row (two columns)
  // If any column is missing, fill with empty string (preserves structure)
  const cells = [
    headerRow,
    [leftCol || '', rightCol || '']
  ];
  
  // 5. Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element with the block
  element.replaceWith(block);
}
