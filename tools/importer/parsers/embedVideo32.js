/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Embed (embedVideo32)'];

  // Find the video element and its source
  const video = element.querySelector('video');
  let videoUrl = '';
  if (video) {
    const source = video.querySelector('source');
    if (source && source.getAttribute('src')) {
      const src = source.getAttribute('src');
      // Use document.baseURI to resolve relative URLs correctly
      try {
        videoUrl = new URL(src, document.baseURI).href;
      } catch (e) {
        videoUrl = src;
      }
    }
  }

  // Get all text content from the element (including button label if present)
  let textContent = '';
  // Get visible text nodes (not just from <button>, but any text)
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      textContent += node.textContent.trim() + ' ';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      textContent += node.textContent.trim() + ' ';
    }
  });
  textContent = textContent.trim();

  // Compose the cell: link and any text content
  let cellContent = [];
  if (videoUrl) {
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
    cellContent.push(videoLink);
  }
  if (textContent) {
    cellContent.push(document.createTextNode(textContent));
  }
  if (cellContent.length === 0) {
    cellContent = [''];
  }

  // Build the table
  const cells = [headerRow, [cellContent]];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
