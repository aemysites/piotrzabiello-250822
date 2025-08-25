/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by the block specification
  const headerRow = ['Cards (cardsNoImages5)'];
  const cells = [headerRow];

  // Find all direct card elements (cmp-download)
  const downloads = element.querySelectorAll('.cmp-download');
  downloads.forEach((download) => {
    const cardContent = [];

    // 1. If there is a h3 with link (document title), include it as strong text (retaining semantic structure)
    const h3 = download.querySelector('h3');
    if (h3 && h3.textContent.trim()) {
      const h3Link = h3.querySelector('a');
      if (h3Link && h3Link.textContent.trim()) {
        // Use strong for the heading
        const h3Strong = document.createElement('strong');
        h3Strong.textContent = h3Link.textContent.trim();
        cardContent.push(h3Strong);
        cardContent.push(document.createElement('br'));
      }
    }

    // 2. The main CTA link for download (always present)
    const cta = download.querySelector('.cmp-download__action');
    if (cta) {
      // Reference the existing <a> element directly
      cardContent.push(cta);
      cardContent.push(document.createElement('br'));
    }

    // 3. Properties (Format and Size)
    // Extract text for format and size, preserving order
    let format = '';
    let size = '';
    const formatProp = download.querySelector('.cmp-download__property--format .cmp-download__property-content');
    if (formatProp) {
      format = formatProp.textContent.trim().toUpperCase();
    }
    const sizeProp = download.querySelector('.cmp-download__property--size .cmp-download__property-content');
    if (sizeProp) {
      size = sizeProp.textContent.trim();
    }
    // Compose the info string for the card
    if (format || size) {
      const infoString = [format, size].filter(Boolean).join(', ');
      cardContent.push(document.createTextNode(infoString));
    }

    // Add card only if there's meaningful content
    if (cardContent.length) {
      cells.push([cardContent]);
    }
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
