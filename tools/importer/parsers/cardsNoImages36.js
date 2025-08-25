/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we create the correct block header, exactly as in the example
  const headerRow = ['Cards (cardsNoImages36)'];

  // Find the innermost cmp-download element
  const downloadRoot = element.querySelector('.cmp-download');
  if (!downloadRoot) return;

  // Get the download link (call-to-action), use the element reference
  const link = downloadRoot.querySelector('.cmp-download__action');

  // Collect all text related to file metadata (format, size)
  const formatEl = downloadRoot.querySelector('.cmp-download__property--format .cmp-download__property-content');
  const sizeEl = downloadRoot.querySelector('.cmp-download__property--size .cmp-download__property-content');

  let metaText = '';
  if (formatEl && sizeEl) {
    metaText = `${formatEl.textContent.trim().toUpperCase()}, ${sizeEl.textContent.trim()}`;
  } else if (sizeEl) {
    metaText = sizeEl.textContent.trim();
  } else if (formatEl) {
    metaText = formatEl.textContent.trim().toUpperCase();
  }

  // Assemble the card cell
  const cardCellContent = [];
  // Include the call-to-action link if present
  if (link) {
    cardCellContent.push(link);
  }
  // Include metadata as <p> only if there is text
  if (metaText) {
    const metaP = document.createElement('p');
    metaP.textContent = metaText;
    cardCellContent.push(metaP);
  }
  // Fallback: If for some reason nothing is included yet, get all visible property content
  if (cardCellContent.length === 0) {
    const propContents = Array.from(downloadRoot.querySelectorAll('.cmp-download__property-content'));
    propContents.forEach((el) => {
      cardCellContent.push(el);
    });
  }

  // Table structure: header then card row
  const cells = [
    headerRow,
    [cardCellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}
