/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row exactly as in the example
  const headerRow = ['Cards (cardsNoImages41)'];
  const rows = [headerRow];

  // Get all direct .download card wrappers
  const cardEls = Array.from(element.querySelectorAll(':scope .download'));

  cardEls.forEach(cardEl => {
    const cmpDownload = cardEl.querySelector('.cmp-download');
    if (!cmpDownload) return;

    // Get the download link and label
    const link = cmpDownload.querySelector('.cmp-download__action');
    let linkText = '';
    if (link) {
      const span = link.querySelector('.cmp-download__action-text');
      if (span) {
        linkText = span.textContent.trim();
      } else {
        linkText = link.textContent.trim();
      }
    }

    // Properties: Collect all dd (content) and dt (label) under .cmp-download__properties
    const propsDl = cmpDownload.querySelector('.cmp-download__properties');
    let descriptionText = '';
    if (propsDl) {
      // Find all property contents and their labels
      const propertyDivs = propsDl.querySelectorAll(':scope > .cmp-download__property');
      let size = '', format = '';
      propertyDivs.forEach(div => {
        const label = div.querySelector('.cmp-download__property-label');
        const content = div.querySelector('.cmp-download__property-content');
        if (!label || !content) return;
        const ltxt = label.textContent.trim().toLowerCase();
        if (ltxt === 'größe') size = content.textContent.trim();
        if (ltxt === 'format') format = content.textContent.trim();
      });
      if (format && size) {
        descriptionText = `${format.toUpperCase()}, ${size}`;
      } else if (format) {
        descriptionText = format.toUpperCase();
      } else if (size) {
        descriptionText = size;
      }
    }

    // Compose the cell content, referencing existing live elements
    const cellContent = [];
    if (linkText) {
      const strong = document.createElement('strong');
      strong.textContent = linkText;
      cellContent.push(strong);
    }
    if (descriptionText) {
      cellContent.push(document.createElement('br'));
      const desc = document.createElement('span');
      desc.textContent = descriptionText;
      cellContent.push(desc);
    }
    // If there is a link, add it (as CTA) at the end, but only if it is not redundant
    // In this case, the CTA is already the strong title, so don't repeat the link
    // If you want the actual link (for accessibility), you could add it with visually hidden text, but the markdown doesn't show it
    // Only add the link if it contains further rich content (not in this structure), so we skip it.

    // If no content was added, fallback to placing the whole cmpDownload block
    if (cellContent.length === 0) {
      cellContent.push(cmpDownload);
    }

    rows.push([cellContent]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
