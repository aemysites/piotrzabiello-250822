/* global WebImporter */
export default function parse(element, { document }) {
  // Block header: must be exactly as in the example
  const rows = [['Cards (cardsNoImages2)']];

  // Find all cards (each .download is a card)
  const downloadWrappers = element.querySelectorAll('.download');

  downloadWrappers.forEach((downloadWrapper) => {
    // Find the cmp-download inside
    const cmpDownload = downloadWrapper.querySelector('.cmp-download');
    if (!cmpDownload) return;

    // Extract: CTA link with text
    const actionLink = cmpDownload.querySelector('.cmp-download__action');
    // Defensive: skip if link missing
    if (!actionLink) return;

    // Extract detailed info (PDF, size)
    let format = '';
    let size = '';
    const dl = cmpDownload.querySelector('dl.cmp-download__properties');
    if (dl) {
      const formatElem = dl.querySelector('.cmp-download__property--format .cmp-download__property-content');
      if (formatElem) format = formatElem.textContent.trim().toUpperCase();
      const sizeElem = dl.querySelector('.cmp-download__property--size .cmp-download__property-content');
      if (sizeElem) size = sizeElem.textContent.trim();
    }
    let infoText = '';
    if (format && size) {
      infoText = `${format}, ${size}`;
    } else if (format) {
      infoText = format;
    } else if (size) {
      infoText = size;
    }

    // Create the info paragraph element if infoText exists
    let infoPara = null;
    if (infoText) {
      infoPara = document.createElement('p');
      infoPara.textContent = infoText;
    }

    // Compose cell: CTA link followed by PDF info (all referenced, not cloned)
    const cellContent = infoPara ? [actionLink, infoPara] : [actionLink];
    rows.push([cellContent]);
  });

  // Create the block table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
