/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Embed (embedVideo32)'];

  // Find the <video> element and its <source>
  const video = element.querySelector('video');
  let videoUrl = '';
  if (video) {
    const source = video.querySelector('source');
    if (source && source.src) {
      videoUrl = source.src;
    }
  }

  // Defensive: collect any visible text content from the element
  let textContent = '';
  // Get all text nodes inside the element
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      // Only accept non-empty text
      return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  let node;
  while ((node = walker.nextNode())) {
    textContent += node.textContent.trim() + ' ';
  }
  textContent = textContent.trim();

  // Only proceed if we have a video URL
  if (!videoUrl) {
    return;
  }

  // Create a link element to the video file
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;

  // Compose cell content: include text if present
  let cellContent;
  if (textContent) {
    cellContent = [textContent, document.createElement('br'), link];
  } else {
    cellContent = [link];
  }

  // Content row: cell with all content
  const contentRow = [cellContent];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
