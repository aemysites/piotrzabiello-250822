/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find main content and buttons for columns
  // Column 1: Description
  let description = null;
  const descContainer = element.querySelector('.b-description');
  if (descContainer) {
    description = descContainer;
  } else {
    // fallback: first <div> with <p>
    const fallbackDesc = element.querySelector('div p');
    if (fallbackDesc) {
      description = fallbackDesc.parentElement;
    }
  }

  // Column 2: Buttons (all buttons grouped)
  // There are two button containers: .b-buttons and its child .b-flex
  let buttonsCell = null;
  const buttonsContainer = element.querySelector('.b-buttons');
  if (buttonsContainer) {
    // Get all direct button children and also those inside nested .b-flex
    const directButtons = Array.from(buttonsContainer.querySelectorAll(':scope > button'));
    const nestedFlex = buttonsContainer.querySelector('.b-flex');
    let nestedButtons = [];
    if (nestedFlex) {
      nestedButtons = Array.from(nestedFlex.querySelectorAll('button'));
    }
    // Combine all buttons into a single cell
    buttonsCell = [...directButtons, ...nestedButtons];
  }

  // Build the table rows
  const headerRow = ['Columns (columns18)'];
  const contentRow = [description, buttonsCell];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
