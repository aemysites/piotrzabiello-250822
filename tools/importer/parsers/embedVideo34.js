/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main dynamic media block
  const dynamicMedia = element.querySelector('.s7dm-dynamic-media');
  if (!dynamicMedia) return;

  // Try to get the poster image URL from the .s7videoelement's poster attribute
  let posterUrl = '';
  const videoElementDiv = dynamicMedia.querySelector('.s7videoelement');
  if (videoElementDiv && videoElementDiv.hasAttribute('poster')) {
    posterUrl = videoElementDiv.getAttribute('poster');
  }

  // Get the video asset link from data-videoserver and data-asset-path
  let videoUrl = '';
  const assetPath = dynamicMedia.getAttribute('data-asset-path');
  const videoServer = dynamicMedia.getAttribute('data-videoserver');
  if (assetPath && videoServer) {
    videoUrl = videoServer + assetPath;
  }
  // Fallback: if nothing found, try to get from <video> src
  if (!videoUrl) {
    const videoTag = dynamicMedia.querySelector('video');
    if (videoTag && videoTag.hasAttribute('src')) {
      videoUrl = videoTag.getAttribute('src');
    }
  }

  // Extract any visible text content directly associated with the video area
  // Only take direct children (to avoid lots of hidden/irrelevant markup)
  const textContents = [];
  const parent = dynamicMedia.closest('.cq-dd-image') || dynamicMedia;
  Array.from(parent.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE && node !== dynamicMedia) {
      // Only add if tag is not style/script/link and has visible text
      if (!['STYLE', 'SCRIPT', 'LINK'].includes(node.tagName)) {
        const txt = node.textContent.trim();
        if (txt) textContents.push(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = node.textContent.trim();
      textContents.push(p);
    }
  });

  // Compose the cell content in the block order: image, text, link
  const cellContent = [];
  if (posterUrl) {
    const img = document.createElement('img');
    img.src = posterUrl;
    img.alt = '';
    cellContent.push(img);
  }
  textContents.forEach(tc => cellContent.push(tc));
  if (videoUrl) {
    if (cellContent.length > 0) cellContent.push(document.createElement('br'));
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    cellContent.push(a);
  }

  // Create block table structure to match the example
  const headerRow = ['Embed (embedVideo34)'];
  const contentRow = [cellContent];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
