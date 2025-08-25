/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Cards (cardsNoImages57)'];

  // Find the download block
  const download = element.querySelector('.cmp-download');
  if (!download) return;

  // Collect all download properties (Dateiname, Größe, Format)
  const props = Array.from(download.querySelectorAll('.cmp-download__property'));
  // Compose divs for each property as in the source html
  const propertyDivs = props.map(prop => {
    const label = prop.querySelector('.cmp-download__property-label');
    const value = prop.querySelector('.cmp-download__property-content');
    if (label && value) {
      const div = document.createElement('div');
      div.textContent = `${label.textContent.trim()}: ${value.textContent.trim()}`;
      return div;
    }
    return null;
  }).filter(Boolean);

  // Find the link (call-to-action)
  const link = download.querySelector('a.cmp-download__action');

  // Compose cell contents: all propertyDivs followed by link (if present)
  const cellContents = [...propertyDivs];
  if (link) {
    cellContents.push(link);
  }

  // Compose table rows: header, card row with all content
  const rows = [headerRow, [cellContents]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
