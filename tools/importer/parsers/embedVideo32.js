/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Embed (embedVideo32)'];

  // Defensive: find the <video> element and its <source>
  const video = element.querySelector('video');
  let videoSrc = '';
  if (video) {
    const source = video.querySelector('source');
    if (source && source.src) {
      videoSrc = source.src;
    }
  }

  // Collect any visible text content from the element (e.g., overlay text)
  let textContent = '';
  // Get all text nodes inside the element
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walker.nextNode())) {
    const txt = node.textContent.trim();
    if (txt) {
      textContent += (textContent ? ' ' : '') + txt;
    }
  }

  // Only proceed if we have a video src
  if (!videoSrc) {
    element.remove();
    return;
  }

  // Create the link element for the video src
  const link = document.createElement('a');
  link.href = videoSrc;
  link.textContent = videoSrc;

  // Compose cell content: include text content if present
  let cellContent = [];
  if (textContent) {
    cellContent.push(textContent);
  }
  cellContent.push(link);

  // Content row: cell with text (if any) and link
  const contentRow = [cellContent];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
